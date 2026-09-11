import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import { CreateAppointmentDto } from "../../dto/appointment/create-appointment.dto";


export class AppointmentController {

    private appointmentService = new AppointmentService();


    getAppointments = async (
        req: Request,
        res: Response
    ) => {

        const appointments = await this.appointmentService.getAppointments();

        res.json(appointments);
    };


    createAppointment = async (
        req: Request,
        res: Response
    ) => {

    const dto: CreateAppointmentDto = req.body;

    const appointment = await this.appointmentService.createAppointment(dto);

        res.status(201).json(appointment);
    };
}