import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY || 'a451c59f-2485-485b-851e-ba6d5aa8e01d';

/**
 * Middleware to authenticate requests using an API key
 * Checks for 'x-api-key' in the request headers
 */
export const authenticateApiKey = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== API_KEY) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid or missing API key'
        });
        return;
    }

    next();
}; 