import { Repository } from "typeorm";
import { AppointmentService } from "./appointment.service";
import { AppointmentMapper } from "./appointment.mapper";
import { AvailabilityService } from "../availability/availability.service";
import { Appointment } from "../../entities/appointment";
import { CreateAppointmentDto } from "../../dto/appointment/create-appointment.dto";
import { AppointmentResponseDto } from "../../dto/appointment/appointment-response.dto";
import { AppointmentStatus } from "../../enums/appointmentStatus";

describe("AppointmentService", () => {
  let appointmentRepository: jest.Mocked<Repository<Appointment>>;
  let availabilityService: jest.Mocked<AvailabilityService>;
  let appointmentService: AppointmentService;

  const appointment: Appointment = {
    id: 1,
    startTime: new Date("2024-01-01T10:00:00Z"),
    endTime: new Date("2024-01-01T11:00:00Z"),
    status: AppointmentStatus.CREATED,
    customerId: 1,
    employeeId: 2,
    serviceId: 3,
  } as Appointment;

  const appointmentResponse: AppointmentResponseDto = {
    id: appointment.id,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    status: appointment.status,
    customerId: appointment.customerId,
    employeeId: appointment.employeeId,
    serviceId: appointment.serviceId,
  };

  beforeEach(() => {
    appointmentRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Appointment>>;

    availabilityService = {
      ensureAvailable: jest.fn(),
    } as unknown as jest.Mocked<AvailabilityService>;

    appointmentService = new AppointmentService(
      appointmentRepository,
      availabilityService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getAppointments", () => {
    it("returns mapped appointments from repository", async () => {
      appointmentRepository.find.mockResolvedValue([appointment]);

      const result = await appointmentService.getAppointments();

      expect(appointmentRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([appointmentResponse]);
    });

    it("returns empty array when repository has no appointments", async () => {
      appointmentRepository.find.mockResolvedValue([]);

      const result = await appointmentService.getAppointments();

      expect(result).toEqual([]);
    });

    it("propagates repository errors", async () => {
      appointmentRepository.find.mockRejectedValue(
        new Error("Database error")
      );

      await expect(appointmentService.getAppointments())
        .rejects
        .toThrow("Database error");
    });
  });

  describe("getAppointmentById", () => {
    it("returns entity when repository finds appointment", async () => {
      appointmentRepository.findOne.mockResolvedValue(appointment);

      const result = await appointmentService.getAppointmentById(1);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(appointment);
    });

    it("returns null when repository finds no appointment", async () => {
      appointmentRepository.findOne.mockResolvedValue(null);

      const result = await appointmentService.getAppointmentById(999);

      expect(result).toBeNull();
    });
  });

  describe("createAppointment", () => {
    const dto: CreateAppointmentDto = {
      startTime: new Date("2024-01-01T10:00:00Z"),
      endTime: new Date("2024-01-01T11:00:00Z"),
      customerId: 1,
      employeeId: 2,
      serviceId: 3,
    };

    it("validates availability, maps dto, creates entity and saves appointment", async () => {
      availabilityService.ensureAvailable.mockResolvedValue(undefined);
      jest.spyOn(AppointmentMapper, "toEntity").mockReturnValue(appointment);
      appointmentRepository.create.mockReturnValue(appointment);
      appointmentRepository.save.mockResolvedValue(appointment);

      const result = await appointmentService.createAppointment(dto);

      expect(availabilityService.ensureAvailable).toHaveBeenCalledWith(
        dto.employeeId,
        dto.startTime,
        dto.endTime
      );
      expect(AppointmentMapper.toEntity).toHaveBeenCalledWith(dto);
      expect(appointmentRepository.create).toHaveBeenCalledWith(appointment);
      expect(appointmentRepository.save).toHaveBeenCalledWith(appointment);
      expect(result).toEqual(appointment);
    });

    it("throws when startTime is not before endTime", async () => {
      const invalidDto: CreateAppointmentDto = {
        ...dto,
        startTime: new Date("2024-01-01T11:00:00Z"),
        endTime: new Date("2024-01-01T10:00:00Z"),
      };

      await expect(appointmentService.createAppointment(invalidDto))
        .rejects
        .toThrow("Invalid time range");

      expect(availabilityService.ensureAvailable).not.toHaveBeenCalled();
      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it("propagates error when employee is not available", async () => {
      availabilityService.ensureAvailable.mockRejectedValue(
        new Error("Employee is busy.")
      );

      await expect(appointmentService.createAppointment(dto))
        .rejects
        .toThrow("Employee is busy.");

      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });

    it("propagates error when saving appointment fails", async () => {
      availabilityService.ensureAvailable.mockResolvedValue(undefined);
      jest.spyOn(AppointmentMapper, "toEntity").mockReturnValue(appointment);
      appointmentRepository.create.mockReturnValue(appointment);
      appointmentRepository.save.mockRejectedValue(new Error("Save failed"));

      await expect(appointmentService.createAppointment(dto))
        .rejects
        .toThrow("Save failed");
    });
  });

  describe("cancelAppointment", () => {
    it("marks appointment as cancelled and saves it", async () => {
      const foundAppointment = { ...appointment, status: AppointmentStatus.CREATED };
      appointmentRepository.findOne.mockResolvedValue(foundAppointment as Appointment);
      appointmentRepository.save.mockResolvedValue(foundAppointment as Appointment);

      await appointmentService.cancelAppointment(1);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(appointmentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: AppointmentStatus.CANCELLED })
      );
    });

    it("returns null when appointment is not found", async () => {
      appointmentRepository.findOne.mockResolvedValue(null);

      const result = await appointmentService.cancelAppointment(999);

      expect(result).toBeNull();
      expect(appointmentRepository.save).not.toHaveBeenCalled();
    });
  });
});
