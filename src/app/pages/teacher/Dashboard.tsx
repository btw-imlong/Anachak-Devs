import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Home, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import axiosInstance from "../../service/axios";
import type { AttendanceSummaryResponse } from "../../service/attendance";
import type {
  TeacherResponse,
  RoomInfo,
  StudentResponse,
  PageResponse,
} from "../../service/teacher";

export default function TeacherDashboard() {
  const [myRooms, setMyRooms] = useState<RoomInfo[]>([]);
  const [allMyStudents, setAllMyStudents] = useState<StudentResponse[]>([]);
  const [presentCount, setPresentCount] = useState<number>(0);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummaryResponse | null>(null);

  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const { data: teacher } = await axiosInstance.get(
        `/api/users/teacher/by-user/${teacherId}`,
      );
      const rooms: RoomInfo[] = teacher.rooms || [];
      setMyRooms(rooms);

      const { data: studentsData } = await axiosInstance.get(
        "/api/users/students?page=0&size=100&sortBy=name",
      );
      const allStudents = studentsData.content || [];
      const roomNumbers = rooms.map((r) => r.roomNumber);
      const myStudents = allStudents.filter(
        (s: any) => s.room && roomNumbers.includes(s.room.roomNumber),
      );
      setAllMyStudents(myStudents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }

    try {
      const { data: summary } = await axiosInstance.get(
        "/api/attendance/today/summary",
      );
      setAttendanceSummary(summary);
      setPresentCount(summary.present);
      setTodayTotal(summary.total);
    } catch {
      // fail silently
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Rooms</p>
              <p className="text-3xl font-bold text-gray-900">
                {myRooms.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Assigned to you</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {allMyStudents.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Under your supervision
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Link to="/teacher/attendance-today">
          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Attendance Today</p>
                <p className="text-3xl font-bold text-gray-900">
                  {attendanceSummary ? presentCount : "—"}
                </p>
                {attendanceSummary ? (
                  <p className="text-xs text-gray-500 mt-1">
                    {presentCount} present · {attendanceSummary.absent} absent ·{" "}
                    {attendanceSummary.late} late
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                    No attendance taken today
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* My Rooms Grid */}
      <div id="rooms">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              My Assigned Rooms
            </h2>
            <p className="text-sm text-gray-500">
              Rooms under your supervision
            </p>
          </div>
          <Link to="/teacher/attendance">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Take Attendance
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {myRooms.map((room) => {
            const roomStudents = allMyStudents.filter(
              (s) => s.room?.roomNumber === room.roomNumber,
            );
            const previewStudent = roomStudents[0]; // show only first student

            return (
              <Link key={room.roomId} to={`/teacher/room/${room.roomId}`}>
                <Card className="p-5 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {room.roomNumber}
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        room.side.toLowerCase() === "girls"
                          ? "bg-pink-100 text-pink-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {room.side.toLowerCase() === "girls" ? "Girls" : "Boys"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {roomStudents.length}{" "}
                        {roomStudents.length === 1 ? "student" : "students"}
                      </span>
                    </div>

                    {/* ✅ Show only 1 student preview */}
                    {previewStudent && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-1">Students:</p>
                        <p className="text-xs text-gray-700 truncate">
                          • {previewStudent.name}
                        </p>

                        {/* ✅ Show +N more if there are additional students */}
                        {roomStudents.length > 1 && (
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            +{roomStudents.length - 1} more...
                          </p>
                        )}
                      </div>
                    )}

                    {roomStudents.length === 0 && (
                      <p className="text-xs text-gray-400 pt-2 border-t">
                        No students assigned
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <p className="text-xs text-green-600 font-medium">
                      View Details →
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/teacher/attendance">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <h3 className="font-semibold text-gray-900 mb-2">
              Take Attendance
            </h3>
            <p className="text-sm text-gray-600">
              Mark student attendance for today
            </p>
          </Card>
        </Link>

        <Link to="/teacher/tasks">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <h3 className="font-semibold text-gray-900 mb-2">
              View Weekly Tasks
            </h3>
            <p className="text-sm text-gray-600">
              Check room task schedules and rotation
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
