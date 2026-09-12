import { CreateServiceDto } from "../../dto/service/create-service.dto";
import { ServiceResponseDto } from "../../dto/service/service-response.dto";
import { Service } from "../../entities/service";

export class ServiceMapper {
  static toEntity(dto: CreateServiceDto): Service {
    const service = new Service();

    service.name = dto.name;
    service.price = dto.price;

    return service;
  }

  static toResponse(service: Service): ServiceResponseDto {
    return {
      id: service.id,
      name: service.name,
      price: service.price,
    };
  }
}
