import { parseFile } from "music-metadata";
import { IMusicMetadataReader, IMusicMetadata } from "../interfaces/IMusicMetadataReader.js";

export class MusicMetadataReader implements IMusicMetadataReader {
    async readMetadata(filePath: string): Promise<IMusicMetadata | null> {
        try {
            const metadata = await parseFile(filePath);
            
            // Convert picture data to Buffer if it exists
            const picture = metadata.common.picture?.[0];
            const artwork = picture ? Buffer.from(picture.data) : undefined;
            
            return {
                title: metadata.common.title || '',
                artist: metadata.common.artist || '',
                album: metadata.common.album || '',
                year: metadata.common.year,
                trackNumber: metadata.common.track.no || undefined,
                duration: metadata.format.duration,
                artwork
            };
        } catch (error) {
            console.error('Failed to read metadata from file:', filePath, error);
            return null;
        }
    }
} 