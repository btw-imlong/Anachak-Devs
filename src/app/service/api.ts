import axiosInstance from "./axios";

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    // Make sure old token is cleared
    localStorage.removeItem("token");

    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
}
