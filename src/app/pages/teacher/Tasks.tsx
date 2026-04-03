import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";
import { BASE_URL } from "../../config/api";
import { toast } from "react-toastify";
import { Link } from "react-router";
import type { RoomInfo, TeacherResponse } from "../../service/teacher";
import type {
  TaskResponse,
  TaskCompletionResponse,
} from "../../service/TeacherTask";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TeacherTasks() {
  const [myRooms, setMyRooms] = useState<RoomInfo[]>([]);
  const [tasksByRoom, setTasksByRoom] = useState<
    Record<string, TaskResponse[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [markingTaskId, setMarkingTaskId] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const today = new Date().toISOString().split("T")[0]; // yyyy-MM-dd

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const teacherRes = await fetch(
        `${BASE_URL}/api/users/teacher/by-user/${userId}`,
        { headers: authHeader },
      );
      if (!teacherRes.ok) throw new Error("Failed to fetch teacher info");
      const teacher: TeacherResponse = await teacherRes.json();
      const rooms: RoomInfo[] = teacher.rooms || [];
      setMyRooms(rooms);

      const taskMap: Record<string, TaskResponse[]> = {};
      await Promise.all(
        rooms.map(async (room: RoomInfo) => {
          const res = await fetch(
            `${BASE_URL}/api/tasks/room/${room.roomNumber}`,
            { headers: authHeader },
          );
          if (res.ok) {
            const tasks: TaskResponse[] = await res.json();
            taskMap[room.roomNumber] = tasks;
          } else {
            taskMap[room.roomNumber] = [];
          }
        }),
      );
      setTasksByRoom(taskMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // ── Mark task as done ──────────────────────────────────────────────────────

  async function handleMarkDone(task: TaskResponse) {
    try {
      setMarkingTaskId(task.taskId);

      const res = await fetch(`${BASE_URL}/api/tasks/complete`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({
          taskId: task.taskId,
          completedDate: today,
        }),
      });

      if (res.status === 400) {
        const text = await res.text();
        toast.warning(text || "Task already marked as done today");
        return;
      }
      if (!res.ok) throw new Error("Failed to mark task as done");

      const completion: TaskCompletionResponse = await res.json();
      toast.success(`"${completion.taskTitle}" marked as done!`);

      // ✅ update local state — change status to DONE
      setTasksByRoom((prev) => {
        const updated = { ...prev };
        const roomTasks = updated[task.roomNumber] || [];
        updated[task.roomNumber] = roomTasks.map((t: TaskResponse) =>
          t.taskId === task.taskId ? { ...t, status: "DONE" } : t,
        );
        return updated;
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to mark task as done");
    } finally {
      setMarkingTaskId(null);
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function getTaskForDay(
    roomNumber: string,
    day: string,
  ): TaskResponse | undefined {
    return tasksByRoom[roomNumber]?.find(
      (t: TaskResponse) => t.dayOfWeek.toLowerCase() === day.toLowerCase(),
    );
  }

  function todayName(): string {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
  }

  function isTaskDay(task: TaskResponse): boolean {
    return task.dayOfWeek.toLowerCase() === todayName().toLowerCase();
  }

  function statusBadge(status: string) {
    switch (status?.toUpperCase()) {
      case "DONE":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3" />
            Done
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
            <XCircle className="w-3 h-3" />
            No task
          </span>
        );
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Weekly Task Schedule
          </h2>
          <p className="text-sm text-gray-500">
            View and manage tasks for your assigned rooms
          </p>
        </div>
        <Link to="/teacher/tasks/all">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            View All Rooms
          </button>
        </Link>
      </div>

      {/* Today Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">
                Today is {todayName()}
              </p>
              <p className="text-sm text-gray-600">
                Blue rows are today's tasks — click{" "}
                <span className="font-medium text-green-600">Mark Done</span> to
                complete them
              </p>
            </div>
          </div>
          <Badge className="bg-blue-600 hover:bg-blue-600">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Badge>
        </div>
      </Card>

      {/* No rooms */}
      {myRooms.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No rooms assigned to you</p>
        </Card>
      )}

      {/* Tasks for each room */}
      {myRooms.map((room: RoomInfo) => {
        const tasks: TaskResponse[] = tasksByRoom[room.roomNumber] || [];
        const todayTask = tasks.find((t: TaskResponse) => isTaskDay(t));

        return (
          <Card key={room.roomId} className="overflow-hidden">
            {/* Room Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Room {room.roomNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""} scheduled
                    {todayTask && (
                      <span className="ml-2 text-blue-600 font-medium">
                        • Today: {todayTask.title}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      room.side.toLowerCase() === "girls"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {room.side} Side
                  </Badge>
                </div>
              </div>
            </div>

            {/* Task Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Day</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-28">Time</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-32">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAYS.map((day: string) => {
                  const task: TaskResponse | undefined = getTaskForDay(
                    room.roomNumber,
                    day,
                  );
                  const isToday =
                    day.toLowerCase() === todayName().toLowerCase();
                  const isMarking = markingTaskId === task?.taskId;
                  const isDone = task?.status?.toUpperCase() === "DONE";

                  return (
                    <TableRow key={day} className={isToday ? "bg-blue-50" : ""}>
                      {/* Day */}
                      <TableCell>
                        <Badge
                          variant={isToday ? "default" : "outline"}
                          className={isToday ? "bg-blue-600 text-white" : ""}
                        >
                          {day}
                        </Badge>
                      </TableCell>

                      {/* Title */}
                      <TableCell className="font-medium text-gray-900">
                        {task?.title ?? (
                          <span className="text-gray-400 font-normal">
                            No task assigned
                          </span>
                        )}
                      </TableCell>

                      {/* Description */}
                      <TableCell className="text-sm text-gray-600">
                        {task?.description ?? "—"}
                      </TableCell>

                      {/* Time */}
                      <TableCell className="text-sm text-gray-600">
                        {task?.taskTime ?? "—"}
                      </TableCell>

                      {/* Status */}
                      <TableCell>{statusBadge(task?.status ?? "")}</TableCell>

                      {/* Action — only show on today's task row */}
                      <TableCell>
                        {task && isToday && !isDone && (
                          <button
                            onClick={() => handleMarkDone(task)}
                            disabled={isMarking}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isMarking
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {isMarking ? "Saving..." : "Mark Done"}
                          </button>
                        )}
                        {task && isToday && isDone && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Completed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        );
      })}
    </div>
  );
}
