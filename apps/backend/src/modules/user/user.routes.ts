import { Router } from "express";
import { UserController } from "./user.controller";
import { userService } from "../../container";
import { validateDto } from "../../middleware/validation.middleware";
import { CreateUserDto } from "../../dto/user/create-user.dto";

const router = Router();

const controller =
    new UserController(
        userService
    );

router.get(
    "/",
    controller.getUsers
);

router.get(
    "/:id",
    controller.getUserById
);

router.post(
    "/",
    validateDto(CreateUserDto),
    controller.createUser
);


export default router;