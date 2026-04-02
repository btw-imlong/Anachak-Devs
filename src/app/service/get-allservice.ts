const BASE_URL = "http://localhost:8081";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

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
  const res = await fetch(`${BASE_URL}/api/services`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
};

export const getServiceStudents = async (
  serviceId: number,
): Promise<ServiceStudent[]> => {
  const res = await fetch(`${BASE_URL}/api/services/${serviceId}/students`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch service students");
  return res.json();
};

export const createService = async (
  data: CreateServicePayload,
): Promise<Service> => {
  const res = await fetch(`${BASE_URL}/api/services`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create service");
  return res.json();
};

export const assignService = async (
  data: AssignServicePayload,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/services/assign`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to assign service");
};

export const deleteService = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/services/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete service");
};
