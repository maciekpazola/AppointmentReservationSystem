import { Request, Response } from "express";
import { UserService } from "../services/user.service";


export class UserController {

    private userService = new UserService();


    getUsers = async (
        req: Request,
        res: Response
    ) => {

        const users = await this.userService.getUsers();

        res.json(users);
    };


    createUser = async (
        req: Request,
        res: Response
    ) => {

        const user = await this.userService.createUser(
            req.body
        );

        res.status(201).json(user);
    };
}