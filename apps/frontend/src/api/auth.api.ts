import { apiClient } from "./client";
import type { LoginDto, LoginResponseDto } from "../types/auth";

export const login = (dto: LoginDto) =>
  apiClient
    .post<LoginResponseDto>("/auth/login", dto)
    .then((res) => res.data);
