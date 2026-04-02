import { useState } from "react";
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
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Edit, Filter } from "lucide-react";
import { tasks, rooms } from "../../data/mockData";

export default function TaskManagement() {
  const [sideFilter, setSideFilter] = useState<"all" | "girls" | "boys">("all");
  const [rotationFilter, setRotationFilter] = useState<"all" | "1" | "2" | "3">(
    "all",
  );
  const [editTaskOpen, setEditTaskOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const room = rooms.find((r) => r.id === task.roomId);
    if (!room) return false;

    if (sideFilter !== "all" && room.side !== sideFilter) return false;
    if (
      rotationFilter !== "all" &&
      task.rotationMonth.toString() !== rotationFilter
    )
      return false;

    return true;
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Task Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage weekly tasks and 3-month rotation schedule
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="side-filter" className="text-sm">
              Side:
            </Label>
            <Select
              value={sideFilter}
              onValueChange={(value: any) => setSideFilter(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sides</SelectItem>
                <SelectItem value="girls">Girls</SelectItem>
                <SelectItem value="boys">Boys</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="rotation-filter" className="text-sm">
              Rotation Month:
            </Label>
            <Select
              value={rotationFilter}
              onValueChange={(value: any) => setRotationFilter(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="1">Month 1</SelectItem>
                <SelectItem value="2">Month 2</SelectItem>
                <SelectItem value="3">Month 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Current: Rotation Month 1/3
            </Badge>
          </div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Rotation Month</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.slice(0, 50).map((task) => {
                const room = rooms.find((r) => r.id === task.roomId);
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.roomId}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          room?.side === "girls" ? "secondary" : "default"
                        }
                      >
                        {room?.side === "girls" ? "Girls" : "Boys"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.day}</Badge>
                    </TableCell>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Month {task.rotationMonth}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={editTaskOpen}
                        onOpenChange={setEditTaskOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Room</Label>
                              <Input value={task.roomId} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Day</Label>
                              <Select defaultValue={task.day}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {days.map((day) => (
                                    <SelectItem key={day} value={day}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Task</Label>
                              <Input defaultValue={task.task} />
                            </div>
                            <div className="space-y-2">
                              <Label>Rotation Month</Label>
                              <Select
                                defaultValue={task.rotationMonth.toString()}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Month 1</SelectItem>
                                  <SelectItem value="2">Month 2</SelectItem>
                                  <SelectItem value="3">Month 3</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button
                                className="flex-1"
                                onClick={() => setEditTaskOpen(false)}
                              >
                                Save Changes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setEditTaskOpen(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">
            Rotation Schedule
          </h3>
          <p className="text-sm text-gray-600">
            Tasks rotate every 3 months. Current period: Month 1 (Jan-Mar 2026)
          </p>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <h3 className="font-semibold text-gray-900 mb-2">Weekly Tasks</h3>
          <p className="text-sm text-gray-600">
            Each room has assigned tasks for all 7 days of the week
          </p>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-2">
            Room Distribution
          </h3>
          <p className="text-sm text-gray-600">
            24 rooms on Girls' side, 24 rooms on Boys' side
          </p>
        </Card>
      </div>
    </div>
  );
}
