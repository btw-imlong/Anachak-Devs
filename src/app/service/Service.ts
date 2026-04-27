import { BASE_URL } from "../config/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  description: string;
  assignedStudents: string[];
}

export interface CreateServicePayload {
  name: string;
  description: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getServices = async (): Promise<Service[]> => {
  const res = await fetch(`${BASE_URL}/api/services`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch services");
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

export const deleteService = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/services/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete service");
};
