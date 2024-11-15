import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Album } from "./Album.js";
import { Artist } from "./Artist.js";

@Entity()
export class Track {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "int", nullable: true })
    trackNumber: number | null = null;

    @Column({ type: "int", nullable: true })
    diskNumber: number | null = null;

    @Column({ type: "float", nullable: true })
    duration: number | null = null;

    @Column({ type: "text" })
    filePath!: string;

    @Column({ type: "simple-array", nullable: true })
    genres: string[] = [];

    @Column({ type: "text", nullable: true })
    encodedBy: string | null = null;

    @Column({ type: 'text' })
    createdAt!: string;

    @Column({ type: 'text' })
    updatedAt!: string;
    
    @Column({ type: "int", nullable: true })
    trackTotal: number | null = null;  // for track.of

    @Column({ type: "int", nullable: true })
    diskTotal: number | null = null;   // for disk.of

    @Column({ type: "text", nullable: true })
    codec: string | null = null;

    @Column({ type: "int", nullable: true })
    sampleRate: number | null = null;

    @Column({ type: "int", nullable: true })
    numberOfChannels: number | null = null;

    @Column({ type: "int", nullable: true })
    bitrate: number | null = null;

    @Column({ type: "text", nullable: true })
    codecProfile: string | null = null;

    @Column({ type: "int", nullable: true })
    numberOfSamples: number | null = null;

    @Column({ type: "boolean", nullable: true })
    lossless: boolean | null = null;

    @Column({ type: "text", nullable: true })
    container: string | null = null;

    @Column({ type: "simple-array", nullable: true })
    tagTypes: string[] = [];

    @ManyToOne(() => Album, album => album.tracks)
    album!: Album;

    @ManyToMany(() => Artist)
    @JoinTable()
    artists!: Artist[];
}