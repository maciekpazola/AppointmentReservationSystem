import { createContext } from "react";
import type { UserRole } from "../types/userRole";

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
