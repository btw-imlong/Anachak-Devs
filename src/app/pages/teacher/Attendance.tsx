import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Calendar, Save, HelpCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import axiosInstance from "../../service/axios";
import type { RoomInfo, TeacherResponse } from "../../service/teacher";
import type { AttendanceRecordResponse } from "../../service/attendance";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

interface StudentAttendance {
  recordId: number;
  studentId: number;
  studentName: string;
  status: AttendanceStatus;
}

interface RoomResponse {
  id: number;
  roomNumber: string;
  side: string;
  students: { studentId: number; name: string; idCardNumber: string }[];
  teachers: { teacherId: number; name: string }[];
}

interface ToggleHelpModeResponse {
  teacherId: number;
  teacherName: string;
  helpMode: boolean;
  message: string;
}

export default function TeacherAttendance() {
  const [helpMode, setHelpMode] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [myRooms, setMyRooms] = useState<RoomInfo[]>([]);
  const [allRooms, setAllRooms] = useState<RoomInfo[]>([]);
  const [roomDetail, setRoomDetail] = useState<RoomResponse | null>(null);
  const [sessionExists, setSessionExists] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
  const [togglingHelp, setTogglingHelp] = useState<boolean>(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const { data: teacher } = await axiosInstance.get(
        `/api/users/teacher/by-user/${userId}`,
      );
      setMyRooms(teacher.rooms || []);

      const { data: allRoomsData } = await axiosInstance.get("/api/rooms");
      const mapped: RoomInfo[] = allRoomsData.map((r: any) => ({
        roomId: r.id,
        roomNumber: r.roomNumber,
        side: r.side,
      }));
      setAllRooms(mapped);
    } catch {
      toast.error("Failed to load rooms");
    }
  }

  useEffect(() => {
    if (!selectedRoom || !selectedDate) return;
    fetchAttendanceSession();
  }, [selectedRoom, selectedDate]);

  async function fetchAttendanceSession() {
    try {
      setLoadingRoom(true);
      setSessionExists(false);
      setAttendance([]);

      const { data: roomData } = await axiosInstance.get(
        `/api/rooms/id/${selectedRoom}`,
      );
      setRoomDetail(roomData);

      try {
        const { data: records } = await axiosInstance.get(
          `/api/attendance?roomNumber=${roomData.roomNumber}&date=${selectedDate}`,
        );
        if (records.length === 0) {
          setSessionExists(false);
          setAttendance([]);
        } else {
          setSessionExists(true);
          setAttendance(
            records.map((r: any) => ({
              recordId: r.recordId,
              studentId: r.studentId,
              studentName: r.studentName,
              status: r.status as AttendanceStatus,
            })),
          );
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          toast.error("You don't have access to this room. Enable help mode.");
        }
      }
    } catch {
      toast.error("Failed to load room");
    } finally {
      setLoadingRoom(false);
    }
  }

  async function handleHelpModeToggle() {
    try {
      setTogglingHelp(true);
      const { data } = await axiosInstance.patch("/api/attendance/help-mode");
      setHelpMode(data.helpMode);
      toast.info(data.message);
    } catch (err: any) {
      toast.error("Failed to toggle help mode: " + err.message);
    } finally {
      setTogglingHelp(false);
    }
  }

  function handleStatusChange(studentId: number, status: AttendanceStatus) {
    setAttendance((prev) => {
      const existing = prev.find((a) => a.studentId === studentId);
      if (existing)
        return prev.map((a) =>
          a.studentId === studentId ? { ...a, status } : a,
        );
      const student = roomDetail?.students.find(
        (s) => s.studentId === studentId,
      );
      return [
        ...prev,
        { recordId: 0, studentId, studentName: student?.name || "", status },
      ];
    });
  }

  function getStudentStatus(studentId: number): AttendanceStatus | null {
    return attendance.find((a) => a.studentId === studentId)?.status || null;
  }

  async function handleSave() {
    if (!roomDetail) return;
    try {
      setSaving(true);
      if (!sessionExists) {
        try {
          await axiosInstance.post("/api/attendance", {
            roomNumber: roomDetail.roomNumber,
            date: selectedDate,
          });
        } catch (err: any) {
          if (err.response?.status === 403)
            throw new Error(
              "Access denied — enable help mode to mark this room",
            );
          if (err.response?.status === 400)
            throw new Error(
              err.response.data || "Attendance already exists for this date",
            );
          throw new Error("Failed to create attendance session");
        }

        const { data: records } = await axiosInstance.get(
          `/api/attendance?roomNumber=${roomDetail.roomNumber}&date=${selectedDate}`,
        );
        const merged = records.map((r: any) => ({
          recordId: r.recordId,
          status:
            attendance.find((a) => a.studentId === r.studentId)?.status ||
            "ABSENT",
        }));
        await axiosInstance.put("/api/attendance/bulk", { records: merged });
        setAttendance(
          records.map((r: any) => {
            const selected = attendance.find(
              (a) => a.studentId === r.studentId,
            );
            return {
              recordId: r.recordId,
              studentId: r.studentId,
              studentName: r.studentName,
              status: (selected?.status || "ABSENT") as AttendanceStatus,
            };
          }),
        );
        setSessionExists(true);
      } else {
        const updates = attendance.map((a) => ({
          recordId: a.recordId,
          status: a.status,
        }));
        await axiosInstance.put("/api/attendance/bulk", { records: updates });
      }
      toast.success("Attendance saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }

  const availableRooms = helpMode ? allRooms : myRooms;
  const myRoomIds = new Set(myRooms.map((r) => r.roomId));
  const students = roomDetail?.students || [];
  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header with Help Mode Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Take Attendance
            </h2>
            <p className="text-sm text-gray-500">
              Mark student attendance for the selected date
            </p>
          </div>

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    <strong>Help Mode:</strong> Enable this when the assigned
                    teacher is absent. It allows you to take attendance for
                    rooms not assigned to you. The system will record that you
                    acted as a substitute teacher.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="help-mode"
                className="text-sm font-medium cursor-pointer"
              >
                Help Mode (Substitute)
              </Label>
              <Switch
                id="help-mode"
                checked={helpMode}
                disabled={togglingHelp}
                onCheckedChange={handleHelpModeToggle}
              />
            </div>
          </div>
        </div>

        {helpMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Substitute Teacher Mode Active
              </p>
              <p className="text-sm text-blue-700">
                You can now select and manage attendance for any room. Your name
                will be recorded as the substitute teacher.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">
              Select Room
              {helpMode && (
                <span className="ml-2 text-xs text-blue-600">
                  (All rooms available)
                </span>
              )}
            </Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
                  <SelectItem key={room.roomId} value={String(room.roomId)}>
                    Room {room.roomNumber} -{" "}
                    {room.side.toLowerCase() === "girls" ? "Girls" : "Boys"}{" "}
                    Side
                    {helpMode && !myRoomIds.has(room.roomId) && (
                      <span className="ml-2 text-xs text-blue-600">
                        (Other teacher's room)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Loading */}
      {loadingRoom && (
        <Card className="p-12 text-center">
          <p className="text-gray-400 text-sm">Loading room data...</p>
        </Card>
      )}

      {/* Attendance Table */}
      {!loadingRoom && selectedRoom && students.length > 0 && (
        <>
          <Card className="overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Room {roomDetail?.roomNumber} - Attendance
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {students.length} students • {selectedDate}
                    {sessionExists && (
                      <span className="ml-2 text-green-600 text-xs font-medium">
                        ✓ Session exists
                      </span>
                    )}
                  </p>
                </div>
                <Badge
                  variant={
                    roomDetail?.side.toLowerCase() === "girls"
                      ? "secondary"
                      : "default"
                  }
                >
                  {roomDetail?.side} Side
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {students.map((student, index) => {
                  const status = getStudentStatus(student.studentId);
                  return (
                    <div
                      key={student.studentId}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.idCardNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusChange(student.studentId, "PRESENT")
                            }
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              status === "PRESENT"
                                ? "bg-green-500 text-white shadow-md scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student.studentId, "LATE")
                            }
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              status === "LATE"
                                ? "bg-yellow-500 text-white shadow-md scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                            }`}
                          >
                            Late
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student.studentId, "ABSENT")
                            }
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              status === "ABSENT"
                                ? "bg-red-500 text-white shadow-md scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Summary Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Attendance Summary
                </h3>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Present:{" "}
                      {attendance.filter((a) => a.status === "PRESENT").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Late:{" "}
                      {attendance.filter((a) => a.status === "LATE").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Absent:{" "}
                      {attendance.filter((a) => a.status === "ABSENT").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-700">
                      Not marked: {students.length - attendance.length}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleSave}
                disabled={attendance.length === 0 || saving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </Card>
        </>
      )}

      {!loadingRoom && selectedRoom && students.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No students found in this room</p>
        </Card>
      )}

      {!selectedRoom && (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            Select a room to start taking attendance
          </p>
        </Card>
      )}
    </div>
  );
}
