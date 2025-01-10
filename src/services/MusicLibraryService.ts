import { IFileService } from "../interfaces/IFileService.js";
import { IMusicMetadataReader } from "../interfaces/IMusicMetadataReader.js";
import { IMusicRepository } from "../interfaces/IMusicRepository.js";
import { LibraryMetadata } from "../entities/LibraryMetadata.js";
import { ILibraryResponse } from "../interfaces/IMusicRepository.js";

const IMPORT_DIR = 'media/import';

export class MusicLibraryService {
    constructor(
        private fileService: IFileService,
        private metadataReader: IMusicMetadataReader,
        private musicRepository: IMusicRepository
    ) {}

    /**
     * Scans the library and returns current metadata
     * @returns Promise<ILibraryResponse> Current library state
     */
    public async scanLibrary(): Promise<ILibraryResponse> {
        try {
            await this.importNewMusic();
            return this.musicRepository.getAllArtists();
        } catch (error) {
            console.error('Error scanning library:', error);
            throw error;
        }
    }

    public async importNewMusic(): Promise<void> {
        try {
            const files = await this.fileService.scanDirectory(IMPORT_DIR);
            let importedCount = 0;

            for (const file of files) {
                if (file.endsWith('.mp3') || file.endsWith('.m4a')) {
                    await this.processImportedFile(file);
                    importedCount++;
                }
            }

            if (importedCount > 0) {
                const tracks = await this.musicRepository.getAllTracks();
                const albums = await this.musicRepository.getAllAlbums();
                const artists = await this.musicRepository.getAllArtists();

                await this.musicRepository.saveLibraryMetadata(
                    new LibraryMetadata({
                        lastScanDate: new Date(),
                        totalTracks: tracks.length,
                        totalAlbums: albums.length,
                        totalArtists: artists.artists.length
                    })
                );
            }
        } catch (error) {
            console.error('Error importing music:', error);
            throw error;
        }
    }

    private async processImportedFile(filePath: string): Promise<void> {
        try {
            const metadata = await this.metadataReader.readMetadata(filePath);
            if (!metadata) {
                console.error(`Failed to read metadata for file: ${filePath}`);
                return;
            }

            // Process the track using the repository
            await this.musicRepository.processTrack(metadata, filePath);

        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
            throw error;
        }
    }
}