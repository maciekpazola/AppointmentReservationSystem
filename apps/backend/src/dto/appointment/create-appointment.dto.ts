export interface CreateAppointmentDto {
  startTime: Date;
  endTime: Date;
  customerId: number;
  employeeId: number;
  serviceId: number;
}
