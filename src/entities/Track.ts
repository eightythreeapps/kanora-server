import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Artist } from "./Artist.js";
import { Album } from "./Album.js";

@Entity()
export class Track {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    title!: string;

    @ManyToOne(() => Artist, { nullable: false })
    artist!: Artist;

    @ManyToOne(() => Album, album => album.tracks, { nullable: false })
    album!: Album;

    @Column({ type: "int", nullable: true })
    trackNumber?: number;

    @Column({ type: "float", nullable: true })
    duration?: number;

    @Column({ type: "varchar" })
    filePath!: string;

    @Column({ type: "datetime" })
    dateAdded!: Date;

    constructor(partial: Partial<Track> = {}) {
        Object.assign(this, partial);
        if (!this.dateAdded) {
            this.dateAdded = new Date();
        }
    }
}