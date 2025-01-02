export interface TrackResponse {
    id: string;
    position: number | null;
    title: string;
    duration: number | null;
    filePath: string;
    artworkFilePath: string | null; 
    format: string | null;
}