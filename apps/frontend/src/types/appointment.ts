export const AppointmentStatus = {
  CREATED: "CREATED",
  CANCELLED: "CANCELLED",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export interface AppointmentResponseDto {
  id: number;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  customerId: number;
  employeeId: number;
  serviceId: number;
}

export interface CreateAppointmentDto {
  startTime: string;
  endTime: string;
  customerId: number;
  employeeId: number;
  serviceId: number;
}
