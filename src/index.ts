import "reflect-metadata";
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { MusicDataProvider } from "./MusicDataProvider";


const MUSIC_IMPORT_DIRECTORY = 'media/music';

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
app.get('/', (req: Request, res: Response) => {
  res.send({});
});

app.get('/tools/scan', async (req: Request, res: Response) => {

  const musicDataProvider = new MusicDataProvider();
  var files = await musicDataProvider.scan(MUSIC_IMPORT_DIRECTORY);
  
  res.send({files});
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});