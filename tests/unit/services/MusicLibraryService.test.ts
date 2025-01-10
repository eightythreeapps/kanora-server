import { MusicLibraryService } from '../../../src/services/MusicLibraryService.js';
import { IFileService } from '../../../src/interfaces/IFileService.js';
import { IMusicMetadataReader } from '../../../src/interfaces/IMusicMetadataReader.js';
import { IMusicRepository } from '../../../src/interfaces/IMusicRepository.js';
import { LibraryMetadata } from '../../../src/entities/LibraryMetadata.js';

describe('MusicLibraryService', () => {
    let service: MusicLibraryService;
    let mockFileService: jest.Mocked<IFileService>;
    let mockMetadataReader: jest.Mocked<IMusicMetadataReader>;
    let mockMusicRepository: jest.Mocked<IMusicRepository>;

    beforeEach(() => {
        mockFileService = {
            scanDirectory: jest.fn().mockResolvedValue([]),
            exists: jest.fn(),
            getSize: jest.fn()
        };

        mockMetadataReader = {
            readMetadata: jest.fn()
        };

        mockMusicRepository = {
            getAllArtists: jest.fn(),
            getAllAlbums: jest.fn().mockResolvedValue([]),
            getAllTracks: jest.fn().mockResolvedValue([]),
            getTrackById: jest.fn(),
            getLibraryMetadata: jest.fn(),
            saveArtist: jest.fn(),
            saveAlbum: jest.fn(),
            saveTrack: jest.fn(),
            saveLibraryMetadata: jest.fn(),
            findTrackByPath: jest.fn(),
            findArtistByName: jest.fn(),
            findAlbumByTitleAndArtist: jest.fn(),
            processTrack: jest.fn()
        };

        service = new MusicLibraryService(
            mockFileService,
            mockMetadataReader,
            mockMusicRepository
        );
    });

    describe('scanLibrary', () => {
        it('should scan library and return current state', async () => {
            const mockLibraryState = {
                artists: [],
                metadata: {
                    lastScanDate: new Date(),
                    totalTracks: 0,
                    totalAlbums: 0,
                    totalArtists: 0
                }
            };

            mockFileService.scanDirectory.mockResolvedValue([]);
            mockMusicRepository.getAllArtists.mockResolvedValue(mockLibraryState);
            
            const result = await service.scanLibrary();
            
            expect(result).toEqual(mockLibraryState);
        });

        it('should handle scan errors', async () => {
            mockMusicRepository.getAllArtists.mockRejectedValue(new Error('Scan failed'));
            
            await expect(service.scanLibrary()).rejects.toThrow('Scan failed');
        });
    });

    describe('importNewMusic', () => {
        it('should process new music files', async () => {
            const mockFiles = ['test.mp3', 'test.m4a', 'test.txt'];
            const mockMetadata = {
                title: 'Test Track',
                artist: 'Test Artist',
                album: 'Test Album'
            };

            mockFileService.scanDirectory.mockResolvedValue(mockFiles);
            mockMetadataReader.readMetadata.mockResolvedValue(mockMetadata);
            mockMusicRepository.getAllTracks.mockResolvedValue([]);
            mockMusicRepository.getAllAlbums.mockResolvedValue([]);
            mockMusicRepository.getAllArtists.mockResolvedValue({
                artists: [],
                metadata: {
                    lastScanDate: new Date(),
                    totalTracks: 0,
                    totalAlbums: 0,
                    totalArtists: 0
                }
            });

            await service.importNewMusic();

            expect(mockMusicRepository.processTrack).toHaveBeenCalledTimes(2); // Only .mp3 and .m4a files
            expect(mockMusicRepository.saveLibraryMetadata).toHaveBeenCalled();
        });

        it('should handle import errors', async () => {
            mockFileService.scanDirectory.mockRejectedValue(new Error('Import failed'));
            
            await expect(service.importNewMusic()).rejects.toThrow('Import failed');
        });

        it('should skip files with unreadable metadata', async () => {
            const mockFiles = ['test.mp3'];
            mockFileService.scanDirectory.mockResolvedValue(mockFiles);
            mockMetadataReader.readMetadata.mockResolvedValue(null);
            mockMusicRepository.getAllArtists.mockResolvedValue({
                artists: [],
                metadata: {
                    lastScanDate: new Date(),
                    totalTracks: 0,
                    totalAlbums: 0,
                    totalArtists: 0
                }
            });

            await service.importNewMusic();

            expect(mockMusicRepository.processTrack).not.toHaveBeenCalled();
        });

        it('should not update metadata if no files were imported', async () => {
            mockFileService.scanDirectory.mockResolvedValue([]);

            await service.importNewMusic();

            expect(mockMusicRepository.saveLibraryMetadata).not.toHaveBeenCalled();
        });
    });
}); 