const BASE_URL = "http://localhost:8081";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  name: string;
  email: string;
  idCardNumber: string;
  assignedRooms: string[];
}

export interface CreateTeacherPayload {
  name: string;
  email: string;
  password: string;
  idCardNumber: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getTeachers = async (): Promise<Teacher[]> => {
  const res = await fetch(`${BASE_URL}/users/teacher`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch teachers");
  return res.json();
};

export const createTeacher = async (
  data: CreateTeacherPayload,
): Promise<Teacher> => {
  const res = await fetch(`${BASE_URL}/users/teacher`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create teacher");
  return res.json();
};

export const deleteTeacher = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/users/teacher/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete teacher");
};
