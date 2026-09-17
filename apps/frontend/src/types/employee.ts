export interface EmployeeResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface AvailabilitySlotDto {
  startTime: string;
  endTime: string;
}

export interface AvailabilityResponseDto {
  employeeId: number;
  date: string;
  slots: AvailabilitySlotDto[];
}
