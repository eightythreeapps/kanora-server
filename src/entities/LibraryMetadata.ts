import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class LibraryMetadata {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ type: 'text' })
    lastScanTime!: string;

    @Column({ type: 'int' })
    totalTracks!: number;

    @Column({ type: 'int' })
    totalArtists!: number;

    @Column({ type: 'int' })
    totalAlbums!: number;

    @Column({ type: 'float', nullable: true })
    totalDuration?: number;

    @Column({ type: 'float', nullable: true })
    totalSize?: number;
} 