import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Album } from "./Album";

@Entity()
export class Track {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    title!: string;

    @Column()
    createdAt: Date = new Date();

    @Column()
    filePath!: string;

    @Column()
    albumId!: string;

    @Column()
    album?: Album;

}