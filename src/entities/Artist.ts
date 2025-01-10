import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Album } from "./Album.js";

@Entity()
export class Artist {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    name!: string;

    @OneToMany(() => Album, album => album.artist, { eager: false })
    albums!: Album[];

    constructor(partial: Partial<Artist> = {}) {
        Object.assign(this, partial);
    }
}
