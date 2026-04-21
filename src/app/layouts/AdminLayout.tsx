import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Home,
  Bell,
  Shield,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { logout } from "../service/api";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Room Management", href: "/admin/rooms", icon: Home }, // ✅ added
  { name: "Service Management", href: "/admin/services", icon: Briefcase },
  { name: "Task Management", href: "/admin/tasks", icon: Calendar },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ read from localStorage
  const adminName = localStorage.getItem("name") || "Admin";
  const adminEmail = localStorage.getItem("email") || "admin@school.edu";
  const adminInitials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ✅ logout
  async function handleLogout() {
    await logout(); // ← clears the cookie on the backend
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/");
  }
  // ✅ active check — also highlight parent for nested routes
  function isActive(href: string): boolean {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  }

  // ✅ get current page name including nested routes
  const currentPage =
    navigation.find((item) =>
      item.href === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(item.href),
    )?.name || "Admin Portal";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Admin Portal</div>
              <div className="text-xs text-gray-500">Full Control</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-gray-200 space-y-2">
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
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">{currentPage}</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {adminName} {/* ✅ real name */}
                  </div>
                  <div className="text-xs text-gray-500">{adminEmail}</div>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {adminInitials} {/* ✅ real initials */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
