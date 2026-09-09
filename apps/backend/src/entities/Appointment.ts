import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne
} from "typeorm";

import { User } from "./User";


@Entity()
export class Appointment {


    @PrimaryGeneratedColumn()
    id!: number;


    @Column()
    date!: Date;


    @Column({
        default: "CREATED"
    })
    status!: string;


    @ManyToOne(
        () => User,
        user => user.appointments
    )
    user!: User;
}