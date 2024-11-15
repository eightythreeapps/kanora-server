import { IFileService } from "../interfaces/IFileService.js";
import { IMusicMetadataReader } from "../interfaces/IMusicMetadataReader.js";
import { IMusicRepository } from "../interfaces/IMusicRepository.js";

/**
 * Service responsible for managing the music library, including scanning directories
 * and maintaining the music database.
 * 
 * @class MusicLibraryService
 * @implements {IMusicLibraryService}
 * 
 * @remarks
 * This service coordinates between three main components:
 * - File Scanner: Discovers music files in the filesystem
 * - Metadata Reader: Extracts metadata from music files
 * - Repository: Handles database operations for music tracks
 * 
 * @example
 * ```typescript
 * const service = new MusicLibraryService(
 *   new FileScanner(),
 *   new MusicMetadataReader(),
 *   new MusicRepository()
 * );
 * await service.scanLibrary("/music/directory");
 * ```
 */
export class MusicLibraryService {
    constructor(
        private fileScanner: IFileService,
        private metadataReader: IMusicMetadataReader,
        private repository: IMusicRepository
    ) {}

    /**
     * Scans a directory for music files and updates the music library database.
     * 
     * @param directory - The path to the directory to scan for music files
     * @throws {Error} If the directory cannot be accessed or scanned
     * @returns Promise<void> - Resolves when the scan is complete
     * 
     * @remarks
     * This method will:
     * 1. Scan the specified directory for music files
     * 2. Read metadata from each found file
     * 3. Update or insert the track information in the database
     * 
     * Individual file processing errors are logged but don't stop the overall scan.
     * 
     * @example
     * ```typescript
     * await musicLibraryService.scanLibrary("/path/to/music");
     * ```
     */
    async importMedia(directory: string): Promise<void> {

        //Fetch the files using the FileScanner helper
        const files = await this.fileScanner.scan(directory);
        
        //Read the metadata for each track and add to the DB if it doesn not exist
        for (const file of files) {
            try {
                const metadata = await this.metadataReader.readMetadata(file);
                await this.repository.upsertTrack(metadata, file);
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
            }
        }
    }
} 