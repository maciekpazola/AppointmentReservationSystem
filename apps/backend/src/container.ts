import { AppDataSource } from "./config/database";
import { Appointment } from "./entities/appointment";
import { User } from "./entities/user";
import { Service } from "./entities/service";
import { AvailabilityService } from "./modules/appointment/availability.service";
import { AppointmentService } from "./modules/appointment/appointment.service";
import { UserService } from "./modules/user/user.service";
import { ServiceService } from "./modules/service/service.service";



const availabilityService =
    new AvailabilityService(
        AppDataSource.getRepository(Appointment)
    );


export const appointmentService =
    new AppointmentService(
        AppDataSource.getRepository(Appointment),
        availabilityService
    );

export const userService =
    new UserService(
        AppDataSource.getRepository(User)
    );

export const serviceService =
    new ServiceService(
        AppDataSource.getRepository(Service)
    );