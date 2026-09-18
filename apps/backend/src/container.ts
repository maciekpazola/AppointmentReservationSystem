import { AppDataSource } from "./config/database";
import { Appointment } from "./entities/appointment";
import { User } from "./entities/user";
import { Service } from "./entities/service";
import { EmployeeSchedule } from "./entities/employeeSchedule";
import { AvailabilityService } from "./modules/availability/availability.service";
import { AppointmentService } from "./modules/appointment/appointment.service";
import { UserService } from "./modules/user/user.service";
import { ServiceService } from "./modules/service/service.service";
import { EmployeeService } from "./modules/employee/employee.service";
import { CustomerService } from "./modules/customer/customer.service";
import { EmployeeScheduleService } from "./modules/employeeSchedule/employeeSchedule.service";
import { AuthService } from "./modules/auth/auth.service";
import { JwtService } from "./auth/jwt.service";


export const jwtService = new JwtService();

export const availabilityService =
    new AvailabilityService(
        AppDataSource.getRepository(Appointment),
        AppDataSource.getRepository(EmployeeSchedule)
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

export const authService =
    new AuthService(
        AppDataSource.getRepository(User),
        jwtService
    );

export const employeeService =
    new EmployeeService(
        AppDataSource.getRepository(User),
        AppDataSource.getRepository(Appointment),
        availabilityService
    );

    export const employeeScheduleService =
    new EmployeeScheduleService(
        AppDataSource.getRepository(EmployeeSchedule)
    );

export const serviceService =
    new ServiceService(
        AppDataSource.getRepository(Service)
    );

export const customerService =
    new CustomerService(
        AppDataSource.getRepository(User)
    );