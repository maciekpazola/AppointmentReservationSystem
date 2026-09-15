import { Router } from "express";
import { EmployeeScheduleController } from "./employeeSchedule.controller";
import { CreateEmployeeScheduleDto } from "../../dto/employeeSchedule/create-employeeSchedule.dto";
import { validateDto } from "../../middleware/validation.middleware";
import { employeeScheduleService } from "../../container";

const router = Router();

const controller =
    new EmployeeScheduleController(
        employeeScheduleService
    );

router.get(
    "/",
    controller.getEmployeeSchedules.bind(controller)
);


router.get(
    "/:id",
    controller.getEmployeeScheduleById.bind(controller)
);


router.post(
    "/",
    validateDto(CreateEmployeeScheduleDto),
    controller.createEmployeeSchedule
);

export default router;
