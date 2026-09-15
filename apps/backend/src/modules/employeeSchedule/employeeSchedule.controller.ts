import { Request, Response } from "express";
import { EmployeeScheduleService } from "./employeeSchedule.service";
import { CreateEmployeeScheduleDto } from "../../dto/employeeSchedule/create-employeeSchedule.dto";


export class EmployeeScheduleController {

    constructor(
        private employeeScheduleService: EmployeeScheduleService,
    ) {}

    getEmployeeSchedules = async (
        req: Request,
        res: Response
    ) => {

        const employeeSchedules = await this.employeeScheduleService.getEmployeeSchedules();

        res.json(employeeSchedules);
    };


    getEmployeeScheduleById = async (
        req: Request,
        res: Response
    ) => {

        const id = Number(req.params.id);
        const employeeSchedule = await this.employeeScheduleService.getEmployeeScheduleById(id);

        if (!employeeSchedule) {
            res.status(404).json({ message: "Employee schedule not found" });
            return;
        }
        
        res.json(employeeSchedule);
    };


        createEmployeeSchedule = async (
            req: Request,
            res: Response
        ) => {
    
        const dto: CreateEmployeeScheduleDto = req.body;
    
        const employeeSchedule = await this.employeeScheduleService.createEmployeeSchedule(dto);
    
            res.status(201).json(employeeSchedule);
        };
}
