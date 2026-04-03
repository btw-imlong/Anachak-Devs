import { BASE_URL } from "../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentService {
  assignmentId: number;
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  studentId: number;
  studentName: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getServicesByStudentId = async (
  studentId: number | string,
): Promise<StudentService[]> => {
  const res = await fetch(`${BASE_URL}/api/services/student/${studentId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch student services");
  return res.json();
};
