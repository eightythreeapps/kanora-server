import { DataSource } from 'typeorm';
import { IMusicMetadata } from '../interfaces/IMusicMetadataReader.js';
import { IMusicRepository, ILibraryResponse } from '../interfaces/IMusicRepository.js';
import { Artist } from '../entities/Artist.js';
import { Album } from '../entities/Album.js';
import { Track } from '../entities/Track.js';
import { IFileService } from '../interfaces/IFileService.js';
import * as path from 'path';
import * as fs from 'fs/promises';
import { LibraryMetadata } from '../entities/LibraryMetadata.js';

// Public directories for serving files
const PUBLIC_DIR = 'public';
const ARTWORK_DIR = path.join(PUBLIC_DIR, 'artwork');
const LIBRARY_DIR = path.join(PUBLIC_DIR, 'library');

export class MusicRepository implements IMusicRepository {
    constructor(
        private dataSource: DataSource,
        private fileService: IFileService
    ) {
        // Ensure public directories exist
        Promise.all([
            fs.mkdir(ARTWORK_DIR, { recursive: true }),
            fs.mkdir(LIBRARY_DIR, { recursive: true })
        ]).catch(console.error);
    }

    private get trackRepo() { return this.dataSource.getRepository(Track); }
    private get albumRepo() { return this.dataSource.getRepository(Album); }
    private get artistRepo() { return this.dataSource.getRepository(Artist); }
    private get metadataRepo() { return this.dataSource.getRepository(LibraryMetadata); }

    // Helper method to save artwork and return URL
    private async saveArtwork(albumId: string, artwork: Buffer): Promise<string> {
        const artworkPath = path.join(ARTWORK_DIR, `${albumId}.jpg`);
        await fs.writeFile(artworkPath, artwork);
        return `/artwork/${albumId}.jpg`;
    }

    // Helper method to copy a file to the library and return its new path
    private async copyToLibrary(sourcePath: string, artistName: string, albumTitle: string, trackTitle: string): Promise<string> {
        // Create artist and album directories
        const artistDir = path.join(LIBRARY_DIR, this.sanitizePath(artistName));
        const albumDir = path.join(artistDir, this.sanitizePath(albumTitle));
        await fs.mkdir(artistDir, { recursive: true });
        await fs.mkdir(albumDir, { recursive: true });

        // Generate new file path
        const extension = path.extname(sourcePath);
        const fileName = this.sanitizePath(trackTitle) + extension;
        const destPath = path.join(albumDir, fileName);
        const relativePath = path.relative(PUBLIC_DIR, destPath);

        // Copy the file
        await fs.copyFile(sourcePath, destPath);

        // Return the path relative to the public directory
        return '/' + relativePath.split(path.sep).join('/');
    }

    // Helper method to sanitize file/directory names
    private sanitizePath(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Helper method to find or create an album
    private async findOrCreateAlbum(metadata: IMusicMetadata, artist: Artist): Promise<Album> {
        const existing = await this.albumRepo.findOne({
            where: { 
                title: metadata.album,
                artist: { id: artist.id }
            }
        });
        if (existing) return existing;

        const album = await this.saveAlbum({
            title: metadata.album,
            artist,
            year: metadata.year
        });

        // If metadata includes artwork, save it
        if (metadata.artwork) {
            album.artworkUrl = await this.saveArtwork(album.id, metadata.artwork);
            await this.albumRepo.save(album);
        }

        return album;
    }

    async getAllArtists(since?: Date): Promise<ILibraryResponse> {
        const query = this.artistRepo.createQueryBuilder('artist')
            .leftJoinAndSelect('artist.albums', 'album')
            .leftJoinAndSelect('album.tracks', 'track');

        if (since) {
            query.where('track.dateAdded > :since', { since });
        }

        const [artists, metadata] = await Promise.all([
            query.getMany(),
            this.getLibraryMetadata()
        ]);

        const mappedArtists = artists
            .map(artist => ({
                id: artist.id,
                name: artist.name,
                albums: artist.albums
                    .map(album => ({
                        id: album.id,
                        title: album.title,
                        year: album.year,
                        artworkUrl: album.artworkUrl,
                        tracks: album.tracks
                            .filter(track => !since || track.dateAdded > since)
                            .map(track => ({
                                id: track.id,
                                title: track.title,
                                trackNumber: track.trackNumber,
                                duration: track.duration,
                                filePath: track.filePath,
                                dateAdded: track.dateAdded
                            }))
                    }))
                    .filter(album => album.tracks.length > 0)
            }))
            .filter(artist => artist.albums.length > 0);

        return {
            artists: mappedArtists,
            metadata: {
                lastScanDate: metadata?.lastScanDate || new Date(),
                totalTracks: metadata?.totalTracks || 0,
                totalAlbums: metadata?.totalAlbums || 0,
                totalArtists: metadata?.totalArtists || 0
            }
        };
    }

    async getAllAlbums(): Promise<Album[]> {
        return this.albumRepo.find({
            relations: {
                artist: true,
                tracks: true
            }
        });
    }

    async getAllTracks(): Promise<Track[]> {
        return this.trackRepo.find({
            relations: {
                artist: true,
                album: true
            }
        });
    }

    async getTrackById(id: string): Promise<Track | null> {
        return this.trackRepo.findOne({
            where: { id },
            relations: {
                artist: true,
                album: true
            }
        });
    }

    async saveArtist(artist: Partial<Artist>): Promise<Artist> {
        const newArtist = this.artistRepo.create(artist);
        return this.artistRepo.save(newArtist);
    }

    async saveAlbum(album: Partial<Album>): Promise<Album> {
        const newAlbum = this.albumRepo.create(album);
        return this.albumRepo.save(newAlbum);
    }

    async saveTrack(track: Partial<Track>): Promise<Track> {
        const newTrack = this.trackRepo.create(track);
        return this.trackRepo.save(newTrack);
    }

    async getLibraryMetadata(): Promise<LibraryMetadata | null> {
        const metadata = await this.metadataRepo.find({
            order: { lastScanDate: 'DESC' },
            take: 1
        });
        return metadata[0] || null;
    }

    async saveLibraryMetadata(metadata: Partial<LibraryMetadata>): Promise<LibraryMetadata> {
        const newMetadata = this.metadataRepo.create(metadata);
        return this.metadataRepo.save(newMetadata);
    }

    // Helper method to find or create an artist
    private async findOrCreateArtist(name: string): Promise<Artist> {
        const existing = await this.artistRepo.findOne({ where: { name } });
        if (existing) return existing;

        return this.saveArtist({ name });
    }

    // Helper method to process a track
    async processTrack(metadata: IMusicMetadata, filePath: string): Promise<Track> {
        const artist = await this.findOrCreateArtist(metadata.artist);
        const album = await this.findOrCreateAlbum(metadata, artist);

        // Check if track already exists
        const existing = await this.trackRepo.findOne({
            where: { filePath },
            relations: {
                artist: true,
                album: true
            }
        });
        if (existing) return existing;

        // Copy file to library and get new path
        const newFilePath = await this.copyToLibrary(
            filePath,
            metadata.artist,
            metadata.album,
            metadata.title
        );

        // Save track with new file path
        return this.saveTrack({
            title: metadata.title,
            artist,
            album,
            trackNumber: metadata.trackNumber,
            duration: metadata.duration,
            filePath: newFilePath,
            dateAdded: new Date()
        });
    }

    async findTrackByPath(filePath: string): Promise<Track | null> {
        return this.trackRepo.findOne({
            where: { filePath },
            relations: {
                artist: true,
                album: true
            }
        });
    }

    async findArtistByName(name: string): Promise<Artist | null> {
        return this.artistRepo.findOne({
            where: { name },
            relations: {
                albums: true
            }
        });
    }

    async findAlbumByTitleAndArtist(title: string, artistId: string): Promise<Album | null> {
        return this.albumRepo.findOne({
            where: {
                title,
                artist: { id: artistId }
            },
            relations: {
                artist: true,
                tracks: true
            }
        });
    }
} 