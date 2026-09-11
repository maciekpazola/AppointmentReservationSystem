import { AppointmentStatus } from "../../enums/appointmentStatus";

export interface AppointmentResponseDto {
  id: number;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  customerId: number;
  employeeId?: number;
  serviceId: number;
}
