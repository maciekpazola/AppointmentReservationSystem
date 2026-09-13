import { Router } from "express";
import { UserController } from "./user.controller";
import { userService } from "../../container";


const router = Router();

const controller =
    new UserController(
        userService
    );

router.get(
    "/",
    controller.getUsers
);


router.post(
    "/",
    controller.createUser
);


export default router;