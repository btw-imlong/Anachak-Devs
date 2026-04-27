import { BASE_URL } from "../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Task {
  taskId: number;
  title: string;
  description: string;
  dayOfWeek: string;
  taskTime: string;
  status: string;
  roomNumber: string;
  side: string;
}

export interface TaskCompletion {
  completionId: number;
  taskId: number;
  taskTitle: string;
  completedDate: string;
  markedAt: string;
  markedByName: string;
  markedByRole: string;
}

export interface CompleteTaskPayload {
  taskId: number;
  completedDate: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getTasksByRoom = async (roomNumber: string): Promise<Task[]> => {
  const res = await fetch(`${BASE_URL}/api/tasks/room/${roomNumber}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const markTaskComplete = async (
  taskId: number,
  completedDate: string,
): Promise<TaskCompletion> => {
  const res = await fetch(`${BASE_URL}/api/tasks/complete`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ taskId, completedDate }),
  });
  if (!res.ok) throw new Error("Failed to mark task as complete");
  return res.json();
};
