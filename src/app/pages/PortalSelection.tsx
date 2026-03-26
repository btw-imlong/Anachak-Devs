import { Link } from 'react-router';
import { Shield, GraduationCap, UserCircle } from 'lucide-react';
import { Card } from '../components/ui/card';

export default function PortalSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Student Accommodation Management System
          </h1>
          <p className="text-lg text-gray-600">
            Dormitory Management • 48 Rooms • Girls & Boys Divisions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Admin Portal */}
          <Link to="/admin">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                  <Shield className="w-10 h-10 text-blue-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Admin Portal
                </h2>
                <p className="text-gray-600 mb-6">
                  Full control over rooms, users, services, and task management
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  Enter Portal →
                </div>
              </div>
            </Card>
          </Link>

          {/* Teacher Portal */}
          <Link to="/teacher">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                  <GraduationCap className="w-10 h-10 text-green-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Teacher Portal
                </h2>
                <p className="text-gray-600 mb-6">
                  Manage assigned rooms, track attendance, and view tasks
                </p>
                <div className="text-sm text-green-600 font-medium">
                  Enter Portal →
                </div>
              </div>
            </Card>
          </Link>

          {/* Student Portal */}
          <Link to="/student">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                  <UserCircle className="w-10 h-10 text-purple-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Student Portal
                </h2>
                <p className="text-gray-600 mb-6">
                  View your room, tasks, services, and attendance history
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  Enter Portal →
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
