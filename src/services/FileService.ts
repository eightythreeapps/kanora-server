import fs from 'fs';
import path from 'path';
import { IFileService } from '../interfaces/IFileService.js';

export class FileService implements IFileService {
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
        return allFiles;
    }

    private sanitizePathComponent(component: string): string {
        return component.replace(/[/\\?%*:|"<>]/g, '-');
    }

    private getFileExtension(filePath: string): string {
        return path.extname(filePath);
    }

    private joinPaths(...paths: string[]): string {
        return path.join(...paths);
    }

    private async ensureDirectoryExists(filePath: string): Promise<void> {
        const directory = path.dirname(filePath);
        await fs.promises.mkdir(directory, { recursive: true });
    }

    private async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
        await fs.promises.rename(sourcePath, destinationPath);
    }

    async organizeMusicFile(params: {
        artistName: string,
        albumName: string,
        trackNumber: number | null,
        trackName: string,
        sourcePath: string
    }): Promise<string> {
        const sanitizedArtist = this.sanitizePathComponent(params.artistName);
        const sanitizedAlbum = this.sanitizePathComponent(params.albumName);
        const sanitizedTrack = this.sanitizePathComponent(params.trackName);
        const trackNum = params.trackNumber?.toString().padStart(2, '0') || '00';
        const fileExtension = this.getFileExtension(params.sourcePath);
        
        const newFileName = `${trackNum}_${sanitizedTrack}${fileExtension}`;
        const newFilePath = this.joinPaths(
            process.cwd(),
            'media',
            'library',
            sanitizedArtist,
            sanitizedAlbum,
            newFileName
        );

        console.log(newFilePath)

        await this.ensureDirectoryExists(newFilePath);
        await this.moveFile(params.sourcePath, newFilePath);

        return newFilePath;
    }
} 