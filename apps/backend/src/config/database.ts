import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "../entities/user";
import { Appointment } from "../entities/appointment";
import { Service } from "../entities/service";


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
        Appointment,
        Service
    ]
});