import { apiClient } from "./client";
import type { EmployeeResponseDto, AvailabilityResponseDto } from "../types/employee";

export const getEmployees = () =>
  apiClient
    .get<EmployeeResponseDto[]>("/employee")
    .then((res) => res.data);

export const getEmployeeById = (id: number) =>
  apiClient
    .get<EmployeeResponseDto>(`/employee/${id}`)
    .then((res) => res.data);

export const getEmployeeAvailability = (id: number, date: string) =>
  apiClient
    .get<AvailabilityResponseDto>(`/employee/${id}/availability`, {
      params: { date },
    })
    .then((res) => res.data);
