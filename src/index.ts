import "reflect-metadata";
import { DataSource } from "typeorm";
import { Artist } from "./entities/Artist.js";
import { Album } from "./entities/Album.js";
import { Track } from "./entities/Track.js";
import { LibraryMetadata } from "./entities/LibraryMetadata.js";
import { MusicRepository } from "./services/MusicRepository.js";
import { FileService } from "./services/FileService.js";
import { SystemController } from "./controllers/SystemController.js";
import { MusicMetadataReader } from "./services/MusicMetadataReader.js";
import { MusicLibraryService } from "./services/MusicLibraryService.js";
import { LibraryController } from "./controllers/LibraryController.js";
import { StreamController } from "./controllers/StreamController.js";
import { App } from "./App.js";
import { IAppConfig } from "./interfaces/IAppConfig.js";
import { IController } from "./interfaces/IController.js";

// Application configuration
const config: IAppConfig = {
    port: 3001,
    apiKey: process.env.API_KEY || 'a451c59f-2485-485b-851e-ba6d5aa8e01d',
    database: {
        type: "sqlite",
        path: "database.sqlite",
        logging: false,
        synchronize: true,
        dropSchema: true
    }
};

// Database factory function
const createDataSource = async (config: IAppConfig): Promise<DataSource> => {
    const dataSource = new DataSource({
        type: "sqlite",
        database: config.database.path,
        entities: [Artist, Album, Track, LibraryMetadata],
        synchronize: config.database.synchronize,
        dropSchema: config.database.dropSchema,
        logging: config.database.logging
    });
    
    await dataSource.initialize();
    return dataSource;
};

// Service initialization
const fileService = new FileService();
const metadataReader = new MusicMetadataReader();

const initializeApp = async () => {
    const dataSource = await createDataSource(config);
    const musicRepository = new MusicRepository(dataSource, fileService);
    const libraryService = new MusicLibraryService(fileService, metadataReader, musicRepository);

    // Controller initialization
    const controllers: IController[] = [
        new StreamController(musicRepository),
        new SystemController(),
        new LibraryController(libraryService, musicRepository, dataSource, metadataReader)
    ];

    // Initialize and start the application
    const app = new App(config, controllers, createDataSource);
    await app.initialize();

    // Import any new music files
    await libraryService.importNewMusic();
    
    app.start();
};

initializeApp().catch(error => {
    console.error('Failed to start the application:', error);
    process.exit(1);
});