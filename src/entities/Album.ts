import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Artist } from "./Artist.js";
import { Track } from "./Track.js";

@Entity()
export class Album {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    title!: string;

    @ManyToOne(() => Artist, artist => artist.albums, { nullable: false })
    artist!: Artist;

    @Column({ type: "int", nullable: true })
    year?: number;

    @Column({ type: "varchar", nullable: true })
    artworkUrl?: string;

    @OneToMany(() => Track, track => track.album)
    tracks!: Track[];

    constructor(partial: Partial<Album> = {}) {
        Object.assign(this, partial);
    }
}