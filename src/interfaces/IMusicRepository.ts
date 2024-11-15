import { IMusicMetadata } from "./IMusicMetadataReader.js";
import { Track } from "../entities/Track.js";
import { Artist } from "../entities/Artist.js";
import { Album } from "../entities/Album.js";

export interface IMusicRepository {
    upsertTrack(metadata: IMusicMetadata, filePath: string): Promise<Track>;
    upsertArtist(name: string): Promise<Artist>;
    upsertAlbum(metadata: IMusicMetadata, artist: Artist): Promise<Album>;
    getAllArtists(): Promise<IMusicMetadata[]>;
} 