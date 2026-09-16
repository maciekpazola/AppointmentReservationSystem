import { Router } from "express";
import { EmployeeScheduleController } from "./employeeSchedule.controller";
import { CreateEmployeeScheduleDto } from "../../dto/employeeSchedule/create-employeeSchedule.dto";
import { validateDto } from "../../middleware/validation.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../enums/userRole";
import { employeeScheduleService } from "../../container";

const router = Router();

router.use(authenticate);

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
    authorize(UserRole.ADMIN),
    validateDto(CreateEmployeeScheduleDto),
    controller.createEmployeeSchedule
);

export default router;
