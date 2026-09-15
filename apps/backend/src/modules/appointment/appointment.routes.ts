import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { appointmentService } from "../../container";
import { validateDto } from "../../middleware/validation.middleware";
import { CreateAppointmentDto } from "../../dto/appointment/create-appointment.dto";


const router = Router();

const controller =
    new AppointmentController(
        appointmentService
    );

router.get(
    "/",
    controller.getAppointments
);

router.get(
    "/:id",
    controller.getAppointment
);

router.post(
    "/",
    validateDto(CreateAppointmentDto),
    controller.createAppointment
);


export default router;