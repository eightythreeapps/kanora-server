import { Router, Request, Response } from "express";
import { FileService  } from "../services/FileService.js";
import { MusicRepository } from "../services/MusicRepository.js";
import { MusicMetadataReader } from "../services/MusicMetadataReader.js";
import { MusicLibraryService } from "../services/MusicLibraryService.js";
import { AppDataSource } from "../index.js";

const router = Router()

const MUSIC_IMPORT_DIRECTORY = 'media/import';
const MUSIC_LIBRARY = 'media/library';

router.get('/artists', async (req: Request, res: Response) => {
  try {
    const fileService = new FileService();
    const repository = new MusicRepository(AppDataSource, fileService);
    const artists = await repository.getAllArtists();
    res.json(artists);
  } catch (error) {
    console.error('Failed to fetch library:', error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
});

router.get('/metadata', async (req: Request, res: Response) => {
  try {
    const fileService = new FileService();
    const repository = new MusicRepository(AppDataSource, fileService);
    const metadata = await repository.scanLibrary();
    res.json(metadata);
  } catch (error) {
    console.error('Failed to fetch library metadata:', error);
    res.status(500).json({ error: 'Failed to fetch library metadata' });
  }
});

/**
 * @route GET /import
 * @description Imports new media files from the import directory into the music library.
 * This process includes:
 * - Scanning the import directory for supported audio files
 * - Reading metadata from found audio files
 * - Moving files to the library directory
 * - Updating the database with new entries
 * 
 * @returns {Object} 200 - Success message
 * @returns {Object} 500 - Server error
 * 
 * @example
 * // Success Response:
 * {
 *   "message": "Library scan completed successfully"
 * }
 * 
 * // Error Response:
 * {
 *   "error": "Failed to scan library"
 * }
 */
router.get('/import', async (req: Request, res: Response) => {
  try {
    const fileService = new FileService();
    const metadataReader = new MusicMetadataReader();
    const repository = new MusicRepository(AppDataSource, fileService);
    const libraryService = new MusicLibraryService(fileService, metadataReader, repository);
    await libraryService.importMedia(MUSIC_IMPORT_DIRECTORY);
    res.json({ message: 'Library scan completed successfully' });
  } catch (error) {
    console.error('Scan failed:', error);
    res.status(500).json({ error: 'Failed to scan library' });
  }
});  

export default router;