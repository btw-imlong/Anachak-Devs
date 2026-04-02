const BASE_URL = "http://localhost:8081";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  password: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getStudents = async (): Promise<Student[]> => {
  const res = await fetch(`${BASE_URL}/users/student`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const createStudent = async (
  data: CreateStudentPayload,
): Promise<Student> => {
  const res = await fetch(`${BASE_URL}/users/student`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
};

export const deleteStudent = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/users/student/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete student");
};
