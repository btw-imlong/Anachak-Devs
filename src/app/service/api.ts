import axiosInstance from "./axios";

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    const data = response.data;

    localStorage.setItem("userId", String(data.userId));
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);

    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
}

export async function getMe(): Promise<{ email: string; role: string } | null> {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
  localStorage.clear();
}
