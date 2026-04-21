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
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router";
import axiosInstance from "../../service/axios";
import type { RoomInfo, TeacherResponse } from "../../service/teacher";
import type {
  TaskResponse,
  TaskCompletionResponse,
} from "../../service/TeacherTask";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const JS_DAY_MAP: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function getTodayName(): string {
  return JS_DAY_MAP[new Date().getDay()];
}
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}
function getWeekFrom(): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  return monday.toISOString().split("T")[0];
}
function getWeekTo(): string {
  const from = new Date(getWeekFrom());
  from.setDate(from.getDate() + 6);
  return from.toISOString().split("T")[0];
}

export default function TeacherTasks() {
  const [myRooms, setMyRooms] = useState<RoomInfo[]>([]);
  const [tasksByRoom, setTasksByRoom] = useState<
    Record<string, TaskResponse[]>
  >({});
  const [completionKeys, setCompletionKeys] = useState<Set<string>>(new Set());
  const [completionIdMap, setCompletionIdMap] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingTaskId, setMarkingTaskId] = useState<number | null>(null);

  const userId = localStorage.getItem("userId");
  const today = getTodayDate();
  const todayName = getTodayName();
  const weekFrom = getWeekFrom();
  const weekTo = getWeekTo();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: teacher } = await axiosInstance.get(
        `/api/users/teacher/by-user/${userId}`,
      );
      const rooms: RoomInfo[] = teacher.rooms || [];
      setMyRooms(rooms);

      const taskMap: Record<string, TaskResponse[]> = {};
      await Promise.all(
        rooms.map(async (room) => {
          try {
            const { data } = await axiosInstance.get(
              `/api/tasks/room/${room.roomNumber}`,
            );
            taskMap[room.roomNumber] = data;
          } catch {
            taskMap[room.roomNumber] = [];
          }
        }),
      );
      setTasksByRoom(taskMap);

      const keys = new Set<string>();
      const idMap: Record<string, number> = {};
      await Promise.all(
        rooms.map(async (room) => {
          try {
            const { data: comps } = await axiosInstance.get(
              `/api/tasks/completions/room/${room.roomNumber}?from=${weekFrom}&to=${weekTo}`,
            );
            for (const c of comps) {
              const key = `${c.taskId}|${c.completedDate}`;
              keys.add(key);
              idMap[key] = c.completionId;
            }
          } catch {}
        }),
      );
      setCompletionKeys(keys);
      setCompletionIdMap(idMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function isDone(taskId: number, date: string): boolean {
    return completionKeys.has(`${taskId}|${date}`);
  }

  async function handleMarkDone(task: TaskResponse) {
    try {
      setMarkingTaskId(task.taskId);
      const { data: completion } = await axiosInstance.post(
        "/api/tasks/complete",
        {
          taskId: task.taskId,
          completedDate: today,
        },
      );
      const key = `${task.taskId}|${today}`;
      setCompletionKeys((prev) => new Set(prev).add(key));
      setCompletionIdMap((prev) => ({
        ...prev,
        [key]: completion.completionId,
      }));
      toast.success(`"${task.title}" marked as done!`);
    } catch (err: any) {
      if (err.response?.status === 400)
        toast.warning(err.response.data || "Already marked done today");
      else toast.error("Failed to mark task as done");
    } finally {
      setMarkingTaskId(null);
    }
  }

  async function handleUnmark(task: TaskResponse) {
    try {
      setMarkingTaskId(task.taskId);
      await axiosInstance.delete(`/api/tasks/${task.taskId}/complete/${today}`);
      const key = `${task.taskId}|${today}`;
      setCompletionKeys((prev) => {
        const s = new Set(prev);
        s.delete(key);
        return s;
      });
      setCompletionIdMap((prev) => {
        const m = { ...prev };
        delete m[key];
        return m;
      });
      toast.success(`"${task.title}" unmarked`);
    } catch {
      toast.error("Failed to unmark task");
    } finally {
      setMarkingTaskId(null);
    }
  }

  function getTaskForDay(
    roomNumber: string,
    day: string,
  ): TaskResponse | undefined {
    return tasksByRoom[roomNumber]?.find(
      (t) => t.dayOfWeek.toLowerCase() === day.toLowerCase(),
    );
  }

  function statusBadge(done: boolean, hasTask: boolean) {
    if (!hasTask)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
          <XCircle className="w-3 h-3" />
          No task
        </span>
      );
    return done ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <CheckCircle2 className="w-3 h-3" />
        Done
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading tasks...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );

  return (
    <div className="space-y-6">
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

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Today is {todayName}</p>
              <p className="text-sm text-gray-600">
                Click{" "}
                <span className="font-medium text-green-600">Mark Done</span> on
                today's task when complete.
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

      {myRooms.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No rooms assigned to you</p>
        </Card>
      )}

      {myRooms.map((room) => {
        const tasks: TaskResponse[] = tasksByRoom[room.roomNumber] || [];
        const todayTask = tasks.find(
          (t) => t.dayOfWeek.toLowerCase() === todayName.toLowerCase(),
        );
        return (
          <Card key={room.roomId} className="overflow-hidden">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Day</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-28">Time</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-40">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAYS.map((day) => {
                  const task = getTaskForDay(room.roomNumber, day);
                  const isToday = day.toLowerCase() === todayName.toLowerCase();
                  const isMarking = markingTaskId === task?.taskId;
                  const done = task ? isDone(task.taskId, today) : false;
                  return (
                    <TableRow key={day} className={isToday ? "bg-blue-50" : ""}>
                      <TableCell>
                        <Badge
                          variant={isToday ? "default" : "outline"}
                          className={isToday ? "bg-blue-600 text-white" : ""}
                        >
                          {day}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {task?.title ?? (
                          <span className="text-gray-400 font-normal">
                            No task assigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {task?.description ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {task?.taskTime ?? "—"}
                      </TableCell>
                      <TableCell>{statusBadge(done, !!task)}</TableCell>
                      <TableCell>
                        {task && isToday && !done && (
                          <button
                            onClick={() => handleMarkDone(task)}
                            disabled={isMarking}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isMarking ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                          >
                            {isMarking ? "Saving..." : "Mark Done"}
                          </button>
                        )}
                        {task && isToday && done && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Completed
                            </span>
                            <button
                              onClick={() => handleUnmark(task)}
                              disabled={isMarking}
                              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Undo"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Undo
                            </button>
                          </div>
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
