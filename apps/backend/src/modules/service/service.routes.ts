import { Router } from "express";
import { ServiceController } from "./service.controller";
import { serviceService } from "../../container";
import { validateDto } from "../../middleware/validation.middleware";
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
    validateDto(CreateServiceDto),
    controller.createService
);


export default router;
