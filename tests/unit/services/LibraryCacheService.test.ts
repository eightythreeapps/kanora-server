import { LibraryCacheService } from '../../../src/services/LibraryCacheService.js';
import { ILibraryResponse } from '../../../src/interfaces/IMusicRepository.js';
import * as fs from 'fs/promises';
import { Stats } from 'fs';

jest.mock('fs/promises');

describe('LibraryCacheService', () => {
    let service: LibraryCacheService;
    const mockLibraryData: ILibraryResponse = {
        artists: [{
            id: '1',
            name: 'Test Artist',
            albums: [{
                id: '1',
                title: 'Test Album',
                year: 2024,
                artworkUrl: '/artwork/1.jpg',
                tracks: [{
                    id: '1',
                    title: 'Test Track',
                    trackNumber: 1,
                    duration: 180,
                    filePath: '/test-tracks/long-time-coming.m4a',
                    dateAdded: new Date('2024-01-01')
                }]
            }]
        }],
        metadata: {
            lastScanDate: new Date('2024-01-01'),
            totalTracks: 1,
            totalAlbums: 1,
            totalArtists: 1
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock fs functions
        (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
        (fs.stat as jest.Mock).mockResolvedValue({ mtime: new Date() } as Stats);
        (fs.readFile as jest.Mock).mockResolvedValue('');
        (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
        (fs.unlink as jest.Mock).mockResolvedValue(undefined);
        
        service = new LibraryCacheService();
    });

    describe('getCachedLibrary', () => {
        it('should return null if cache file does not exist', async () => {
            (fs.stat as jest.Mock).mockRejectedValue(new Error('File not found'));
            
            const result = await service.getCachedLibrary();
            expect(result).toBeNull();
        });

        it('should return null if cache is older than since date', async () => {
            const oldDate = new Date('2023-12-31');
            (fs.stat as jest.Mock).mockResolvedValue({ mtime: oldDate } as Stats);
            
            const result = await service.getCachedLibrary(new Date('2024-01-01'));
            expect(result).toBeNull();
        });

        it('should return cached data if newer than since date', async () => {
            const newDate = new Date('2024-01-02');
            (fs.stat as jest.Mock).mockResolvedValue({ mtime: newDate } as Stats);
            (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockLibraryData));
            
            const result = await service.getCachedLibrary(new Date('2024-01-01'));
            expect(result).toEqual(mockLibraryData);
        });

        it('should convert date strings back to Date objects', async () => {
            (fs.stat as jest.Mock).mockResolvedValue({ mtime: new Date() } as Stats);
            (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockLibraryData));
            
            const result = await service.getCachedLibrary();
            expect(result?.metadata.lastScanDate).toBeInstanceOf(Date);
            expect(result?.artists[0].albums[0].tracks[0].dateAdded).toBeInstanceOf(Date);
        });
    });

    describe('updateCache', () => {
        it('should write library data to cache file', async () => {
            await service.updateCache(mockLibraryData);
            
            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.stringContaining('library.json'),
                expect.any(String)
            );
            
            const writtenData = JSON.parse((fs.writeFile as jest.Mock).mock.calls[0][1] as string);
            writtenData.metadata.lastScanDate = new Date(writtenData.metadata.lastScanDate);
            writtenData.artists[0].albums[0].tracks[0].dateAdded = new Date(writtenData.artists[0].albums[0].tracks[0].dateAdded);
            expect(writtenData).toEqual(mockLibraryData);
        });

        it('should handle write errors gracefully', async () => {
            (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Write failed'));
            
            await expect(service.updateCache(mockLibraryData)).resolves.not.toThrow();
        });
    });

    describe('invalidateCache', () => {
        it('should delete cache file if it exists', async () => {
            await service.invalidateCache();
            expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining('library.json'));
        });

        it('should handle missing cache file gracefully', async () => {
            (fs.unlink as jest.Mock).mockRejectedValue(new Error('File not found'));
            
            await expect(service.invalidateCache()).resolves.not.toThrow();
        });
    });
}); 