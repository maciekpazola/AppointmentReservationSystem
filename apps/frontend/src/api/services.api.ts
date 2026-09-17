import { apiClient } from "./client";
import type { ServiceResponseDto, CreateServiceDto } from "../types/service";

export const getServices = () =>
  apiClient
    .get<ServiceResponseDto[]>("/services")
    .then((res) => res.data);

export const createService = (dto: CreateServiceDto) =>
  apiClient
    .post<ServiceResponseDto>("/services", dto)
    .then((res) => res.data);
