import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { IController } from '../interfaces/IController.js';
import { IMusicRepository } from '../interfaces/IMusicRepository.js';
import { IMusicMetadataReader } from '../interfaces/IMusicMetadataReader.js';
import { MusicLibraryService } from '../services/MusicLibraryService.js';
import { LibraryCacheService } from '../services/LibraryCacheService.js';

export class LibraryController implements IController {
    private router: Router;
    public readonly path = '/library';
    private cacheService: LibraryCacheService;

    constructor(
        private libraryService: MusicLibraryService,
        private musicRepository: IMusicRepository,
        private dataSource: DataSource,
        private metadataReader: IMusicMetadataReader
    ) {
        this.router = Router();
        this.cacheService = new LibraryCacheService();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/scan', async (_req: Request, res: Response) => {
            try {
                // Invalidate cache before scanning
                await this.cacheService.invalidateCache();
                const libraryState = await this.libraryService.scanLibrary();
                // Update cache with new data
                await this.cacheService.updateCache(libraryState);
                res.json(libraryState);
            } catch (error) {
                console.error('Library scan failed:', error);
                res.status(500).json({ error: 'Failed to scan library' });
            }
        });

        this.router.get('/artists', async (req: Request, res: Response) => {
            try {
                const since = req.query.since ? new Date(req.query.since as string) : undefined;
                
                // Try to get from cache first
                const cachedData = await this.cacheService.getCachedLibrary(since);
                if (cachedData) {
                    console.log('Returning cached library data');
                    res.json(cachedData);
                    return;
                }

                // If not in cache or outdated, get from repository
                console.log('Cache miss, querying database');
                const artists = await this.musicRepository.getAllArtists(since);
                await this.cacheService.updateCache(artists);
                res.json(artists);
            } catch (error) {
                console.error('Failed to get artists:', error);
                res.status(500).json({ error: 'Failed to get artists' });
            }
        });

        this.router.get('/albums', async (_req: Request, res: Response) => {
            try {
                const albums = await this.musicRepository.getAllAlbums();
                res.json(albums);
            } catch (error) {
                console.error('Failed to get albums:', error);
                res.status(500).json({ error: 'Failed to get albums' });
            }
        });

        this.router.get('/tracks', async (_req: Request, res: Response) => {
            try {
                const tracks = await this.musicRepository.getAllTracks();
                res.json(tracks);
            } catch (error) {
                console.error('Failed to get tracks:', error);
                res.status(500).json({ error: 'Failed to get tracks' });
            }
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}