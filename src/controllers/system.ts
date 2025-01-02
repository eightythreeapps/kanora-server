import { Router, Request, Response } from "express";

const router = Router()

router.get('/info', async (req: Request, res: Response) => {
    try {
        const host = `${req.protocol}://${req.get('host')}`;
        res.json({ url: host });
    } catch (error) {
        console.error('Failed to get system info:', error);
        res.status(500).json({ error: 'Failed to get system info' });
    }
});

export default router;