import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Blogs {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: "text" })
    public title: string;

    @Column({ type: "text" })
    public content: string;
}