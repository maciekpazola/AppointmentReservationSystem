export interface EmployeeScheduleResponseDto {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}