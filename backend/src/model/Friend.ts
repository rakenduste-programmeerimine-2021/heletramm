import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({name: 'userId', referencedColumnName: "id"})
    user: User;

    @ManyToOne(() => User)
    @JoinColumn({name: 'friendOfId', referencedColumnName: "id"})
    friend_of: User;
}