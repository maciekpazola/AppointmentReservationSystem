import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserDto } from "../../dto/user/create-user.dto";


export class UserController {

    constructor(
        private userService: UserService
    ) {}

    getUsers = async (
        req: Request,
        res: Response
    ) => {

        const users = await this.userService.getUsers();

        res.json(users);
    };

    getUserById = async (
        req: Request,
        res: Response
    ) => {

        const id = Number(req.params.id);
        const user = await this.userService.getUserById(id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        
        res.json(user);
    };

    createUser = async (
        req: Request,
        res: Response
    ) => {

    const dto: CreateUserDto = req.body;

    const user = await this.userService.createUser(dto);

        res.status(201).json(user);
    };
}