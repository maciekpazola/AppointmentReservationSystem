import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "../entities/User";
import { Appointment } from "../entities/Appointment";


export const AppDataSource = new DataSource({

    type: "postgres",

    host: "localhost",
    port: 5432,

    username: "admin",
    password: "password",
    database: "appointments",

    synchronize: true,

    logging: true,

    entities: [
        User,
        Appointment
    ]
});