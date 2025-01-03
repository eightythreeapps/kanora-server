import { Router, Request, Response, RequestHandler } from "express";
import * as fs from 'fs';
import { stat } from 'fs/promises';
import { IMusicRepository } from '../interfaces/IMusicRepository';
import { IController } from "../interfaces/IController";

export class StreamController implements IController {
    router: Router;

    constructor(private musicRepository: IMusicRepository) {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        const handler: RequestHandler = this.streamTrack.bind(this);
        this.router.get('/track/:trackId', handler);
    }

    getRouter() {
        return this.router;
    }

    async streamTrack(req: Request, res: Response) {
        try {
            const track = await this.musicRepository.getTrackById(req.params.trackId);
            if (!track) {
                res.status(404).json({ error: 'Track not found' });
                return;
            }

            const filePath = track.filePath;
            const fileStat = await stat(filePath);

            // Handle range requests (important for seeking)
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0]);
                const end = parts[1] ? parseInt(parts[1]) : fileStat.size - 1;
                const chunkSize = (end - start) + 1;

                const contentType = this.getContentType(filePath);
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': contentType
                });

                fs.createReadStream(filePath, { start, end }).pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Length': fileStat.size,
                    'Content-Type': 'audio/mp4'
                });
                fs.createReadStream(filePath).pipe(res);
            }
        } catch (error) {
            console.error('Streaming error:', error);
            res.status(500).json({ error: 'Failed to stream track' });
        }
    }

    private getContentType(filePath: string): string {
        const ext = filePath.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'mp3': return 'audio/mpeg';
            case 'm4a': return 'audio/mp4';
            case 'wav': return 'audio/wav';
            case 'ogg': return 'audio/ogg';
            default: return 'audio/mpeg'; // fallback
        }
    }
} 