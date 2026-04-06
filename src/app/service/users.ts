import { BASE_URL } from "../config/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface UpdateTeacherPayload {
  name?: string;
  email?: string;
  idCardNumber?: string;
}

export interface UpdateStudentPayload {
  name?: string;
  email?: string;
  idCardNumber?: string;
  roomNumber?: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/api/users`, {
    // ✅ fixed
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const createTeacher = async (
  data: CreateTeacherPayload,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/users/teacher`, {
    // ✅ fixed
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create teacher");
  }
};

export const createStudent = async (
  data: CreateStudentPayload,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/users/student`, {
    // ✅ fixed
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create student");
  }
};

export const updateTeacher = async (
  id: string,
  data: UpdateTeacherPayload,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/users/teacher/${id}`, {
    // ✅ new
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update teacher");
  }
};

export const updateStudent = async (
  id: string,
  data: UpdateStudentPayload,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/users/student/${id}`, {
    // ✅ new
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update student");
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    // ✅ fixed
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete user");
  }
};
