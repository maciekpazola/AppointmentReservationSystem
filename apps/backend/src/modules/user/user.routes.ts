import { Router } from "express";
import { UserController } from "./user.controller";
import { userService } from "../../container";
import { validateDto } from "../../middleware/validation.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../enums/userRole";
import { CreateUserDto } from "../../dto/user/create-user.dto";

const router = Router();


const controller =
    new UserController(
        userService
    );

router.get(
    "/",
    authenticate,
    authorize(UserRole.ADMIN),
    controller.getUsers
);

router.get(
    "/:id",
    authenticate,
    authorize(UserRole.ADMIN),
    controller.getUserById
);

router.post(
    "/",
    authenticate,
    authorize(UserRole.ADMIN),
    validateDto(CreateUserDto),
    controller.createUser
);


export default router;