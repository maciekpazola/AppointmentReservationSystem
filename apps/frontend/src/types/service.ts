export interface ServiceResponseDto {
  id: number;
  name: string;
  price: number;
}

export interface CreateServiceDto {
  name: string;
  price: number;
}
