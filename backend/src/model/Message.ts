import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({name: "userId", referencedColumnName: "id"})
    user: User;

    @ManyToOne(() => Room)
    @JoinColumn(({name: "roomId", referencedColumnName: "id"}))
    room: Room;

    message: string;
}