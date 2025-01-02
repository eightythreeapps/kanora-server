import { DataSource } from 'typeorm';
import { IMusicMetadata } from '../interfaces/IMusicMetadataReader.js';
import { IMusicRepository } from '../interfaces/IMusicRepository.js';
import { Artist } from '../entities/Artist.js';
import { Album } from '../entities/Album.js';
import { Track } from '../entities/Track.js';
import { IFileService } from '../interfaces/IFileService.js';
import * as path from 'node:path';
import { titleCase } from 'typeorm/util/StringUtils.js';
import { format } from 'morgan';
import { APIResponse } from '../interfaces/IAPIResponse.js';
import { ArtistResponse } from '../interfaces/IArtistResponse.js';
import * as fs from 'fs/promises';
import { Buffer } from 'buffer';
import { LibraryMetadata } from '../entities/LibraryMetadata.js';
import { LibraryMetadataResponse } from '../interfaces/ILibraryMetadataResponse.js';
import * as crypto from 'crypto';

export class MusicRepository implements IMusicRepository {
    constructor(
        private dataSource: DataSource,
        private fileService: IFileService
    ) {}

    private get trackRepo() { return this.dataSource.getRepository(Track); }
    private get albumRepo() { return this.dataSource.getRepository(Album); }
    private get artistRepo() { return this.dataSource.getRepository(Artist); }
    
    private get metadataRepo() { 
        return this.dataSource.getRepository(LibraryMetadata); 
    }
   
    async upsertArtist(name: string): Promise<Artist> {
        const existing = await this.artistRepo.findOne({ where: { name } });
        if (existing) return existing;

        const now = new Date().toISOString();
        return await this.artistRepo.save({
            name,
            createdAt: now,
            updatedAt: now
        });
    }

    private async saveAlbumArtwork(
        artwork: { data: Buffer; format: string },
        albumId: string,
    ): Promise<string> {
        const artworkBuffer = Buffer.from(artwork.data);
        const fileExtension = artwork.format.split('/')[1] || 'jpg';
        
        const artworkFileName = `${albumId}.${fileExtension}`;
        const albumArtPath = path.join('public', 'artwork', artworkFileName);

        await fs.mkdir(path.join('public', 'artwork'), { recursive: true });

        try {
            await fs.writeFile(albumArtPath, artworkBuffer);
            return albumArtPath;
        } catch (error) {
            console.error('Failed to save album artwork:', error);
            return "";
        }
    }

    async upsertAlbum(metadata: IMusicMetadata, artist: Artist): Promise<Album> {
        if (!metadata.common.album) {
            throw new Error('Album title is required');
        }

        const now = new Date().toISOString();
        const existing = await this.albumRepo.findOne({
            where: { 
                title: metadata.common.album,
                artist: { id: artist.id }
            }
        });

        if (existing) return existing;

        const albumId = crypto.randomUUID();

        let albumArtPath = "";

        if (metadata.common.albumArtwork && metadata.common.albumArtwork.length > 0) {
            albumArtPath = await this.saveAlbumArtwork(
                {
                    data: Buffer.from(metadata.common.albumArtwork[0].data), 
                    format: metadata.common.albumArtwork[0].format
                },
                albumId
            );
        }

        return await this.albumRepo.save({
            id: albumId,
            title: metadata.common.album,
            createdAt: now, 
            updatedAt: now,
            year: metadata.common.year || null,
            artist,
            albumArtPath
        });
    }

    async upsertTrack(metadata: IMusicMetadata, filePath: string): Promise<Track> {
        const fileName = path.basename(filePath, path.extname(filePath));
        const trackTitle = metadata.common.title || fileName;

        const existing = await this.trackRepo.findOne({
            where: { filePath }
        });

        if (existing) return existing;

        // Get or create the main artist, defaulting to Unknown Artist
        const mainArtist = await this.upsertArtist(
            metadata.common.artists?.[0] || 'Unknown Artist'
        );

        // Modify metadata if album is missing
        if (!metadata.common.album) {
            metadata.common.album = 'Unknown Album';
        }

        // Get or create the album
        const album = await this.upsertAlbum(metadata, mainArtist);

        // Create additional artists if they exist, filtering out empty/null values
        const artists = await Promise.all(
            (metadata.common.artists || ['Unknown Artist'])
                .filter(artist => artist && artist.trim().length > 0)
                .map(artistName => this.upsertArtist(artistName))
        );

        const now = new Date().toISOString();

        // Check if the track already exists in the organized location
        const organizedFilePath = this.fileService.organizeMusicFile({
            artistName: this.fileService.makeUrlFriendly(mainArtist.name).toString(),
            albumName: this.fileService.makeUrlFriendly(album.title).toString(),
            trackNumber: metadata.common.track?.no || null,
            trackName: this.fileService.makeUrlFriendly(trackTitle).toString(),
            sourcePath: filePath
        });

        const organizedPath = await organizedFilePath;
        const existingOrganized = await this.trackRepo.findOne({
            where: { filePath: organizedPath }
        });

        if (existingOrganized) {
            console.log("Skipping import: "+existingOrganized+" already exists.")
            return existingOrganized;
        }
        
        // Move the file only if it doesn't exist in the organized location
        const newFilePath = await organizedFilePath;
        
        const track = await this.trackRepo.save({
            title: trackTitle,
            trackNumber: metadata.common.track?.no || null,
            diskNumber: metadata.common.disk?.no || null,
            duration: metadata.format?.duration || null,
            filePath: newFilePath,
            albumArtPath: album.albumArtPath,
            genres: metadata.common.genres || [],
            encodedBy: metadata.common.encodedby || null,
            createdAt: now,
            updatedAt: now,
            album,
            artists
        });

        // Update library metadata after saving track
        await this.updateLibraryMetadata();

        return track;
    }

    private async getLatestMetadata(): Promise<LibraryMetadata | null> {
        return await this.metadataRepo.findOne({ 
            where: {},
            order: { lastScanTime: 'DESC' }
        });
    }

    async getAllArtists(): Promise<APIResponse<ArtistResponse>> {
        const [artists, metadata] = await Promise.all([
            this.artistRepo.find({
                relations: {
                    albums: {
                        tracks: true
                    }
                }
            }),
            this.getLatestMetadata()
        ]);

        return {
            data: artists.map(artist => this.convertToResponse(artist)),
            metadata: {
                lastScanned: metadata?.lastScanTime || new Date().toISOString(),
                totalTracks: metadata?.totalTracks || 0,
                totalAlbums: metadata?.totalAlbums || 0,
                totalArtists: metadata?.totalArtists || 0
            }
        };
    }

    private convertToResponse(artist: Artist): ArtistResponse {
        const baseUrl = process.env.HOST_URL || 'http://localhost:3001';

        return {
            id: artist.id,
            name: artist.name,
            bio: "",
            artistBannerImagePath: "",
            albums: artist.albums?.map(album => ({
                id: album.id,
                title: album.title,
                releaseYear: album.year,
                albumArtPath: album.albumArtPath || "",
                genres: [],
                tracks: album.tracks.map(track => ({
                    id: track.id,
                    position: track.trackNumber,
                    title: track.title,
                    duration: track.duration,
                    filePath: `${baseUrl}/api/stream/${track.id}`,
                    artworkFilePath: album.albumArtPath || null,
                    format: track.codec,
                }))
            }))
        };
    }

    private async updateLibraryMetadata(): Promise<void> {
        const now = new Date().toISOString();
        const [totalTracks, totalAlbums, totalArtists] = await Promise.all([
            this.trackRepo.count(),
            this.albumRepo.count(),
            this.artistRepo.count()
        ]);

        let metadata = await this.getLatestMetadata();

        if (!metadata) {
            metadata = this.metadataRepo.create({
                lastScanTime: now,
            });
        }

        metadata.lastScanTime = now;
        metadata.totalTracks = totalTracks;
        metadata.totalAlbums = totalAlbums;
        metadata.totalArtists = totalArtists;

        await this.metadataRepo.save(metadata);
    }

    async scanLibrary(): Promise<LibraryMetadataResponse> {
        // Get all tracks with their file paths
        const tracks = await this.trackRepo.find();
        let hasChanges = false;
        
        // Process each track
        for (const track of tracks) {
            try {
                // Check if file still exists
                const fileExists = await fs.access(track.filePath)
                    .then(() => true)
                    .catch(() => false);

                if (!fileExists) {
                    // If file doesn't exist, remove from database
                    await this.trackRepo.remove(track);
                    hasChanges = true;
                    console.log(`Removed missing track: ${track.filePath}`);
                }
            } catch (error) {
                console.error(`Failed to check track ${track.filePath}:`, error);
            }
        }

        // Only update metadata if changes were found
        if (hasChanges) {
            await this.updateLibraryMetadata();
            console.log('Library metadata updated due to changes');
        } else {
            console.log('No changes found in library scan');
        }

        // Get latest metadata to return
        const metadata = await this.getLatestMetadata();

        if (!metadata) {
            throw new Error('Failed to retrieve library metadata');
        }

        return {
            lastScanned: metadata.lastScanTime,
            totalTracks: metadata.totalTracks,
            totalAlbums: metadata.totalAlbums, 
            totalArtists: metadata.totalArtists,
        };
    }

    async getTrackById(trackId: string) {
        const track = await this.trackRepo.findOne({
            where: { id: trackId }
        });

        return track
    }
} 