import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn
} from "typeorm";

import { Appointment } from "./appointment";
import { UserRole } from "../enums/userRole";
import { EmployeeSchedule } from "./employeeSchedule";


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
        appointment => appointment.customer
    )
    customerAppointments!: Appointment[];

    @OneToMany(
        () => EmployeeSchedule,
        schedule => schedule.employee
    )
    employeeSchedules!: EmployeeSchedule[];

    @OneToMany(
        () => Appointment,
        appointment => appointment.employee
    )
    employeeAppointments!: Appointment[];

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CUSTOMER
    })
    role!: UserRole;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @CreateDateColumn()
    createdAt!: Date;
}