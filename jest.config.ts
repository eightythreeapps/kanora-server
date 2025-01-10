import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    setupFiles: ['./jest.setup.ts'],
    testMatch: [
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/tests/**/*.spec.ts'
    ],
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/fixtures/',
        '/tests/utils/'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    rootDir: '.',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],
    moduleDirectories: ['node_modules', 'src'],
    modulePaths: ['<rootDir>/src/'],
    roots: ['<rootDir>/src/', '<rootDir>/tests/'],
    reporters: [
        'default',
        [
            'jest-html-reporter',
            {
                configFile: './jest.html-reporter.config.js'
            }
        ]
    ]
};

export default config; 