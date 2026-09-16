import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authService } from "../../container";
import { validateDto } from "../../middleware/validation.middleware";
import { LoginDto } from "../../dto/auth/login.dto";

const router = Router();

const controller =
    new AuthController(
        authService
    );

router.post(
    "/login",
    validateDto(LoginDto),
    controller.login
);

export default router;
