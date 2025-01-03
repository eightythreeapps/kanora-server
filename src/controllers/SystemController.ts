import { Router, Request, Response, RequestHandler } from "express";
import { IController } from "../interfaces/IController";


export class SystemController implements IController {
    router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        const handler: RequestHandler = this.getSystemInfo.bind(this);
        this.router.get('/info', handler);
    }

    getRouter() {
        return this.router;
    }

    async getSystemInfo(req: Request, res: Response) {
        try {
            const host = `${req.protocol}://${req.get('host')}`;
            res.json({ url: host });
        } catch (error) {
            console.error('Failed to get system info:', error);
            res.status(500).json({ error: 'Failed to get system info' });
        }
    }

}
