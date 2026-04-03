import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Edit, Trash2, Plus, Filter, CheckCircle2, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config/api";
import type { TaskResponse } from "../../service/TeacherTask";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomOption {
  id: number;
  roomNumber: string;
  side: string;
}

interface TaskForm {
  title: string;
  description: string;
  roomNumber: string;
  dayOfWeek: string;
  taskTime: string;
}

const EMPTY_FORM: TaskForm = {
  title: "",
  description: "",
  roomNumber: "",
  dayOfWeek: "",
  taskTime: "",
};

const DAYS: string[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminTaskManagement() {
  const [allRooms, setAllRooms] = useState<RoomOption[]>([]);
  const [allTasks, setAllTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Filters ──────────────────────────────────────────────────────────────
  const [filterSide, setFilterSide] = useState<string>("ALL");
  const [filterRoom, setFilterRoom] = useState<string>("ALL");
  const [filterDay, setFilterDay] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // ── Modals ────────────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [form, setForm] = useState<TaskForm>(EMPTY_FORM);

  const token = localStorage.getItem("token");
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Fetch all rooms + tasks ────────────────────────────────────────────────

  async function fetchData() {
    try {
      setLoading(true);

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

      // fetch tasks for all rooms in parallel
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
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  // ── Create task ────────────────────────────────────────────────────────────

  async function handleCreate() {
    if (!form.title || !form.roomNumber || !form.dayOfWeek || !form.taskTime) {
      toast.warning("Please fill in all required fields");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          roomNumber: form.roomNumber,
          dayOfWeek: form.dayOfWeek,
          taskTime: form.taskTime,
        }),
      });

      if (res.status === 400) {
        const text = await res.text();
        toast.error(text || "Duplicate task — check room, day and time");
        return;
      }
      if (!res.ok) throw new Error("Failed to create task");

      const created: TaskResponse = await res.json();
      setAllTasks((prev) => [...prev, created]);
      setCreateOpen(false);
      setForm(EMPTY_FORM);
      toast.success(`Task "${created.title}" created successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  // ── Edit task ──────────────────────────────────────────────────────────────

  function openEdit(task: TaskResponse) {
    setSelectedTask(task);
    setForm({
      title: task.title,
      description: task.description ?? "",
      roomNumber: task.roomNumber,
      dayOfWeek: task.dayOfWeek,
      taskTime: task.taskTime,
    });
    setEditOpen(true);
  }

  async function handleEdit() {
    if (!selectedTask) return;
    if (!form.title || !form.dayOfWeek || !form.taskTime) {
      toast.warning("Please fill in all required fields");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/api/tasks/${selectedTask.taskId}`, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          dayOfWeek: form.dayOfWeek,
          taskTime: form.taskTime,
        }),
      });

      if (res.status === 400) {
        const text = await res.text();
        toast.error(text || "Duplicate task — check day and time");
        return;
      }
      if (!res.ok) throw new Error("Failed to update task");

      const updated: TaskResponse = await res.json();
      setAllTasks((prev) =>
        prev.map((t) => (t.taskId === updated.taskId ? updated : t)),
      );
      setEditOpen(false);
      setSelectedTask(null);
      toast.success(`Task "${updated.title}" updated successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete task ────────────────────────────────────────────────────────────

  function openDelete(task: TaskResponse) {
    setSelectedTask(task);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!selectedTask) return;
    try {
      setDeletingId(selectedTask.taskId);
      const res = await fetch(`${BASE_URL}/api/tasks/${selectedTask.taskId}`, {
        method: "DELETE",
        headers: authHeader,
      });
      if (!res.ok) throw new Error("Failed to delete task");

      setAllTasks((prev) =>
        prev.filter((t) => t.taskId !== selectedTask.taskId),
      );
      setDeleteOpen(false);
      setSelectedTask(null);
      toast.success("Task deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  }

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredTasks = allTasks.filter((task: TaskResponse) => {
    const room = allRooms.find((r) => r.roomNumber === task.roomNumber);
    if (
      filterSide !== "ALL" &&
      room?.side.toLowerCase() !== filterSide.toLowerCase()
    )
      return false;
    if (filterRoom !== "ALL" && task.roomNumber !== filterRoom) return false;
    if (filterDay !== "ALL" && task.dayOfWeek.toUpperCase() !== filterDay)
      return false;
    if (filterStatus !== "ALL" && task.status.toUpperCase() !== filterStatus)
      return false;
    return true;
  });

  const roomsForDropdown =
    filterSide === "ALL"
      ? allRooms
      : allRooms.filter(
          (r) => r.side.toLowerCase() === filterSide.toLowerCase(),
        );

  function handleSideChange(value: string) {
    setFilterSide(value);
    setFilterRoom("ALL");
  }

  // ── Stats ──────────────────────────────────────────────────────────────────

  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(
    (t) => t.status.toUpperCase() === "DONE",
  ).length;
  const pendingTasks = allTasks.filter(
    (t) => t.status.toUpperCase() === "PENDING",
  ).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Task Management
          </h2>
          <p className="text-sm text-gray-500">
            Create and manage weekly tasks for all rooms
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => {
            setForm(EMPTY_FORM);
            setCreateOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Done</p>
          <p className="text-2xl font-bold text-green-600">{doneTasks}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
        </Card>
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
                {roomsForDropdown.map((room) => (
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
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day.charAt(0) + day.slice(1).toLowerCase()}
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

        {/* Active filters */}
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
              Day: {filterDay.charAt(0) + filterDay.slice(1).toLowerCase()}
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

      {/* Tasks Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            {filteredTasks.length !== totalTasks &&
              ` (filtered from ${totalTasks})`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Time</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="text-right w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-400 py-12"
                  >
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task: TaskResponse) => {
                  const room = allRooms.find(
                    (r) => r.roomNumber === task.roomNumber,
                  );
                  return (
                    <TableRow key={task.taskId}>
                      <TableCell className="font-medium">
                        {task.roomNumber}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            room?.side.toLowerCase() === "girls"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {room?.side ?? task.side}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {task.dayOfWeek.charAt(0) +
                            task.dayOfWeek.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {task.title}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {task.description ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {task.taskTime}
                      </TableCell>
                      <TableCell>
                        {task.status.toUpperCase() === "DONE" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(task)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDelete(task)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* ── Create Modal ──────────────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Room */}
            <div className="space-y-2">
              <Label>
                Room <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.roomNumber}
                onValueChange={(v) => setForm({ ...form, roomNumber: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {allRooms.map((room) => (
                    <SelectItem key={room.id} value={room.roomNumber}>
                      Room {room.roomNumber} — {room.side}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Day */}
            <div className="space-y-2">
              <Label>
                Day <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.dayOfWeek}
                onValueChange={(v) => setForm({ ...form, dayOfWeek: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label>
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                type="time"
                value={form.taskTime}
                onChange={(e) => setForm({ ...form, taskTime: e.target.value })}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Clean bathroom"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Optional details..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Task"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Room — read only */}
            <div className="space-y-2">
              <Label>Room</Label>
              <Input value={`Room ${selectedTask?.roomNumber}`} disabled />
            </div>

            {/* Day */}
            <div className="space-y-2">
              <Label>
                Day <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.dayOfWeek}
                onValueChange={(v) => setForm({ ...form, dayOfWeek: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label>
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                type="time"
                value={form.taskTime}
                onChange={(e) => setForm({ ...form, taskTime: e.target.value })}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleEdit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Modal ──────────────────────────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{selectedTask?.title}"
              </span>{" "}
              from Room {selectedTask?.roomNumber} on{" "}
              {selectedTask?.dayOfWeek
                ? selectedTask.dayOfWeek.charAt(0) +
                  selectedTask.dayOfWeek.slice(1).toLowerCase()
                : ""}
              ? This will also delete all completion history.
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                disabled={deletingId !== null}
              >
                {deletingId !== null ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteOpen(false)}
                disabled={deletingId !== null}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
