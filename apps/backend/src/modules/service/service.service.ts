import { CreateServiceDto } from "../../dto/service/create-service.dto";
import { ServiceMapper } from "./service.mapper";
import { Service } from "../../entities/service";
import { Repository } from "typeorm";

export class ServiceService {

    constructor(
        private serviceRepository: Repository<Service>
    ) {}


    async getServices() {

        const services = await this.serviceRepository.find();
        const response = services.map(ServiceMapper.toResponse);
        return response;
    }


    async getServiceById(id: number) {
        const service = await this.serviceRepository.findOne({
            where: {
                id
            }
        });

        if (!service) {
            return null;
        }
        
        return service;
    }


    async createService(dto: CreateServiceDto) {

        const entity = ServiceMapper.toEntity(dto);
        const service = this.serviceRepository.create(entity);

        return this.serviceRepository.save(service);
    }
}
