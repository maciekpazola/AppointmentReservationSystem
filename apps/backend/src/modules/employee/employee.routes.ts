import { Router } from "express";
import { EmployeeController } from "./employee.controller";
import { availabilityService, employeeService } from "../../container";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

const controller =
    new EmployeeController(
        employeeService,
        availabilityService
    );

router.get(
    "/",
    controller.getEmployees.bind(controller)
);


router.get(
    "/:id",
    controller.getEmployeeById.bind(controller)
);


router.get(
    "/:id/availability",
    controller.getEmployeeAvailability.bind(controller)
);

export default router;
