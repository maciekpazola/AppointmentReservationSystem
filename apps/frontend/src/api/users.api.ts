import { apiClient } from "./client";
import type { UserResponseDto, CreateUserDto } from "../types/user";

export const getUsers = () =>
  apiClient
    .get<UserResponseDto[]>("/users")
    .then((res) => res.data);

export const createUser = (dto: CreateUserDto) =>
  apiClient
    .post<UserResponseDto>("/users", dto)
    .then((res) => res.data);
