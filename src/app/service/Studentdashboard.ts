import axiosInstance from "./axios";

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
  const { data } = await axiosInstance.get(
    `/api/users/student/by-user/${userId}`,
  );
  return data;
};
