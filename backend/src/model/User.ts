import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Room } from "./Room";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 200})
    nickname: string
    @Column({type: "varchar", length: 200})
    email: string
    @Column({type: "varchar"})
    password: string

}