import { IPicture } from "music-metadata";

export enum ExternalIdType {
    Musicbraniz = "Musicbraniz",
    Discogs = "Discogs"
}

/**
 * Interface for music metadata
 */
export interface IMusicMetadata {
    title: string;
    artist: string;
    album: string;
    year?: number;
    trackNumber?: number;
    duration?: number;
    artwork?: Buffer;
}

/**
 * Interface for reading music metadata from files
 */
export interface IMusicMetadataReader {
    /**
     * Reads metadata from a music file
     * @param filePath Path to the music file
     * @returns Promise<IMusicMetadata | null> The metadata if successfully read, null otherwise
     */
    readMetadata(filePath: string): Promise<IMusicMetadata | null>;
} 