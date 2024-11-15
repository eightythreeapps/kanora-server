import { DataSource } from 'typeorm';
import { IMusicMetadata } from '../interfaces/IMusicMetadataReader.js';
import { IMusicRepository } from '../interfaces/IMusicRepository.js';
import { Artist } from '../entities/Artist.js';
import { Album } from '../entities/Album.js';
import { Track } from '../entities/Track.js';
import { IFileService } from '../interfaces/IFileService.js';

export class MusicRepository implements IMusicRepository {
    constructor(
        private dataSource: DataSource,
        private fileService: IFileService
    ) {}

    private get trackRepo() { return this.dataSource.getRepository(Track); }
    private get albumRepo() { return this.dataSource.getRepository(Album); }
    private get artistRepo() { return this.dataSource.getRepository(Artist); }
   

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

        return await this.albumRepo.save({
            title: metadata.common.album,
            createdAt: now, 
            updatedAt: now,
            year: metadata.common.year || null,
            artist
        });
    }

    async upsertTrack(metadata: IMusicMetadata, filePath: string): Promise<Track> {
        if (!metadata.common.title) {
            throw new Error('Track title is required');
        }

        const existing = await this.trackRepo.findOne({
            where: { filePath }
        });

        if (existing) return existing;

        // Get or create the main artist
        const mainArtist = await this.upsertArtist(
            metadata.common.artists?.[0] || 'Unknown Artist'
        );

        // Get or create the album
        const album = await this.upsertAlbum(metadata, mainArtist);

        // Create additional artists if they exist
        const artists = await Promise.all(
            (metadata.common.artists || [])
                .map(artistName => this.upsertArtist(artistName))
        );

        const now = new Date().toISOString();

        // Create new file path
        const newFilePath = await this.fileService.organizeMusicFile({
            artistName: mainArtist.name,
            albumName: album.title,
            trackNumber: metadata.common.track?.no || null,
            trackName: metadata.common.title,
            sourcePath: filePath
        });

        return await this.trackRepo.save({
            title: metadata.common.title,
            trackNumber: metadata.common.track?.no || null,
            diskNumber: metadata.common.disk?.no || null,
            duration: metadata.format?.duration || null,
            filePath: newFilePath,
            genres: metadata.common.genres || [],
            encodedBy: metadata.common.encodedby || null,
            createdAt: now,
            updatedAt: now,
            album,
            artists
        });
    }

    async getAllArtists(): Promise<IMusicMetadata[]> {
        const artists = await this.artistRepo.find({
            relations: {
                albums: {
                    tracks: true
                }
            }
        });

        return artists.map(artist => this.convertToMetadata(artist));
    }

    private convertToMetadata(artist: Artist): IMusicMetadata {
        return {
            common: {
                artists: [artist.name],
                album: artist.albums?.[0]?.title,
                title: artist.tracks?.[0]?.title,
                track: {
                    no: artist.tracks?.[0]?.trackNumber || 0,
                    of: 0
                },
                disk: {
                    no: artist.tracks?.[0]?.diskNumber || 0,
                    of: 0
                },
                genres: artist.tracks?.[0]?.genres || [],
                year: artist.albums?.[0]?.year || undefined,
                encodedby: artist.tracks?.[0]?.encodedBy || undefined,
                externalIds: [{
                    albumId: artist.albums?.[0]?.musicbrainzId || undefined,
                    artistId: artist.musicbrainzId || undefined
                }]
            },
            format: {
                duration: artist.tracks?.[0]?.duration || undefined
            }
        };
    }
} 