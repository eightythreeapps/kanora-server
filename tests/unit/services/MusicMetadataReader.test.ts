import { MusicMetadataReader } from '../../../src/services/MusicMetadataReader.js';
import * as musicMetadata from 'music-metadata';

// Mock the entire music-metadata module
jest.mock('music-metadata', () => ({
    parseFile: jest.fn()
}));

describe('MusicMetadataReader', () => {
    let reader: MusicMetadataReader;

    beforeEach(() => {
        jest.clearAllMocks();
        reader = new MusicMetadataReader();
    });

    describe('readMetadata', () => {
        it('should read and parse metadata correctly', async () => {
            const mockMetadata = {
                common: {
                    title: 'Test Track',
                    artist: 'Test Artist',
                    album: 'Test Album',
                    year: 2024,
                    track: { no: 1, of: 12 },
                    picture: [{
                        data: Buffer.from('test-artwork'),
                        format: 'image/jpeg'
                    }]
                },
                format: {
                    duration: 180
                }
            };

            (musicMetadata.parseFile as jest.Mock).mockResolvedValue(mockMetadata);

            const result = await reader.readMetadata('test.mp3');

            expect(result).toEqual({
                title: 'Test Track',
                artist: 'Test Artist',
                album: 'Test Album',
                year: 2024,
                trackNumber: 1,
                duration: 180,
                artwork: Buffer.from('test-artwork')
            });
        });

        it('should handle missing metadata fields', async () => {
            const mockMetadata = {
                common: {
                    title: 'Test Track',
                    // Missing artist and album
                    track: { no: null, of: null }
                },
                format: {
                    // Missing duration
                }
            };

            (musicMetadata.parseFile as jest.Mock).mockResolvedValue(mockMetadata);

            const result = await reader.readMetadata('test.mp3');

            expect(result).toEqual({
                title: 'Test Track',
                artist: '',
                album: '',
                trackNumber: undefined,
                duration: undefined
            });
        });

        it('should handle parse errors', async () => {
            (musicMetadata.parseFile as jest.Mock).mockRejectedValue(new Error('Parse error'));

            const result = await reader.readMetadata('test.mp3');
            expect(result).toBeNull();
        });

        it('should handle missing artwork', async () => {
            const mockMetadata = {
                common: {
                    title: 'Test Track',
                    artist: 'Test Artist',
                    album: 'Test Album',
                    // No picture field
                },
                format: {
                    duration: 180
                }
            };

            (musicMetadata.parseFile as jest.Mock).mockResolvedValue(mockMetadata);

            const result = await reader.readMetadata('test.mp3');

            expect(result?.artwork).toBeUndefined();
        });
    });
}); 