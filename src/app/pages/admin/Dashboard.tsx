import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Users, Home, GraduationCap, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { BASE_URL } from "../../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomSummary {
  id: number;
  roomNumber: string;
  side: string;
  totalStudents: number;
  teachers: { teacherId: number; name: string }[];
}

interface DashboardStats {
  totalRooms: number;
  girlsRooms: number;
  boysRooms: number;
  totalStudents: number;
  girlsStudents: number;
  boysStudents: number;
  totalTeachers: number;
  presentCount: number;
  totalAttendance: number;
  attendanceRate: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    girlsRooms: 0,
    boysRooms: 0,
    totalStudents: 0,
    girlsStudents: 0,
    boysStudents: 0,
    totalTeachers: 0,
    presentCount: 0,
    totalAttendance: 0,
    attendanceRate: 0,
  });
  const [girlsRooms, setGirlsRooms] = useState<RoomSummary[]>([]);
  const [boysRooms, setBoysRooms] = useState<RoomSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      // fetch all in parallel
      const [roomsRes, studentsRes, teachersRes, attendanceRes] =
        await Promise.all([
          fetch(`${BASE_URL}/api/rooms`, { headers: authHeader }),
          fetch(`${BASE_URL}/api/users/students?page=0&size=1000`, {
            headers: authHeader,
          }),
          fetch(`${BASE_URL}/api/users/teachers?page=0&size=1000`, {
            headers: authHeader,
          }),
          fetch(`${BASE_URL}/api/attendance/today`, { headers: authHeader }),
        ]);

      // ── Rooms ──────────────────────────────────────────────────────────────
      const roomsData = roomsRes.ok ? await roomsRes.json() : [];
      const allRooms: RoomSummary[] = roomsData.map((r: any) => ({
        id: r.id,
        roomNumber: r.roomNumber,
        side: r.side,
        totalStudents: r.students?.length ?? 0,
        teachers: r.teachers ?? [],
      }));

      const girls = allRooms.filter((r) => r.side.toLowerCase() === "girls");
      const boys = allRooms.filter((r) => r.side.toLowerCase() === "boys");
      setGirlsRooms(girls);
      setBoysRooms(boys);

      // ── Students ───────────────────────────────────────────────────────────
      const studentsData = studentsRes.ok
        ? await studentsRes.json()
        : { content: [] };
      const allStudents = studentsData.content ?? [];
      const girlsStudents = allStudents.filter(
        (s: any) => s.room?.side?.toLowerCase() === "girls",
      ).length;
      const boysStudents = allStudents.filter(
        (s: any) => s.room?.side?.toLowerCase() === "boys",
      ).length;

      // ── Teachers ───────────────────────────────────────────────────────────
      const teachersData = teachersRes.ok
        ? await teachersRes.json()
        : { content: [] };
      const totalTeachers = teachersData.content?.length ?? 0;

      // ── Attendance ─────────────────────────────────────────────────────────
      const attendanceData = attendanceRes.ok ? await attendanceRes.json() : [];
      const presentCount = attendanceData.filter(
        (r: any) => r.status === "PRESENT",
      ).length;
      const totalAttendance = attendanceData.length;
      const attendanceRate =
        totalAttendance > 0
          ? Math.round((presentCount / totalAttendance) * 100)
          : 0;

      setStats({
        totalRooms: allRooms.length,
        girlsRooms: girls.length,
        boysRooms: boys.length,
        totalStudents: allStudents.length,
        girlsStudents,
        boysStudents,
        totalTeachers,
        presentCount,
        totalAttendance,
        attendanceRate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
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
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalRooms}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.girlsRooms} Girls • {stats.boysRooms} Boys
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalStudents}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.girlsStudents} Girls • {stats.boysStudents} Boys
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalTeachers}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supervising all rooms
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendance Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalAttendance > 0 ? `${stats.attendanceRate}%` : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalAttendance > 0
                  ? `${stats.presentCount} present`
                  : "No attendance taken"}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            All Rooms Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Girls Side */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-pink-600">
                Girls' Side
              </h3>
              <p className="text-sm text-gray-500">{girlsRooms.length} rooms</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {girlsRooms.map((room) => (
                <Card
                  key={room.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      {room.roomNumber}
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                      {room.totalStudents}{" "}
                      {room.totalStudents === 1 ? "student" : "students"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {room.teachers.length > 0
                      ? room.teachers.map((t) => t.name).join(", ")
                      : "No teacher assigned"}
                  </p>
                </Card>
              ))}

              {girlsRooms.length === 0 && (
                <p className="text-sm text-gray-400 col-span-2">
                  No girls rooms found
                </p>
              )}
            </div>
          </div>

          {/* Boys Side */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600">
                Boys' Side
              </h3>
              <p className="text-sm text-gray-500">{boysRooms.length} rooms</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {boysRooms.map((room) => (
                <Card
                  key={room.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      {room.roomNumber}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {room.totalStudents}{" "}
                      {room.totalStudents === 1 ? "student" : "students"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {room.teachers.length > 0
                      ? room.teachers.map((t) => t.name).join(", ")
                      : "No teacher assigned"}
                  </p>
                </Card>
              ))}

              {boysRooms.length === 0 && (
                <p className="text-sm text-gray-400 col-span-2">
                  No boys rooms found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">
              User Management
            </h3>
            <p className="text-sm text-gray-600">
              Create and manage teacher & student accounts
            </p>
          </Card>
        </Link>

        <Link to="/admin/services">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">
              Service Management
            </h3>
            <p className="text-sm text-gray-600">
              Assign and manage student service duties
            </p>
          </Card>
        </Link>

        <Link to="/admin/tasks">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">
              Task Management
            </h3>
            <p className="text-sm text-gray-600">
              Manage weekly tasks and rotation schedules
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
