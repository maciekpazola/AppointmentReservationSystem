import { EmployeeMapper } from "./employee.mapper";
import { Repository } from "typeorm";
import { User } from "../../entities/user";
import { AvailabilityService } from "../availability/availability.service";
import { Appointment } from "../../entities/appointment";
import { UserRole } from "../../enums/userRole";

export class EmployeeService {

    constructor(
        private employeeRepository: Repository<User>,
        private appointmentRepository: Repository<Appointment>,
        private availabilityService: AvailabilityService
    ) {}


    async getEmployees() {

        const employees = await this.employeeRepository.findBy({
            role: UserRole.EMPLOYEE
        });
        const response = employees.map(EmployeeMapper.toResponse);
        return response;
    }


    async getEmployeeById(id: number) {

        const employee =
            await this.employeeRepository.findOne({
                where: {
                    id,
                    role: UserRole.EMPLOYEE
                }
            });


        if (!employee) {
            return null;
        }


        return EmployeeMapper.toResponse(employee);
    }
}
