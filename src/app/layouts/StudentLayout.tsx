import { Outlet, Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Calendar, 
  Briefcase, 
  ClipboardCheck, 
  Settings, 
  Bell,
  UserCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { name: 'Weekly Tasks', href: '/student/tasks', icon: Calendar },
  { name: 'My Services', href: '/student/services', icon: Briefcase },
  { name: 'Attendance History', href: '/student/attendance', icon: ClipboardCheck },
  { name: 'Settings', href: '/student/settings', icon: Settings },
];

export default function StudentLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
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
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Back to Portal Selection */}
          <div className="p-4 border-t border-gray-200">
            <Link to="/">
              <Button variant="outline" className="w-full justify-start">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portals
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigation.find(item => item.href === location.pathname)?.name || 'Student Portal'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Emma Wilson</div>
                  <div className="text-xs text-gray-500">Room A1 • Library Duty</div>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">EW</span>
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
