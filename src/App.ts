import express, { Express } from 'express';
import { DataSource } from "typeorm";
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { IAppConfig } from './interfaces/IAppConfig.js';
import { IMusicRepository } from './interfaces/IMusicRepository.js';
import { IFileService } from './interfaces/IFileService.js';
import { IMusicMetadataReader } from './interfaces/IMusicMetadataReader.js';
import { IController } from './interfaces/IController.js';
import { authenticateApiKey } from './middleware/authMiddleware.js';

/**
 * Main application class responsible for initialization and dependency management
 */
export class App {
    private app: Express;
    private dataSource!: DataSource;
    
    constructor(
        private readonly config: IAppConfig,
        private readonly controllers: IController[],
        private readonly dataSourceFactory: (config: IAppConfig) => Promise<DataSource>
    ) {
        this.app = express();
    }

    /**
     * Initializes the application
     */
    public async initialize(): Promise<void> {
        await this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    /**
     * Starts the application server
     */
    public start(): void {
        this.app.listen(this.config.port, () => {
            console.log(`Server is running on port ${this.config.port}`);
        });
    }

    private async initializeDatabase(): Promise<void> {
        this.dataSource = await this.dataSourceFactory(this.config);
    }

    private initializeMiddlewares(): void {
        this.app.use(helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" } // Allow serving media files cross-origin
        }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(morgan('combined'));
        
        // Serve static files
        this.app.use('/artwork', express.static('public/artwork'));
        this.app.use('/library', express.static('public/library'));
    }

    private initializeControllers(): void {
        const apiRouter = express.Router();
        apiRouter.use(authenticateApiKey);

        this.controllers.forEach(controller => {
            apiRouter.use(controller.path, controller.getRouter());
        });
        
        this.app.use('/api', apiRouter);
    }
} 