import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";

import { User } from "./user";


@Entity()
@Index(["employeeId", "date"], { unique: true })
export class EmployeeSchedule {

    @PrimaryGeneratedColumn()
    id!: number;


    @Column()
    employeeId!: number;


    @ManyToOne(
        () => User,
        user => user.employeeSchedules,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "employeeId"
    })
    employee!: User;


    @Column({
        type: "date"
    })
    date!: string;


    @Column({
        type: "time"
    })
    startTime!: string;


    @Column({
        type: "time"
    })
    endTime!: string;


    @CreateDateColumn()
    createdAt!: Date;


    @UpdateDateColumn()
    updatedAt!: Date;
}