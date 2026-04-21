import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  ClipboardCheck,
  Bell,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { logout } from "../service/api";

const navigation = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "Weekly Tasks", href: "/student/tasks", icon: Calendar },
  { name: "My Services", href: "/student/services", icon: Briefcase },
  {
    name: "Attendance History",
    href: "/student/attendance",
    icon: ClipboardCheck,
  },
];

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const name = localStorage.getItem("name") || "Student";
  const email = localStorage.getItem("email") || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleLogout() {
    await logout();
    localStorage.clear();
    navigate("/");
  }

  function isActive(href: string) {
    if (href === "/student") return location.pathname === "/student";
    return location.pathname.startsWith(href);
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
          <UserCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">Student Portal</div>
          <div className="text-xs text-gray-500">My Dashboard</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-purple-50 text-purple-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => handleLogout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex lg:flex-col bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-50 w-64 bg-white border-r border-gray-200 flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden text-gray-600 hover:text-gray-900"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                {navigation.find((item) => isActive(item.href))?.name ||
                  "Student Portal"}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {name}
                  </div>
                  <div className="text-xs text-gray-500">{email}</div>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {initials}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
