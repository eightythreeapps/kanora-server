import { Router } from "express";

/**
 * Interface for all controllers in the application
 */
export interface IController {
    /**
     * The base path for this controller's routes
     */
    readonly path: string;

    /**
     * Gets the router with all routes for this controller
     */
    getRouter(): Router;
}