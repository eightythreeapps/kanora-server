import "reflect-metadata";
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { StreamController } from "./controllers/StreamController.js"
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

export const AppDataSource = new DataSource({ 
  type: "sqlite",
  database: "database.sqlite",
  entities: [Artist, Album, Track, LibraryMetadata],
  synchronize: true,
  dropSchema: false,
  logging: false
});

await AppDataSource.initialize();

// defining the Express app
const app = express();
const fileService = new FileService();
const musicRepository = new MusicRepository(AppDataSource, fileService);
const metadataReader = new MusicMetadataReader();
const libraryService = new MusicLibraryService(fileService, metadataReader, musicRepository);

const streamController = new StreamController(musicRepository);
const systemController = new SystemController();
const libraryController = new LibraryController(libraryService,musicRepository,AppDataSource,metadataReader)

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.use('/api/library', libraryController.getRouter())
app.use('/api/system', systemController.getRouter())
app.use('/api/stream', streamController.getRouter())

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});