export interface CustomerResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
