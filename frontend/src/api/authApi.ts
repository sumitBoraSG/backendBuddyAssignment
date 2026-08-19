import type { LoginResponse, LogoutResponse } from "../types/auth";

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err.message || "Failed to connect to the server. Please check your connection.",
      },
    };
  }
}

export async function logoutApi(token?: string): Promise<LogoutResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err.message || "Failed to communicate with logout service.",
      },
    };
  }
}
