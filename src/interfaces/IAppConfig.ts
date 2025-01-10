/**
 * Interface defining the application configuration
 */
export interface IAppConfig {
    port: number;
    apiKey: string;
    database: {
        type: string;
        path: string;
        logging: boolean;
        synchronize: boolean;
        dropSchema: boolean;
    };
} 