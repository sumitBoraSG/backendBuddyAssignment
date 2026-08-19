export type UserRole = "ADMIN" | "PATIENT" | "DOCTOR";

export interface User {
  id: number | string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}
