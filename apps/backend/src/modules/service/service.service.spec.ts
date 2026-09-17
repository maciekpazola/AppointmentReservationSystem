import { Repository } from "typeorm";
import { ServiceService } from "./service.service";
import { ServiceMapper } from "./service.mapper";
import { Service } from "../../entities/service";
import { CreateServiceDto } from "../../dto/service/create-service.dto";
import { ServiceResponseDto } from "../../dto/service/service-response.dto";

describe("ServiceService", () => {
  let serviceRepository: jest.Mocked<Repository<Service>>;
  let serviceService: ServiceService;

  const service: Service = {
    id: 1,
    name: "Haircut",
    price: 50,
    appointments: [],
  } as Service;

  const serviceResponse: ServiceResponseDto = {
    id: service.id,
    name: service.name,
    price: service.price,
  };

  const createRepositoryMock = (): jest.Mocked<Repository<Service>> =>
    ({
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Service>>);

  beforeEach(() => {
    serviceRepository = createRepositoryMock();
    serviceService = new ServiceService(serviceRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getServices", () => {
    it("returns mapped services from repository", async () => {
      serviceRepository.find.mockResolvedValue([service]);

      const result = await serviceService.getServices();

      expect(serviceRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([serviceResponse]);
    });

    it("returns empty array when repository has no services", async () => {
      serviceRepository.find.mockResolvedValue([]);

      const result = await serviceService.getServices();

      expect(result).toEqual([]);
    });

    it("propagates repository errors", async () => {
      serviceRepository.find.mockRejectedValue(new Error("Database error"));

      await expect(serviceService.getServices())
        .rejects
        .toThrow("Database error");
    });
  });

  describe("getServiceById", () => {
    it("returns entity when repository finds service", async () => {
      serviceRepository.findOne.mockResolvedValue(service);

      const result = await serviceService.getServiceById(1);

      expect(serviceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(service);
    });

    it("returns null when repository finds no service", async () => {
      serviceRepository.findOne.mockResolvedValue(null);

      const result = await serviceService.getServiceById(999);

      expect(result).toBeNull();
    });

    it("propagates repository errors", async () => {
      serviceRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(serviceService.getServiceById(1))
        .rejects
        .toThrow("Database error");
    });
  });

  describe("createService", () => {
    const dto: CreateServiceDto = {
      name: "Haircut",
      price: 50,
    };

    it("maps dto, creates entity and saves service", async () => {
      jest.spyOn(ServiceMapper, "toEntity").mockReturnValue(service);

      serviceRepository.create.mockReturnValue(service);
      serviceRepository.save.mockResolvedValue(service);

      const result = await serviceService.createService(dto);

      expect(ServiceMapper.toEntity).toHaveBeenCalledWith(dto);
      expect(serviceRepository.create).toHaveBeenCalledWith(service);
      expect(serviceRepository.save).toHaveBeenCalledWith(service);
      expect(result).toEqual(service);
    });

    it("propagates error when saving service fails", async () => {
      jest.spyOn(ServiceMapper, "toEntity").mockReturnValue(service);
      serviceRepository.create.mockReturnValue(service);

      serviceRepository.save.mockRejectedValue(new Error("Save failed"));

      await expect(serviceService.createService(dto))
        .rejects
        .toThrow("Save failed");
    });
  });
});
