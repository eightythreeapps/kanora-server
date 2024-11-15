import { parseFile } from "music-metadata";
import { IMusicMetadataReader,IMusicMetadata, IMusicExternalId, ExternalIdType} from "../interfaces/IMusicMetadataReader.js";

export class MusicMetadataReader implements IMusicMetadataReader {
    async readMetadata(filePath: string): Promise<IMusicMetadata> {
        const metadata = await parseFile(filePath);
        return {
            common: {
                albumartist: metadata.common.albumartist,
                artists: metadata.common.artists,
                album: metadata.common.album,
                title: metadata.common.title,
                track: {
                    no: metadata.common.track.no ?? 0,
                    of: metadata.common.track.of ?? 0
                },
                disk: {
                    no: metadata.common.disk.no ?? 0,
                    of: metadata.common.disk.of ?? 0
                },
                genres: metadata.common.genre,
                year: metadata.common.year,
                encodedby: metadata.common.encodedby,
                externalIds: [
                    {
                        type: ExternalIdType.Musicbraniz,
                        artistId: Array.isArray(metadata.common.musicbrainz_artistid) 
                            ? metadata.common.musicbrainz_artistid[0] 
                            : metadata.common.musicbrainz_artistid ?? "Unknown",
                        albumId: Array.isArray(metadata.common.musicbrainz_albumid)
                            ? metadata.common.musicbrainz_albumid[0]
                            : metadata.common.musicbrainz_albumid ?? "Unknown"
                    }
                ]
            },
            format: {
                duration: metadata.format.duration
            }
        };
    }
    
} 