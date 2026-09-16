import { Router } from "express";
import { ServiceController } from "./service.controller";
import { serviceService } from "../../container";
import { validateDto } from "../../middleware/validation.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../enums/userRole";
import { CreateServiceDto } from "../../dto/service/create-service.dto";

const router = Router();

const controller =
    new ServiceController(
        serviceService
    );

router.get(
    "/",
    controller.getServices
);

router.get(
    "/:id",
    controller.getServiceById
);


router.post(
    "/",
    authenticate,
    authorize(UserRole.ADMIN),
    validateDto(CreateServiceDto),
    controller.createService
);


export default router;
