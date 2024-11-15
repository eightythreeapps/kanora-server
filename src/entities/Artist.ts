import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Album } from "./Album.js";
import { Track } from "./Track.js";

@Entity()
export class Artist {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    name!: string;

    @Column({ type: "text", nullable: true })
    musicbrainzId: string | null = null;

    @Column({ type: "text", nullable: true })
    discogsId: string | null = null;

    @Column({ type: "text", nullable: true })
    artistId: string | null = null;

    @Column({ type: 'text' })
    createdAt!: string;

    @Column({ type: 'text' })
    updatedAt!: string;

    @OneToMany(() => Album, album => album.artist)
    albums!: Album[];

    @OneToMany(() => Track, track => track.artists)
    tracks!: Track[];
}
