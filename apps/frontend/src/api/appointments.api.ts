import { apiClient } from "./client";
import type { AppointmentResponseDto, CreateAppointmentDto } from "../types/appointment";

export const getAppointments = () =>
  apiClient
    .get<AppointmentResponseDto[]>("/appointments")
    .then((res) => res.data);

export const getAppointmentById = (id: number) =>
  apiClient
    .get<AppointmentResponseDto>(`/appointments/${id}`)
    .then((res) => res.data);

export const createAppointment = (dto: CreateAppointmentDto) =>
  apiClient
    .post<AppointmentResponseDto>("/appointments", dto)
    .then((res) => res.data);

export const cancelAppointment = (id: number) =>
  apiClient
    .post<void>(`/appointments/${id}/cancel`)
    .then((res) => res.data);
