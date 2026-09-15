import { EmployeeResponseDto } from "../../dto/employee/employee-response.dto";
import { User } from "../../entities/user";
import { AvailabilityResponseDto, AvailabilitySlotDto } from "../../dto/employee/availability-response.dto";

export class EmployeeMapper {

  static toResponse(user: User): EmployeeResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  static toAvailabilityResponse(
      employeeId: number,
      date: string,
      slots: AvailabilitySlotDto[]
  ): AvailabilityResponseDto {

      return {
          employeeId,
          date,
          slots
      };
  }
}
