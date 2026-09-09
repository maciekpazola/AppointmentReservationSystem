import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from "typeorm";

import { Appointment } from "./Appointment";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;


    @Column({
        unique: true
    })
    email!: string;


    @Column()
    passwordHash!: string;


    @OneToMany(
        () => Appointment,
        appointment => appointment.user
    )
    appointments!: Appointment[];
}