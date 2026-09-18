import { Request, Response } from "express";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "../../dto/customer/create-customer.dto";


export class CustomerController {

    constructor(
        private customerService: CustomerService
    ) {}

    getCustomers = async (
        req: Request,
        res: Response
    ) => {

        const customers = await this.customerService.getCustomers();

        res.json(customers);
    };


    getCustomerById = async (
        req: Request,
        res: Response
    ) => {

        const id = Number(req.params.id);
        const customer = await this.customerService.getCustomerById(id);

        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }

        res.json(customer);
    };

    createCustomer = async (
        req: Request,
        res: Response
    ) => {

        const dto: CreateCustomerDto = req.body;

        const customer = await this.customerService.createCustomer(dto);

        res.status(201).json(customer);
    };
}
