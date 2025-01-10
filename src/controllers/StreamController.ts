import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import { stat } from 'fs/promises';
import { IMusicRepository } from '../interfaces/IMusicRepository.js';
import { IController } from '../interfaces/IController.js';

export class StreamController implements IController {
    private router: Router;
    public readonly path = '/stream';

    constructor(private musicRepository: IMusicRepository) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/track/:trackId', async (req: Request, res: Response) => {
            await this.streamTrack(req, res);
        });
    }

    private async streamTrack(req: Request, res: Response): Promise<void> {
        try {
            const trackId = req.params.trackId;
            const track = await this.musicRepository.getTrackById(trackId);
            
            if (!track) {
                res.status(404).json({ error: 'Track not found' });
                return;
            }

            const filePath = track.filePath;
            const stats = await stat(filePath);
            
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
                const chunksize = (end - start) + 1;
                const stream = fs.createReadStream(filePath, { start, end });
                
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'audio/mpeg',
                });
                
                stream.pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Length': stats.size,
                    'Content-Type': 'audio/mpeg',
                });
                fs.createReadStream(filePath).pipe(res);
            }
        } catch (error) {
            console.error('Error streaming track:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
} 