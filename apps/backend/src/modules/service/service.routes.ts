import { Router } from "express";
import { ServiceController } from "./service.controller";
import { serviceService } from "../../container";


const router = Router();

const controller =
    new ServiceController(
        serviceService
    );

router.get(
    "/",
    controller.getServices
);


router.post(
    "/",
    controller.createService
);


export default router;
