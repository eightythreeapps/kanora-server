import fs from 'fs';
import path from 'path';
import { IFileService } from '../interfaces/IFileService.js';

export class FileService implements IFileService {
    async scanDirectory(directory: string): Promise<string[]> {
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
        return allFiles;
    }

    async exists(path: string): Promise<boolean> {
        try {
            await fs.promises.access(path);
            return true;
        } catch {
            return false;
        }
    }

    async getSize(path: string): Promise<number> {
        const stats = await fs.promises.stat(path);
        return stats.size;
    }
} 