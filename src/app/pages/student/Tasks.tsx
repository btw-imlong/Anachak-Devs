import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Clock, Calendar, CheckCircle, Circle } from "lucide-react";
import { getTasksByRoom, markTaskComplete } from "../../service/task";
import type { Task } from "../../service/task";
import { getStudentByUserId } from "../../service/Studentdashboard";

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

const getTodayKey = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

const getTodayDate = () => new Date().toISOString().split("T")[0]; // "2026-04-03"

export default function StudentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [roomNumber, setRoomNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);

  const today = getTodayKey();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const student = await getStudentByUserId(userId);
        const room = student.room?.roomNumber;
        if (!room) throw new Error("No room assigned");
        setRoomNumber(room);

        const data = await getTasksByRoom(room);
        const sorted = [...data].sort(
          (a, b) =>
            DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
        );
        setTasks(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkComplete = async (task: Task) => {
    try {
      setCompletingId(task.taskId);
      await markTaskComplete(task.taskId, getTodayDate());
      // Update task status locally
      setTasks((prev) =>
        prev.map((t) =>
          t.taskId === task.taskId ? { ...t, status: "DONE" } : t,
        ),
      );
      toast.success(`"${task.title}" marked as complete!`);
    } catch (err) {
      toast.error("Failed to mark task as complete!");
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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

      {/* Room Info Banner */}
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

      {/* Task Cards */}
      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card className="p-6 text-center text-gray-400">
            No tasks assigned for your room yet.
          </Card>
        ) : (
          tasks.map((task) => {
            const isToday = task.dayOfWeek === today;
            const isDone = task.status === "DONE";
            const isCompleting = completingId === task.taskId;

            return (
              <Card
                key={task.taskId}
                className={`p-6 transition-all ${
                  isToday
                    ? "border-2 border-purple-500 bg-purple-50 shadow-md"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Day Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isToday ? "bg-purple-500" : "bg-gray-100"
                      }`}
                    >
                      <Calendar
                        className={`w-6 h-6 ${
                          isToday ? "text-white" : "text-gray-500"
                        }`}
                      />
                    </div>

                    {/* Task Info */}
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
                      <p className="text-sm text-gray-600 mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{task.taskTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Status + Button */}
                  <div className="flex flex-col items-end gap-3">
                    {isDone ? (
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

                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        isDone
                          ? "border-green-300 text-green-600"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {task.status}
                    </Badge>

                    {/* Mark Complete Button — only show if not done */}
                    {!isDone && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={isCompleting}
                        onClick={() => handleMarkComplete(task)}
                      >
                        {isCompleting ? "Marking..." : "Mark Complete"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">
          About Task Schedule
        </h3>
        <p className="text-sm text-gray-600">
          These are your room's weekly task assignments. Make sure to complete
          your tasks on time and check back daily for updates.
        </p>
      </Card>
    </div>
  );
}
