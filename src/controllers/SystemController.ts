import { Router, Request, Response } from 'express';
import { IController } from '../interfaces/IController.js';

export class SystemController implements IController {
    private router: Router;
    public readonly path = '/system';

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/health', async (_req: Request, res: Response) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString()
            });
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}
