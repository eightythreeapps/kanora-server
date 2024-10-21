import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Album } from "./Album";

@Entity()
export class Artist {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    createdAt: Date = new Date();

    @Column()
    updatedAt: Date = new Date();

    @Column()
    albums?: Album[];
}
