import { Router } from "express";
import { ServiceController } from "./service.controller";


const router = Router();

const controller = new ServiceController();


router.get(
    "/",
    controller.getServices
);


router.post(
    "/",
    controller.createService
);


export default router;
