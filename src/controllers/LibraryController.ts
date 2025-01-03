import { Router, Request, Response, RequestHandler } from "express";
import { FileService  } from "../services/FileService.js";
import { MusicRepository } from "../services/MusicRepository.js";
import { MusicMetadataReader } from "../services/MusicMetadataReader.js";
import { MusicLibraryService } from "../services/MusicLibraryService.js";
import { AppDataSource } from "../index.js";
import { IFileService } from "../interfaces/IFileService.js";
import { IMusicRepository } from "../interfaces/IMusicRepository.js";
import { DataSource } from "typeorm";
import { IMusicMetadataReader } from "../interfaces/IMusicMetadataReader.js";
import { IController } from "../interfaces/IController.js";

const MUSIC_IMPORT_DIRECTORY = 'media/import';

export class LibraryController implements IController {
  router: Router;

  constructor(private libraryService:MusicLibraryService, 
    private musicRepository: IMusicRepository, 
    private dataSource:DataSource, 
    private metadataReader:IMusicMetadataReader) {
      this.router = Router();
      this.initializeRoutes();
  }

  initializeRoutes() {
      this.router.get('/artists', this.getArtists.bind(this));
      this.router.get('/metadata', this.getLibraryMetaData)
      this.router.get('/import', this.importMedia)
  }

  getRouter() {
      return this.router;
  }

  async getArtists(req: Request, res: Response) {
    try {
      const artists = await this.musicRepository.getAllArtists();
      res.json(artists);
    } catch (error) {
      console.error('Failed to fetch library:', error);
      res.status(500).json({ error: 'Failed to fetch library' });
    }
  }

  async getLibraryMetaData(req: Request, res: Response) {
    try {
      // const fileService = new FileService();
      // const repository = new MusicRepository(AppDataSource, fileService);
      const metadata = await this.musicRepository.scanLibrary();
      res.json(metadata);
    } catch (error) {
      console.error('Failed to fetch library metadata:', error);
      res.status(500).json({ error: 'Failed to fetch library metadata' });
    }
  }

  async importMedia(req: Request, res: Response) {
    try {
      await this.libraryService.importMedia(MUSIC_IMPORT_DIRECTORY);
      res.json({ message: 'Library scan completed successfully' });
    } catch (error) {
      console.error('Scan failed:', error);
      res.status(500).json({ error: 'Failed to scan library' });
    }
  }

}