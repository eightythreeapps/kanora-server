/**
 * Interface for file system operations
 */
export interface IFileService {
    /**
     * Scans a directory for files
     * @param directory The directory to scan
     * @returns Promise<string[]> Array of file paths
     */
    scanDirectory(directory: string): Promise<string[]>;

    /**
     * Checks if a file exists
     * @param path The file path to check
     * @returns Promise<boolean>
     */
    exists(path: string): Promise<boolean>;

    /**
     * Gets the size of a file
     * @param path The file path
     * @returns Promise<number> File size in bytes
     */
    getSize(path: string): Promise<number>;
}

export interface IAudioMetadata {
    title?: string;
    artist?: string;
    album?: string;
    year?: string;
    track?: { no: number | null; of: number | null; };
    genre?: string[];
    // Add other metadata fields as needed
} 