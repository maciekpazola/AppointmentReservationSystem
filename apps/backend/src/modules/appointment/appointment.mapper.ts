import { CreateAppointmentDto } from "../../dto/appointment/create-appointment.dto";
import { AppointmentResponseDto } from "../../dto/appointment/appointment-response.dto";
import { Appointment } from "../../entities/appointment";
import { AppointmentStatus } from "../../enums/appointmentStatus";

export class AppointmentMapper {
  static toEntity(dto: CreateAppointmentDto): Appointment {
    const appointment = new Appointment();

    appointment.startTime = dto.startTime;
    appointment.endTime = dto.endTime;
    appointment.employeeId = dto.employeeId;
    appointment.customerId = dto.customerId;
    appointment.serviceId = dto.serviceId;
    appointment.status = AppointmentStatus.CREATED;

    return appointment;
  }

  static toResponse(appointment: Appointment): AppointmentResponseDto {
    return {
      id: appointment.id,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      customerId: appointment.customerId,
      employeeId: appointment.employeeId,
      serviceId: appointment.serviceId,
    };
  }
}