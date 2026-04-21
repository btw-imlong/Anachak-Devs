import axiosInstance from "./axios";

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
  const { data } = await axiosInstance.get("/api/users");
  return data;
};

export const createTeacher = async (
  payload: CreateTeacherPayload,
): Promise<void> => {
  await axiosInstance.post("/api/users/teacher", payload);
};

export const createStudent = async (
  payload: CreateStudentPayload,
): Promise<void> => {
  await axiosInstance.post("/api/users/student", payload);
};

export const updateTeacher = async (
  id: string,
  payload: UpdateTeacherPayload,
): Promise<void> => {
  await axiosInstance.put(`/api/users/teacher/${id}`, payload);
};

export const updateStudent = async (
  id: string,
  payload: UpdateStudentPayload,
): Promise<void> => {
  await axiosInstance.put(`/api/users/student/${id}`, payload);
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/users/${id}`);
};
