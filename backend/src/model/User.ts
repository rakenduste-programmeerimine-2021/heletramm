import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 200})
    username: string
    @Column({type: "varchar", length: 200})
    email: string

    @Column({type: "varchar", select: false})
    password: string

}