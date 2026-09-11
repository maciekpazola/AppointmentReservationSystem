import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne
} from "typeorm";

import { Appointment } from "./appointment";

@Entity()
export class Service {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    price!: number;
    
    @OneToMany(
        () => Appointment,
        appointment => appointment.service
    )
    appointments!: Appointment[];
}