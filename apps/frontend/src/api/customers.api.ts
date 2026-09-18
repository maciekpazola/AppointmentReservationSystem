import { apiClient } from "./client";
import type { CustomerResponseDto, CreateCustomerDto } from "../types/customer";

export const getCustomers = () =>
  apiClient
    .get<CustomerResponseDto[]>("/customers")
    .then((res) => res.data);

export const getCustomerById = (id: number) =>
  apiClient
    .get<CustomerResponseDto>(`/customers/${id}`)
    .then((res) => res.data);

export const createCustomer = (dto: CreateCustomerDto) =>
  apiClient
    .post<CustomerResponseDto>("/customers", dto)
    .then((res) => res.data);
