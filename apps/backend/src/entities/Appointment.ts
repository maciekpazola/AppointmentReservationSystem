import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

import { User } from "./user";
import { Service } from "./service";
import { AppointmentStatus } from "../enums/appointmentStatus";


@Entity()
export class Appointment {

    @PrimaryGeneratedColumn()
    id!: number;


    @Column({
        type: "timestamptz"
    })
    startTime!: Date;


    @Column({
        type: "timestamptz"
    })
    endTime!: Date;


    @Column({
        type: "enum",
        enum: AppointmentStatus,
        default: AppointmentStatus.CREATED
    })
    status!: AppointmentStatus;


    // Foreign Keys

    @Column()
    customerId!: number;


    @Column()
    serviceId!: number;


    @Column()
    employeeId!: number;



    // Navigation properties

    @ManyToOne(
        () => User,
        user => user.customerAppointments
    )
    @JoinColumn({
        name: "customerId"
    })
    customer!: User;


    @ManyToOne(
    () => User,
    user => user.employeeAppointments
    )
    @JoinColumn({
        name: "employeeId"
    })
    employee!: User;


    @ManyToOne(
        () => Service,
        service => service.appointments
    )
    @JoinColumn({
        name: "serviceId"
    })
    service!: Service;




    @CreateDateColumn()
    createdAt!: Date;


    @UpdateDateColumn()
    updatedAt!: Date;
}