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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CheckCircle2, Clock, XCircle, Filter } from "lucide-react";
import { BASE_URL } from "../../config/api";
import type { TaskResponse } from "../../service/TeacherTask";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomOption {
  id: number;
  roomNumber: string;
  side: string;
}

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

export default function AllRoomsTasks() {
  const [allRooms, setAllRooms] = useState<RoomOption[]>([]);
  const [allTasks, setAllTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── Filters ──────────────────────────────────────────────────────────────
  const [filterSide, setFilterSide] = useState<string>("ALL");
  const [filterRoom, setFilterRoom] = useState<string>("ALL");
  const [filterDay, setFilterDay] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const token = localStorage.getItem("token");
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      // 1. get all rooms
      const roomsRes = await fetch(`${BASE_URL}/api/rooms`, {
        headers: authHeader,
      });
      if (!roomsRes.ok) throw new Error("Failed to fetch rooms");
      const roomsData = await roomsRes.json();
      const rooms: RoomOption[] = roomsData.map((r: any) => ({
        id: r.id,
        roomNumber: r.roomNumber,
        side: r.side,
      }));
      setAllRooms(rooms);

      // 2. fetch tasks for all rooms in parallel
      const taskArrays = await Promise.all(
        rooms.map(async (room: RoomOption) => {
          const res = await fetch(
            `${BASE_URL}/api/tasks/room/${room.roomNumber}`,
            { headers: authHeader },
          );
          if (res.ok) {
            const tasks: TaskResponse[] = await res.json();
            return tasks;
          }
          return [];
        }),
      );

      setAllTasks(taskArrays.flat());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // ── Filtering logic ────────────────────────────────────────────────────────

  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const filteredRooms = allRooms.filter((room: RoomOption) => {
    if (
      filterSide !== "ALL" &&
      room.side.toLowerCase() !== filterSide.toLowerCase()
    )
      return false;
    if (filterRoom !== "ALL" && room.roomNumber !== filterRoom) return false;
    return true;
  });

  function getFilteredTasksForRoom(roomNumber: string): TaskResponse[] {
    return allTasks.filter((t: TaskResponse) => {
      if (t.roomNumber !== roomNumber) return false;
      if (
        filterDay !== "ALL" &&
        t.dayOfWeek.toLowerCase() !== filterDay.toLowerCase()
      )
        return false;
      if (filterStatus !== "ALL" && t.status.toUpperCase() !== filterStatus)
        return false;
      return true;
    });
  }

  // ── When side changes, reset room filter ──────────────────────────────────
  function handleSideChange(value: string) {
    setFilterSide(value);
    setFilterRoom("ALL");
  }

  // ── Rooms available in selected side for room dropdown ────────────────────
  const roomsForDropdown =
    filterSide === "ALL"
      ? allRooms
      : allRooms.filter(
          (r: RoomOption) => r.side.toLowerCase() === filterSide.toLowerCase(),
        );

  // ── Helpers ────────────────────────────────────────────────────────────────

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

  const daysToShow = filterDay === "ALL" ? DAYS : [filterDay];

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading all tasks...</p>
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
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          All Room Tasks
        </h2>
        <p className="text-sm text-gray-500">
          View and filter tasks across all rooms
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-700">Filters</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Side */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Side</p>
            <Select value={filterSide} onValueChange={handleSideChange}>
              <SelectTrigger>
                <SelectValue placeholder="All sides" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sides</SelectItem>
                <SelectItem value="Girls">Girls</SelectItem>
                <SelectItem value="Boys">Boys</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Room</p>
            <Select value={filterRoom} onValueChange={setFilterRoom}>
              <SelectTrigger>
                <SelectValue placeholder="All rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Rooms</SelectItem>
                {roomsForDropdown.map((room: RoomOption) => (
                  <SelectItem key={room.id} value={room.roomNumber}>
                    Room {room.roomNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Day</p>
            <Select value={filterDay} onValueChange={setFilterDay}>
              <SelectTrigger>
                <SelectValue placeholder="All days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Days</SelectItem>
                <SelectItem value={todayName}>Today ({todayName})</SelectItem>
                {DAYS.map((day: string) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Status</p>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filter summary */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {filterSide !== "ALL" && (
            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
              Side: {filterSide}
            </span>
          )}
          {filterRoom !== "ALL" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Room: {filterRoom}
            </span>
          )}
          {filterDay !== "ALL" && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              Day: {filterDay}
            </span>
          )}
          {filterStatus !== "ALL" && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
              Status: {filterStatus}
            </span>
          )}
          {(filterSide !== "ALL" ||
            filterRoom !== "ALL" ||
            filterDay !== "ALL" ||
            filterStatus !== "ALL") && (
            <button
              onClick={() => {
                setFilterSide("ALL");
                setFilterRoom("ALL");
                setFilterDay("ALL");
                setFilterStatus("ALL");
              }}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200"
            >
              Clear all
            </button>
          )}
        </div>
      </Card>

      {/* No results */}
      {filteredRooms.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No rooms match your filters</p>
        </Card>
      )}

      {/* Task tables per room */}
      {filteredRooms.map((room: RoomOption) => {
        const tasks = getFilteredTasksForRoom(room.roomNumber);

        // skip rooms with no tasks when filtering by day or status
        if (
          (filterDay !== "ALL" || filterStatus !== "ALL") &&
          tasks.length === 0
        )
          return null;

        return (
          <Card key={room.id} className="overflow-hidden">
            {/* Room Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Room {room.roomNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                    {filterDay !== "ALL" ? ` on ${filterDay}` : " this week"}
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

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Day</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-28">Time</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterDay === "ALL" ? (
                  // show all days with or without tasks
                  daysToShow.map((day: string) => {
                    const task = tasks.find(
                      (t: TaskResponse) =>
                        t.dayOfWeek.toLowerCase() === day.toLowerCase(),
                    );
                    const isToday =
                      day.toLowerCase() === todayName.toLowerCase();

                    // skip if status filter active and no task
                    if (filterStatus !== "ALL" && !task) return null;

                    return (
                      <TableRow
                        key={day}
                        className={isToday ? "bg-blue-50" : ""}
                      >
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
                        <TableCell>{statusBadge(task?.status ?? "")}</TableCell>
                      </TableRow>
                    );
                  })
                ) : // show only filtered tasks
                tasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-400 py-6"
                    >
                      No tasks for {filterDay}
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task: TaskResponse) => {
                    const isToday =
                      task.dayOfWeek.toLowerCase() === todayName.toLowerCase();
                    return (
                      <TableRow
                        key={task.taskId}
                        className={isToday ? "bg-blue-50" : ""}
                      >
                        <TableCell>
                          <Badge
                            variant={isToday ? "default" : "outline"}
                            className={isToday ? "bg-blue-600 text-white" : ""}
                          >
                            {task.dayOfWeek}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {task.title}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {task.description ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {task.taskTime ?? "—"}
                        </TableCell>
                        <TableCell>{statusBadge(task.status)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        );
      })}
    </div>
  );
}
