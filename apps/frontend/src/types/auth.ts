import type { UserRole } from "./userRole";

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}
