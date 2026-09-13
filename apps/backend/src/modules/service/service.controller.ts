import { Request, Response } from "express";
import { ServiceService } from "./service.service";
import { CreateServiceDto } from "../../dto/service/create-service.dto";


export class ServiceController {

    constructor(
        private serviceService: ServiceService
    ) {}

    getServices = async (
        req: Request,
        res: Response
    ) => {

        const services = await this.serviceService.getServices();

        res.json(services);
    };


    createService = async (
        req: Request,
        res: Response
    ) => {

    const dto: CreateServiceDto = req.body;

    const service = await this.serviceService.createService(dto);

        res.status(201).json(service);
    };
}
