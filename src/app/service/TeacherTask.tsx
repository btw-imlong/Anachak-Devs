export interface TaskResponse {
  taskId: number;
  title: string;
  description: string;
  dayOfWeek: string;
  taskTime: string;
  status: string;
  roomNumber: string;
  side: string;
}

export interface TaskCompletionResponse {
  completionId: number;
  taskId: number;
  taskTitle: string;
  completedDate: string;
  markedAt: string;
  markedByRole: string;
  markedByName: string;
}
