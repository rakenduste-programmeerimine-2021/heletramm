import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export enum RoomType {
    PRIVATE = "private",
    GROUP = "group"
}

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 100})
    name: string;

    @Column({
        type: "enum",
        enum: RoomType
    })
    type: RoomType;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]
}