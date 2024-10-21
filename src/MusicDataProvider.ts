import fs from 'fs';
import path from 'path';
import { DataSource } from "typeorm";
import { Artist } from "./entities/Artist";
import { Album } from './entities/Album';
import { Track } from './entities/Track';

// Create TypeORM connection
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    entities: [Artist, Album, Track],
    synchronize: true,
    logging: false
});
  
interface IMusicDataProvider {
    scan(directory: string): Promise<string[]>;
}

export class MusicDataProvider implements IMusicDataProvider {
    async scan(directory: string): Promise<string[]> {
        const allFiles: string[] = [];

        async function scanRecursively(dir: string): Promise<void> {
            const files = await fs.promises.readdir(dir);
            
            for (const file of files) {
                if (file === '.DS_Store') continue;
                
                const fullPath = path.join(dir, file);
                const stat = await fs.promises.stat(fullPath);
                
                if (stat.isDirectory()) {
                    await scanRecursively(fullPath);
                } else {
                    allFiles.push(fullPath);
                }
            }
        }

        await scanRecursively(directory);
        console.log(allFiles);
        return allFiles;
    }
}
