import { IMusicMetadata } from "./IMusicMetadataReader.js";
import { Track } from "../entities/Track.js";
import { Artist } from "../entities/Artist.js";
import { Album } from "../entities/Album.js";
import { ArtistResponse } from "./IArtistResponse.js";
import { APIResponse } from "./IAPIResponse.js";
import { LibraryMetadataResponse } from "./ILibraryMetadataResponse.js";

export interface IMusicRepository {
    upsertTrack(metadata: IMusicMetadata, filePath: string): Promise<Track>;
    upsertArtist(name: string): Promise<Artist>;
    upsertAlbum(metadata: IMusicMetadata, artist: Artist): Promise<Album>;
    getAllArtists(): Promise<APIResponse<ArtistResponse>>;
    scanLibrary(): Promise<LibraryMetadataResponse>;
} 