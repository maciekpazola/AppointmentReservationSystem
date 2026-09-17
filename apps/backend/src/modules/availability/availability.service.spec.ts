import { format } from "date-fns";
import { Repository, LessThan, MoreThan, Not } from "typeorm";
import { AvailabilityService } from "./availability.service";
import { Appointment } from "../../entities/appointment";
import { EmployeeSchedule } from "../../entities/employeeSchedule";
import { AppointmentStatus } from "../../enums/appointmentStatus";

describe("AvailabilityService", () => {
  let appointmentRepository: jest.Mocked<Repository<Appointment>>;
  let employeeRepository: jest.Mocked<Repository<EmployeeSchedule>>;
  let availabilityService: AvailabilityService;

  beforeEach(() => {
    appointmentRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Appointment>>;

    employeeRepository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<EmployeeSchedule>>;

    availabilityService = new AvailabilityService(
      appointmentRepository,
      employeeRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("ensureAvailable", () => {
    const employeeId = 2;
    const startTime = new Date("2024-01-01T10:00:00Z");
    const endTime = new Date("2024-01-01T11:00:00Z");

    it("does not throw when there is no conflicting appointment", async () => {
      appointmentRepository.findOne.mockResolvedValue(null);

      await expect(
        availabilityService.ensureAvailable(employeeId, startTime, endTime)
      ).resolves.toBeUndefined();

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: {
          employeeId,
          status: Not(AppointmentStatus.CANCELLED),
          startTime: LessThan(endTime),
          endTime: MoreThan(startTime),
        },
      });
    });

    it("throws when a conflicting appointment exists", async () => {
      appointmentRepository.findOne.mockResolvedValue({} as Appointment);

      await expect(
        availabilityService.ensureAvailable(employeeId, startTime, endTime)
      ).rejects.toThrow("Employee is busy.");
    });

    it("propagates repository errors", async () => {
      appointmentRepository.findOne.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        availabilityService.ensureAvailable(employeeId, startTime, endTime)
      ).rejects.toThrow("Database error");
    });
  });

  describe("getAvailability", () => {
    const employeeId = 2;
    const date = new Date("2024-01-01T00:00:00Z");

    it("returns empty slots when employee has no schedule for the date", async () => {
      employeeRepository.findOne.mockResolvedValue(null);

      const result = await availabilityService.getAvailability(employeeId, date);

      expect(employeeRepository.findOne).toHaveBeenCalledWith({
        where: {
          employeeId,
          date: format(date, "yyyy-MM-dd"),
        },
      });
      expect(result).toEqual({
        employeeId,
        date: date.toISOString(),
        slots: [],
      });
      expect(appointmentRepository.find).not.toHaveBeenCalled();
    });

    it("returns full-day slots when there are no appointments", async () => {
      employeeRepository.findOne.mockResolvedValue({
        startTime: "09:00",
        endTime: "11:00",
      } as EmployeeSchedule);
      appointmentRepository.find.mockResolvedValue([]);

      const result = await availabilityService.getAvailability(employeeId, date);

      expect(result.employeeId).toBe(employeeId);
      expect(result.slots).toEqual([
        {
          startTime: new Date("2024-01-01T09:00:00"),
          endTime: new Date("2024-01-01T10:00:00"),
        },
        {
          startTime: new Date("2024-01-01T10:00:00"),
          endTime: new Date("2024-01-01T11:00:00"),
        },
      ]);
    });

    it("excludes slots that overlap with existing appointments", async () => {
      employeeRepository.findOne.mockResolvedValue({
        startTime: "09:00",
        endTime: "11:00",
      } as EmployeeSchedule);
      appointmentRepository.find.mockResolvedValue([
        {
          startTime: new Date("2024-01-01T09:00:00"),
          endTime: new Date("2024-01-01T10:00:00"),
        } as Appointment,
      ]);

      const result = await availabilityService.getAvailability(employeeId, date);

      expect(result.slots).toEqual([
        {
          startTime: new Date("2024-01-01T10:00:00"),
          endTime: new Date("2024-01-01T11:00:00"),
        },
      ]);
    });

    it("propagates repository errors", async () => {
      employeeRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(
        availabilityService.getAvailability(employeeId, date)
      ).rejects.toThrow("Database error");
    });
  });
});
