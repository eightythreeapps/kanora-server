import "reflect-metadata";
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import artistRouter from "./controllers/artists.js";
import { MusicMetadataReader } from "./services/MusicMetadataReader.js";
import { MusicRepository } from "./services/MusicRepository.js";
import { MusicLibraryService } from "./services/MusicLibraryService.js";
import { DataSource } from "typeorm";
import { Artist } from "./entities/Artist.js";
import { Album } from "./entities/Album.js";
import { Track } from "./entities/Track.js";
import { FileService } from "./services/FileService.js";

export const AppDataSource = new DataSource({ 
  type: "sqlite",
  database: "database.sqlite",
  entities: [Artist, Album, Track],
  synchronize: true,
  logging: false
});

await AppDataSource.initialize();

const MUSIC_IMPORT_DIRECTORY = 'media/import';
const MUSIC_LIBRARY = 'media/library';

// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.use('/api', artistRouter)

app.get('/api/import', async (req: Request, res: Response) => {
  try {
    const fileService = new FileService();
    const metadataReader = new MusicMetadataReader();
    const repository = new MusicRepository(AppDataSource, fileService);
    const libraryService = new MusicLibraryService(fileService, metadataReader, repository);

    await libraryService.importMedia(MUSIC_IMPORT_DIRECTORY);
    res.json({ message: 'Library scan completed successfully' });
  } catch (error) {
    console.error('Scan failed:', error);
    res.status(500).json({ error: 'Failed to scan library' });
  }
});

app.get('/api/library', async (req: Request, res: Response) => {
  try {
    const fileService = new FileService();
    const repository = new MusicRepository(AppDataSource, fileService);
    const artists = await repository.getAllArtists();
    res.json(artists);
  } catch (error) {
    console.error('Failed to fetch library:', error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});