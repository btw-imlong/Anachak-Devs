import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Clock, Calendar, CheckCircle, Circle } from "lucide-react";
import { BASE_URL } from "../../config/api";
import { getStudentByUserId } from "../../service/Studentdashboard";
import type {
  TaskResponse,
  TaskCompletionResponse,
} from "../../service/TeacherTask";

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
const formatDay = (day: string) => day.charAt(0) + day.slice(1).toLowerCase();

const JS_DAY_MAP: Record<number, string> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

function getTodayKey(): string {
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

export default function StudentTasks() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [completionKeys, setCompletionKeys] = useState<Set<string>>(new Set());
  const [roomNumber, setRoomNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const today = getTodayDate();
  const todayKey = getTodayKey();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const student = await getStudentByUserId(userId);
        const room = student.room?.roomNumber;
        if (!room) throw new Error("No room assigned");
        setRoomNumber(room);

        // fetch tasks
        const tasksRes = await fetch(`${BASE_URL}/api/tasks/room/${room}`, {
          headers: authHeader,
        });
        if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
        const data: TaskResponse[] = await tasksRes.json();
        const sorted = [...data].sort(
          (a, b) =>
            DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
        );
        setTasks(sorted);

        // fetch this week's completions — read-only for students
        const compRes = await fetch(
          `${BASE_URL}/api/tasks/completions/room/${room}?from=${getWeekFrom()}&to=${getWeekTo()}`,
          { headers: authHeader },
        );
        if (compRes.ok) {
          const comps: TaskCompletionResponse[] = await compRes.json();
          const keys = new Set<string>();
          for (const c of comps) keys.add(`${c.taskId}|${c.completedDate}`);
          setCompletionKeys(keys);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  function isDone(taskId: number): boolean {
    return completionKeys.has(`${taskId}|${today}`);
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          My Weekly Tasks
        </h2>
        <p className="text-sm text-gray-500">
          Your assigned tasks for Room {roomNumber}
        </p>
      </div>

      {tasks.length > 0 && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Room {tasks[0].roomNumber} — {tasks[0].side} Side
                </p>
                <p className="text-sm text-gray-600">Weekly task schedule</p>
              </div>
            </div>
            <Badge className="bg-purple-600 hover:bg-purple-600">Active</Badge>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card className="p-6 text-center text-gray-400">
            No tasks assigned for your room yet.
          </Card>
        ) : (
          tasks.map((task) => {
            const isToday = task.dayOfWeek === todayKey;
            const done = isDone(task.taskId);

            return (
              <Card
                key={task.taskId}
                className={`p-6 transition-all ${isToday ? "border-2 border-purple-500 bg-purple-50 shadow-md" : "hover:shadow-md"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${isToday ? "bg-purple-500" : "bg-gray-100"}`}
                    >
                      <Calendar
                        className={`w-6 h-6 ${isToday ? "text-white" : "text-gray-500"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {formatDay(task.dayOfWeek)}
                        </h3>
                        {isToday && (
                          <Badge className="bg-purple-600 hover:bg-purple-600">
                            Today
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{task.taskTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status — read only, no mark done button */}
                  <div className="flex flex-col items-end gap-2">
                    {done ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Done</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400">
                        <Circle className="w-5 h-5" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                    )}
                    {isToday && !done && (
                      <p className="text-xs text-gray-400 text-right max-w-[120px]">
                        Your teacher will mark this done
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">
          About Task Schedule
        </h3>
        <p className="text-sm text-gray-600">
          These are your room's weekly recurring tasks. Your teacher marks tasks
          as done each day. Check back to see today's progress.
        </p>
      </Card>
    </div>
  );
}
