import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { appointmentService } from "../../container";


const router = Router();

const controller =
    new AppointmentController(
        appointmentService
    );

router.get(
    "/",
    controller.getAppointments
);


router.post(
    "/",
    controller.createAppointment
);


export default router;