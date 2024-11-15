export interface IFileService {
    scan(directory: string): Promise<string[]>;

    /**
     * Creates a standardized music file path and moves the file to that location
     * 
     * @param params Object containing the necessary file information
     * @returns Promise<string> The new file path
     */
    organizeMusicFile(params: {
        artistName: string,
        albumName: string,
        trackNumber: number | null,
        trackName: string,
        sourcePath: string
    }): Promise<string>;
} 