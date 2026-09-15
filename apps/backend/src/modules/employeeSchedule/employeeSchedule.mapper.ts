import { EmployeeScheduleResponseDto } from "../../dto/employeeSchedule/employee-response.dto";
import { EmployeeSchedule } from "../../entities/employeeSchedule";
import { CreateEmployeeScheduleDto } from "../../dto/employeeSchedule/create-employeeSchedule.dto";

export class EmployeeScheduleMapper {

    static toEntity(dto: CreateEmployeeScheduleDto): EmployeeSchedule {
      const schedule = new EmployeeSchedule();
  
      schedule.employeeId = dto.employeeId;
      schedule.date = dto.date;
      schedule.startTime = dto.startTime;
      schedule.endTime = dto.endTime;
  
      return schedule;
    }

  static toResponse(schedule: EmployeeSchedule): EmployeeScheduleResponseDto {
    return {
      id: schedule.id,
      employeeId: schedule.employeeId,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }
}
