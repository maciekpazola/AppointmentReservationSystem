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

    getServiceById = async (
        req: Request,
        res: Response
    ) => {

        const id = Number(req.params.id);
        const service = await this.serviceService.getServiceById(id);

        if (!service) {
            res.status(404).json({ message: "Service not found" });
            return;
        }
        
        res.json(service);
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
