
import { AlbumResponse } from './IAlbumResponse.js'

export interface ArtistResponse {
    id: string;
    name: string;
    bio: string;
    artistBannerImagePath: string;
    albums: AlbumResponse[];
}