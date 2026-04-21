import axiosInstance from "./axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Service {
  serviceId: number;
  name: string;
  description: string;
}

export interface ServiceStudent {
  assignmentId: number;
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  studentId: number;
  studentName: string;
}

export interface CreateServicePayload {
  name: string;
  description: string;
}

export interface AssignServicePayload {
  serviceId: number;
  studentId: number;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getServices = async (): Promise<Service[]> => {
  const { data } = await axiosInstance.get("/api/services");
  return data;
};

export const getServiceStudents = async (
  serviceId: number,
): Promise<ServiceStudent[]> => {
  const { data } = await axiosInstance.get(
    `/api/services/${serviceId}/students`,
  );
  return data;
};

export const createService = async (
  payload: CreateServicePayload,
): Promise<Service> => {
  const { data } = await axiosInstance.post("/api/services", payload);
  return data;
};

export const assignService = async (
  payload: AssignServicePayload,
): Promise<void> => {
  await axiosInstance.post("/api/services/assign", payload);
};

export const deleteService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/services/${id}`);
};
