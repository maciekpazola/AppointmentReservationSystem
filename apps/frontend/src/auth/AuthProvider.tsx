import { useState, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "./AuthContext";
import { login as loginRequest } from "../api/auth.api";

const STORAGE_KEY_TOKEN = "accessToken";
const STORAGE_KEY_USER = "authUser";

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY_USER);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await loginRequest({ email, password });

      localStorage.setItem(STORAGE_KEY_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(response.user));
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
