import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import { CreateAppointmentDto } from "../../dto/appointment/create-appointment.dto";


export class AppointmentController {

    constructor(
        private appointmentService: AppointmentService
    ) {}

    getAppointments = async (
        req: Request,
        res: Response
    ) => {

        const appointments = await this.appointmentService.getAppointments();

        res.json(appointments);
    };

        getAppointment = async (
        req: Request,
        res: Response
    ) => {
    const id = Number(req.params.id);

    const appointment =
        await this.appointmentService.getAppointmentById(id);
        
        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        res.json(appointment);
    };

    createAppointment = async (
        req: Request,
        res: Response
    ) => {

    const dto: CreateAppointmentDto = req.body;

    const appointment = await this.appointmentService.createAppointment(dto);

        res.status(201).json(appointment);
    };

        cancelAppointment = async (
        req: Request,
        res: Response
    ) => {

    const id = Number(req.params.id);

    const appointment = await this.appointmentService.cancelAppointment(id);

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        res.status(200).json({ message: "Appointment cancelled" });
    };
}