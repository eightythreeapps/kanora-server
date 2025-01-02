import { LibraryMetadataResponse } from "./ILibraryMetadataResponse";

export interface APIResponse<T> {
    data: T[];
    metadata: LibraryMetadataResponse
}
