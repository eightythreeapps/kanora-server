import { TrackResponse } from "./iTrackResponse.js";

export interface AlbumResponse {
    id: string;
    title: string;
    releaseYear: number | null;
    albumArtPath: string;
    genres: string[];
    tracks: TrackResponse[];
}