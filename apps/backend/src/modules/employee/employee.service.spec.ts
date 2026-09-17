import { Repository } from "typeorm";
import { EmployeeService } from "./employee.service";
import { EmployeeMapper } from "./employee.mapper";
import { AvailabilityService } from "../availability/availability.service";
import { User } from "../../entities/user";
import { Appointment } from "../../entities/appointment";
import { UserRole } from "../../enums/userRole";
import { EmployeeResponseDto } from "../../dto/employee/employee-response.dto";

describe("EmployeeService", () => {
  let employeeRepository: jest.Mocked<Repository<User>>;
  let appointmentRepository: jest.Mocked<Repository<Appointment>>;
  let availabilityService: jest.Mocked<AvailabilityService>;
  let employeeService: EmployeeService;

  const employee: User = {
    id: 1,
    email: "jane@example.com",
    passwordHash: "hashed",
    firstName: "Jane",
    lastName: "Smith",
    role: UserRole.EMPLOYEE,
    createdAt: new Date("2024-01-01"),
  } as User;

  const employeeResponse: EmployeeResponseDto = {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    createdAt: employee.createdAt,
  };

  beforeEach(() => {
    employeeRepository = {
      findBy: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    appointmentRepository = {} as jest.Mocked<Repository<Appointment>>;
    availabilityService = {} as jest.Mocked<AvailabilityService>;

    employeeService = new EmployeeService(
      employeeRepository,
      appointmentRepository,
      availabilityService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getEmployees", () => {
    it("returns mapped employees filtered by role", async () => {
      employeeRepository.findBy.mockResolvedValue([employee]);

      const result = await employeeService.getEmployees();

      expect(employeeRepository.findBy).toHaveBeenCalledWith({
        role: UserRole.EMPLOYEE,
      });
      expect(result).toEqual([employeeResponse]);
    });

    it("returns empty array when there are no employees", async () => {
      employeeRepository.findBy.mockResolvedValue([]);

      const result = await employeeService.getEmployees();

      expect(result).toEqual([]);
    });

    it("propagates repository errors", async () => {
      employeeRepository.findBy.mockRejectedValue(new Error("Database error"));

      await expect(employeeService.getEmployees())
        .rejects
        .toThrow("Database error");
    });
  });

  describe("getEmployeeById", () => {
    it("returns mapped employee when repository finds one", async () => {
      employeeRepository.findOne.mockResolvedValue(employee);

      const result = await employeeService.getEmployeeById(1);

      expect(employeeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, role: UserRole.EMPLOYEE },
      });
      expect(result).toEqual(employeeResponse);
    });

    it("returns null when repository finds no employee", async () => {
      employeeRepository.findOne.mockResolvedValue(null);

      const result = await employeeService.getEmployeeById(999);

      expect(result).toBeNull();
    });

    it("propagates repository errors", async () => {
      employeeRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(employeeService.getEmployeeById(1))
        .rejects
        .toThrow("Database error");
    });
  });
});
