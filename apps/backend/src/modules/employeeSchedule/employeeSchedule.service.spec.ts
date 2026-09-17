import { Repository } from "typeorm";
import { EmployeeScheduleService } from "./employeeSchedule.service";
import { EmployeeScheduleMapper } from "./employeeSchedule.mapper";
import { EmployeeSchedule } from "../../entities/employeeSchedule";
import { CreateEmployeeScheduleDto } from "../../dto/employeeSchedule/create-employeeSchedule.dto";
import { EmployeeScheduleResponseDto } from "../../dto/employeeSchedule/employee-response.dto";

describe("EmployeeScheduleService", () => {
  let employeeRepository: jest.Mocked<Repository<EmployeeSchedule>>;
  let employeeScheduleService: EmployeeScheduleService;

  const schedule: EmployeeSchedule = {
    id: 1,
    employeeId: 2,
    date: "2024-01-01",
    startTime: "09:00",
    endTime: "17:00",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as EmployeeSchedule;

  const scheduleResponse: EmployeeScheduleResponseDto = {
    id: schedule.id,
    employeeId: schedule.employeeId,
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };

  beforeEach(() => {
    employeeRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<EmployeeSchedule>>;

    employeeScheduleService = new EmployeeScheduleService(employeeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getEmployeeSchedules", () => {
    it("returns mapped employee schedules from repository", async () => {
      employeeRepository.find.mockResolvedValue([schedule]);

      const result = await employeeScheduleService.getEmployeeSchedules();

      expect(employeeRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([scheduleResponse]);
    });

    it("returns empty array when there are no schedules", async () => {
      employeeRepository.find.mockResolvedValue([]);

      const result = await employeeScheduleService.getEmployeeSchedules();

      expect(result).toEqual([]);
    });

    it("propagates repository errors", async () => {
      employeeRepository.find.mockRejectedValue(new Error("Database error"));

      await expect(employeeScheduleService.getEmployeeSchedules())
        .rejects
        .toThrow("Database error");
    });
  });

  describe("getEmployeeScheduleById", () => {
    it("returns entity when repository finds schedule", async () => {
      employeeRepository.findOne.mockResolvedValue(schedule);

      const result = await employeeScheduleService.getEmployeeScheduleById(1);

      expect(employeeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(schedule);
    });

    it("returns null when repository finds no schedule", async () => {
      employeeRepository.findOne.mockResolvedValue(null);

      const result = await employeeScheduleService.getEmployeeScheduleById(999);

      expect(result).toBeNull();
    });

    it("propagates repository errors", async () => {
      employeeRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(employeeScheduleService.getEmployeeScheduleById(1))
        .rejects
        .toThrow("Database error");
    });
  });

  describe("createEmployeeSchedule", () => {
    const dto: CreateEmployeeScheduleDto = {
      employeeId: 2,
      date: "2024-01-01",
      startTime: "09:00",
      endTime: "17:00",
    };

    it("maps dto, creates entity and saves schedule", async () => {
      jest.spyOn(EmployeeScheduleMapper, "toEntity").mockReturnValue(schedule);
      employeeRepository.create.mockReturnValue(schedule);
      employeeRepository.save.mockResolvedValue(schedule);

      const result = await employeeScheduleService.createEmployeeSchedule(dto);

      expect(EmployeeScheduleMapper.toEntity).toHaveBeenCalledWith(dto);
      expect(employeeRepository.create).toHaveBeenCalledWith(schedule);
      expect(employeeRepository.save).toHaveBeenCalledWith(schedule);
      expect(result).toEqual(schedule);
    });

    it("throws when startTime is not before endTime", async () => {
      const invalidDto: CreateEmployeeScheduleDto = {
        ...dto,
        startTime: "17:00",
        endTime: "09:00",
      };

      await expect(
        employeeScheduleService.createEmployeeSchedule(invalidDto)
      ).rejects.toThrow("Invalid time range");

      expect(employeeRepository.create).not.toHaveBeenCalled();
      expect(employeeRepository.save).not.toHaveBeenCalled();
    });

    it("propagates error when saving schedule fails", async () => {
      jest.spyOn(EmployeeScheduleMapper, "toEntity").mockReturnValue(schedule);
      employeeRepository.create.mockReturnValue(schedule);
      employeeRepository.save.mockRejectedValue(new Error("Save failed"));

      await expect(employeeScheduleService.createEmployeeSchedule(dto))
        .rejects
        .toThrow("Save failed");
    });
  });
});
