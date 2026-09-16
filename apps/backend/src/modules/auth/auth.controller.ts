import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "../../dto/auth/login.dto";

export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    login = async (
        req: Request,
        res: Response
    ) => {

        const dto: LoginDto = req.body;

        try {

            const result = await this.authService.login(dto);

            res.json(result);
        } catch (error) {

            res.status(401).json({ message: "Invalid credentials" });
        }
    };
}
