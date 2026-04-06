import { createBrowserRouter } from "react-router";
import PortalSelection from "./pages/PortalSelection";
import AdminLayout from "./layouts/AdminLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUserManagement from "./pages/admin/UserManagement";
import AdminServiceManagement from "./pages/admin/ServiceManagement";
import AdminTaskManagement from "./pages/admin/TaskManagement";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherRoomDetail from "./pages/teacher/RoomDetail"; // ✅ only once
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherTasks from "./pages/teacher/Tasks";
import StudentDashboard from "./pages/student/Dashboard";
import StudentTasks from "./pages/student/Tasks";
import StudentServices from "./pages/student/Services";
import StudentAttendance from "./pages/student/Attendance";
import AttendanceToday from "./pages/teacher/AttendanceTodays";
import AllRoomsTasks from "./pages/teacher/TeacherTask";
import RoomManagement from "./pages/admin/RoomManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PortalSelection,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "users", Component: AdminUserManagement },
      { path: "services", Component: AdminServiceManagement },
      { path: "tasks", Component: AdminTaskManagement },
      { path: "rooms", Component: RoomManagement },
    ],
  },
  {
    path: "/teacher",
    Component: TeacherLayout,
    children: [
      { index: true, Component: TeacherDashboard },
      { path: "room/:roomId", Component: TeacherRoomDetail }, // ✅ roomId
      { path: "attendance", Component: TeacherAttendance },
      { path: "tasks", Component: TeacherTasks },
      { path: "attendance-today", Component: AttendanceToday },
      { path: "tasks/all", Component: AllRoomsTasks },
    ],
  },
  {
    path: "/student",
    Component: StudentLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "tasks", Component: StudentTasks },
      { path: "services", Component: StudentServices },
      { path: "attendance", Component: StudentAttendance },
    ],
  },
]);
