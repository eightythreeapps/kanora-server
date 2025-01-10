import { ILibraryResponse } from '../interfaces/IMusicRepository.js';
import * as fs from 'fs/promises';
import * as path from 'path';

const CACHE_DIR = 'cache';
const LIBRARY_CACHE_FILE = path.join(CACHE_DIR, 'library.json');

export class LibraryCacheService {
    constructor() {
        // Ensure cache directory exists
        fs.mkdir(CACHE_DIR, { recursive: true }).catch(console.error);
    }

    /**
     * Gets the cached library data if it's newer than the provided date
     * @param since Optional date to check cache freshness
     * @returns The cached data if valid, null otherwise
     */
    async getCachedLibrary(since?: Date): Promise<ILibraryResponse | null> {
        try {
            const stats = await fs.stat(LIBRARY_CACHE_FILE);
            
            // If since is provided and cache is older, return null
            if (since && stats.mtime < since) {
                return null;
            }

            const cacheData = await fs.readFile(LIBRARY_CACHE_FILE, 'utf-8');
            const parsed = JSON.parse(cacheData);
            
            // Convert date strings back to Date objects
            parsed.metadata.lastScanDate = new Date(parsed.metadata.lastScanDate);
            for (const artist of parsed.artists) {
                for (const album of artist.albums) {
                    for (const track of album.tracks) {
                        track.dateAdded = new Date(track.dateAdded);
                    }
                }
            }
            
            return parsed;
        } catch (error) {
            // If file doesn't exist or can't be read, return null
            return null;
        }
    }

    /**
     * Updates the cache with new library data
     * @param data The library data to cache
     */
    async updateCache(data: ILibraryResponse): Promise<void> {
        try {
            await fs.writeFile(LIBRARY_CACHE_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Failed to update library cache:', error);
        }
    }

    /**
     * Invalidates the cache by deleting the cache file
     */
    async invalidateCache(): Promise<void> {
        try {
            await fs.unlink(LIBRARY_CACHE_FILE);
        } catch (error) {
            // Ignore errors if file doesn't exist
        }
    }
} 