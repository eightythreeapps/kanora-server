import { Artist } from "../entities/Artist.js";
import { Album } from "../entities/Album.js";
import { Track } from "../entities/Track.js";
import { LibraryMetadata } from "../entities/LibraryMetadata.js";
import { IMusicMetadata } from "./IMusicMetadataReader.js";

export interface ILibraryResponse {
    artists: {
        id: string;
        name: string;
        albums: {
            id: string;
            title: string;
            year?: number;
            artworkUrl?: string;
            tracks: {
                id: string;
                title: string;
                trackNumber?: number;
                duration?: number;
                filePath: string;
                dateAdded: Date;
            }[];
        }[];
    }[];
    metadata: {
        lastScanDate: Date;
        totalTracks: number;
        totalAlbums: number;
        totalArtists: number;
    };
}

export interface IMusicRepository {
    /**
     * Gets all artists in the library
     * @param since Optional date to get only items added after this date
     */
    getAllArtists(since?: Date): Promise<ILibraryResponse>;

    /**
     * Gets all albums in the library
     */
    getAllAlbums(): Promise<Album[]>;

    /**
     * Gets all tracks in the library
     */
    getAllTracks(): Promise<Track[]>;

    /**
     * Gets a track by its ID
     */
    getTrackById(id: string): Promise<Track | null>;

    /**
     * Gets the library metadata
     */
    getLibraryMetadata(): Promise<LibraryMetadata | null>;

    /**
     * Saves an artist to the repository
     */
    saveArtist(artist: Partial<Artist>): Promise<Artist>;

    /**
     * Saves an album to the repository
     */
    saveAlbum(album: Partial<Album>): Promise<Album>;

    /**
     * Saves a track to the repository
     */
    saveTrack(track: Partial<Track>): Promise<Track>;

    /**
     * Saves library metadata
     */
    saveLibraryMetadata(metadata: Partial<LibraryMetadata>): Promise<LibraryMetadata>;

    /**
     * Finds a track by its path
     */
    findTrackByPath(filePath: string): Promise<Track | null>;

    /**
     * Finds an artist by its name
     */
    findArtistByName(name: string): Promise<Artist | null>;

    /**
     * Finds an album by its title and artist ID
     */
    findAlbumByTitleAndArtist(title: string, artistId: string): Promise<Album | null>;

    /**
     * Processes a track, copying it to the library and creating all necessary entities
     * @param metadata The track's metadata
     * @param filePath The path to the source file
     * @returns The created or existing track
     */
    processTrack(metadata: IMusicMetadata, filePath: string): Promise<Track>;
} 