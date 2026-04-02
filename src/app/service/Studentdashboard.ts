import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Teacher {
  teacherId: number;
  name: string;
  serviceName: string | null;
}

export interface Room {
  roomId: number;
  roomNumber: string;
  side: string;
  teacher: Teacher | null;
}

export interface Service {
  serviceId: number;
  name: string;
  description: string;
}

export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  idCardNumber: string;
  room: Room | null;
  services: Service[];
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getStudentByUserId = async (
  userId: number | string,
): Promise<StudentProfile> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/users/student/by-user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch student profile");
  return res.json();
};
const token = localStorage.getItem("token");
const decoded: any = jwtDecode(token!);
console.log("decoded:", decoded); // ← paste what prints here
