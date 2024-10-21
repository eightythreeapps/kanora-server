import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Track } from "./Track";

@Entity()
export class Album {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    title!: string;

    @Column()
    createdAt: Date = new Date();

    @Column()
    artistId!: string;

    @Column()
    tracks?: Track[];

}