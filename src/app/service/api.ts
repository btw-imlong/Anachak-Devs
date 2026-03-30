// src/api.ts
export const API_BASE = "http://localhost:8081";

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

// Login API
export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data;
}
