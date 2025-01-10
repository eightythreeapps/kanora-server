import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class LibraryMetadata {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "datetime" })
    lastScanDate!: Date;

    @Column({ type: "int" })
    totalTracks!: number;

    @Column({ type: "int" })
    totalAlbums!: number;

    @Column({ type: "int" })
    totalArtists!: number;

    constructor(partial: Partial<LibraryMetadata> = {}) {
        Object.assign(this, partial);
    }
} 