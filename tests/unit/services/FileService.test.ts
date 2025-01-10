import { FileService } from '../../../src/services/FileService.js';
import fs from 'fs';
import path from 'path';
import { Stats } from 'fs';

// Create mock types
type MockFsPromises = {
    readdir: jest.Mock;
    stat: jest.Mock;
    access: jest.Mock;
};

// Mock the modules
jest.mock('fs', () => ({
    promises: {
        readdir: jest.fn(),
        stat: jest.fn(),
        access: jest.fn()
    }
}));

jest.mock('path', () => ({
    join: jest.fn((...args) => args.join('/'))
}));

describe('FileService', () => {
    let service: FileService;
    let mockFsPromises: MockFsPromises;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new FileService();
        mockFsPromises = fs.promises as unknown as MockFsPromises;
    });

    describe('scanDirectory', () => {
        it('should scan directory recursively', async () => {
            const mockFiles = ['file1.mp3', 'file2.m4a'];
            const mockDirs = ['dir1', 'dir2'];
            const testDir = 'testDir';
            
            // Mock readdir to return different results based on directory
            mockFsPromises.readdir.mockImplementation((dir: string) => {
                if (dir === testDir) {
                    return Promise.resolve([...mockFiles, ...mockDirs]);
                }
                if (dir === path.join(testDir, 'dir1') || dir === path.join(testDir, 'dir2')) {
                    return Promise.resolve(mockFiles);
                }
                return Promise.resolve([]);
            });
            
            // Mock stat to identify directories
            mockFsPromises.stat.mockImplementation((filePath: string) => {
                const isDir = filePath.endsWith('dir1') || filePath.endsWith('dir2');
                return Promise.resolve({
                    isDirectory: () => isDir
                } as Stats);
            });

            const result = await service.scanDirectory(testDir);
            
            // Root directory files
            expect(result).toContain(path.join(testDir, 'file1.mp3'));
            expect(result).toContain(path.join(testDir, 'file2.m4a'));
            
            // Subdirectory files
            expect(result).toContain(path.join(testDir, 'dir1', 'file1.mp3'));
            expect(result).toContain(path.join(testDir, 'dir1', 'file2.m4a'));
            expect(result).toContain(path.join(testDir, 'dir2', 'file1.mp3'));
            expect(result).toContain(path.join(testDir, 'dir2', 'file2.m4a'));
            
            expect(mockFsPromises.readdir).toHaveBeenCalledWith(testDir);
        });

        it('should skip .DS_Store files', async () => {
            const mockFiles = ['file1.mp3', '.DS_Store'];
            const testDir = 'testDir';
            
            mockFsPromises.readdir.mockResolvedValue(mockFiles);
            mockFsPromises.stat.mockImplementation(() => Promise.resolve({
                isDirectory: () => false
            } as Stats));

            const result = await service.scanDirectory(testDir);
            
            expect(result).toContain(`${testDir}/file1.mp3`);
            expect(result).not.toContain(`${testDir}/.DS_Store`);
            expect(mockFsPromises.readdir).toHaveBeenCalledWith(testDir);
        });

        it('should handle read errors', async () => {
            const testDir = 'testDir';
            const errorMessage = 'Read error';
            mockFsPromises.readdir.mockRejectedValue(new Error(errorMessage));
            
            await expect(service.scanDirectory(testDir)).rejects.toThrow(errorMessage);
            expect(mockFsPromises.readdir).toHaveBeenCalledWith(testDir);
        });
    });

    describe('exists', () => {
        it('should return true if file exists', async () => {
            const testFile = 'test.mp3';
            mockFsPromises.access.mockResolvedValue(undefined);
            
            const result = await service.exists(testFile);
            
            expect(result).toBe(true);
            expect(mockFsPromises.access).toHaveBeenCalledWith(testFile);
        });

        it('should return false if file does not exist', async () => {
            const testFile = 'nonexistent.mp3';
            mockFsPromises.access.mockRejectedValue(new Error('ENOENT'));
            
            const result = await service.exists(testFile);
            
            expect(result).toBe(false);
            expect(mockFsPromises.access).toHaveBeenCalledWith(testFile);
        });
    });

    describe('getSize', () => {
        it('should return file size', async () => {
            const testFile = 'test.mp3';
            const expectedSize = 1024;
            
            mockFsPromises.stat.mockResolvedValue({ size: expectedSize } as Stats);
            
            const result = await service.getSize(testFile);
            
            expect(result).toBe(expectedSize);
            expect(mockFsPromises.stat).toHaveBeenCalledWith(testFile);
        });

        it('should handle stat errors', async () => {
            const testFile = 'test.mp3';
            const errorMessage = 'Stat error';
            
            mockFsPromises.stat.mockRejectedValue(new Error(errorMessage));
            
            await expect(service.getSize(testFile)).rejects.toThrow(errorMessage);
            expect(mockFsPromises.stat).toHaveBeenCalledWith(testFile);
        });
    });
}); 