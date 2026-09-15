import { EmployeeScheduleMapper } from "./employeeSchedule.mapper";
import { Repository } from "typeorm";
import { EmployeeSchedule } from "../../entities/employeeSchedule";
import { CreateEmployeeScheduleDto } from "../../dto/employeeSchedule/create-employeeSchedule.dto";

export class EmployeeScheduleService {

    constructor(
        private employeeRepository: Repository<EmployeeSchedule>
    ) {}

    
    async getEmployeeSchedules() {

        const employeeSchedules = await this.employeeRepository.find();
        const response = employeeSchedules.map(EmployeeScheduleMapper.toResponse);
        return response;
    }


    async getEmployeeScheduleById(id: number) {

        return await this.employeeRepository.findOne({
                where: {
                    id
                }
        });
    }


        async createEmployeeSchedule(dto: CreateEmployeeScheduleDto) {

            if (dto.startTime >= dto.endTime) {
                throw new Error("Invalid time range");
            }

    
            const entity = EmployeeScheduleMapper.toEntity(dto);
    
            const employeeSchedule =
                this.employeeRepository.create(entity);
    
            return this.employeeRepository.save(employeeSchedule);
        }
}
