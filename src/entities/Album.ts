import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Track } from "./Track.js";
import { Artist } from "./Artist.js";

@Entity()
export class Album {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "int", nullable: true })
    year: number | null = null;

    @Column({ type: "text", nullable: true })
    musicbrainzId: string | null = null;

    @Column({ type: "text", nullable: true })
    discogsId: string | null = null;

    @Column({ type: "text", nullable: true })
    albumId: string | null = null;

    @ManyToOne(() => Artist, artist => artist.albums)
    artist!: Artist;

    @OneToMany(() => Track, track => track.album)
    tracks!: Track[];

    @Column({ type: 'text' })
    createdAt!: string;

    @Column({ type: 'text' })
    updatedAt!: string;
}