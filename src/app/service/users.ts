const BASE_URL = "http://localhost:8081";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateTeacherPayload {
  name: string;
  email: string;
  password: string;
  idCardNumber: string;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  password: string;
  idCardNumber: string;
  roomNumber: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/api/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const createTeacher = async (
  data: CreateTeacherPayload,
): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/teacher`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create teacher");
  return res.json();
};

export const createStudent = async (
  data: CreateStudentPayload,
): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/student`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
};

export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
};
