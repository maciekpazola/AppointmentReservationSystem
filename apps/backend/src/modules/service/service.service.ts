import { AppDataSource } from "../../config/database";
import { CreateServiceDto } from "../../dto/service/create-service.dto";
import { ServiceMapper } from "./service.mapper";
import { Service } from "../../entities/service";


export class ServiceService {

    private serviceRepository =
        AppDataSource.getRepository(Service);


    async getServices() {

        const services = await this.serviceRepository.find();
        const response = services.map(ServiceMapper.toResponse);
        return response;
    }


    async getServiceById(id: number) {
        return this.serviceRepository.findOne({
            where: {
                id
            }
        });
    }


    async createService(dto: CreateServiceDto) {

        const entity = ServiceMapper.toEntity(dto);
        const service = this.serviceRepository.create(entity);

        return this.serviceRepository.save(service);
    }
}
