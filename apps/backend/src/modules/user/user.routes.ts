import { Router } from "express";
import { UserController } from "./user.controller";


const router = Router();

const controller = new UserController();


router.get(
    "/",
    controller.getUsers
);


router.post(
    "/",
    controller.createUser
);


export default router;