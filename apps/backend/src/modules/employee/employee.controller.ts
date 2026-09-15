import { Request, Response } from "express";
import { EmployeeService } from "./employee.service";
import { AvailabilityService } from "../availability/availability.service";


export class EmployeeController {

    constructor(
        private employeeService: EmployeeService,
        private availabilityService: AvailabilityService
    ) {}

    getEmployees = async (
        req: Request,
        res: Response
    ) => {

        const employees = await this.employeeService.getEmployees();

        res.json(employees);
    };


    getEmployeeById = async (
        req: Request,
        res: Response
    ) => {

        const id = Number(req.params.id);
        const employee = await this.employeeService.getEmployeeById(id);

        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        }
        
        res.json(employee);
    };

    getEmployeeAvailability = async (
        req: Request,
        res: Response
    ) => {

        const id = Number(req.params.id);
        const date = new Date(req.query.date as string);
        const availability = await this.availabilityService.getAvailability(id, date);

        res.json(availability);
    };
}
