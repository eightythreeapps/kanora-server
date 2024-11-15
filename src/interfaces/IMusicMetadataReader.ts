export enum ExternalIdType {
    Musicbraniz = "Musicbraniz",
    Discogs = "Discogs"
}

export interface IMusicMetadata {
    common: {
        albumartist?: string;
        artists?: string[];
        album?: string;
        title?: string;
        track?: { no: number, of: number };
        disk?: { no: number, of: number };
        genres?: string[];
        year?: number;
        encodedby?: string;
        externalIds?: [IMusicExternalId];
    };
    format?: IMusicFormat;
    
}

export interface IMusicFormat {
    tagTypes?: string[];
    lossless?: boolean;
    container?: string;
    codec?: string;
    sampleRate?: number;
    numberOfChannels?: number;
    bitrate?: number;
    codecProfile?: string;
    numberOfSamples?: number;
    duration?: number;
}

export interface IMusicExternalId {
    type?: ExternalIdType,
    albumId?: string;
    artistId?: string;
}

export interface IMusicMetadataReader {
    readMetadata(filePath: string): Promise<IMusicMetadata>;
} 