import { Card } from '../../components/ui/card';
import { Users, Home, GraduationCap, CheckCircle } from 'lucide-react';
import { rooms, students, teachers, attendanceRecords } from '../../data/mockData';
import { Link } from 'react-router';

export default function AdminDashboard() {
  const girlsRooms = rooms.filter(r => r.side === 'girls');
  const boysRooms = rooms.filter(r => r.side === 'boys');
  
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(r => r.date === todayDate);
  const presentCount = todayAttendance.filter(r => r.status === 'present').length;
  const attendanceRate = todayAttendance.length > 0 
    ? Math.round((presentCount / todayAttendance.length) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900">48</p>
              <p className="text-xs text-gray-500 mt-1">24 Girls • 24 Boys</p>
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
              <p className="text-3xl font-bold text-gray-900">{students.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {students.filter(s => s.side === 'girls').length} Girls • {students.filter(s => s.side === 'boys').length} Boys
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
              <p className="text-3xl font-bold text-gray-900">{teachers.length}</p>
              <p className="text-xs text-gray-500 mt-1">Supervising all rooms</p>
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
              <p className="text-3xl font-bold text-gray-900">{attendanceRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{presentCount} present</p>
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
          <h2 className="text-xl font-semibold text-gray-900">All Rooms Overview</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Girls' Side */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-pink-600">Girls' Side (A & B Sections)</h3>
              <p className="text-sm text-gray-500">{girlsRooms.length} rooms</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {girlsRooms.map((room) => {
                const teacher = teachers.find(t => t.id === room.teacherId);
                const studentCount = room.studentIds.length;
                return (
                  <Card key={room.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900">{room.number}</span>
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                        {studentCount} {studentCount === 1 ? 'student' : 'students'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {teacher?.name || 'No teacher assigned'}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Boys' Side */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600">Boys' Side (C & D Sections)</h3>
              <p className="text-sm text-gray-500">{boysRooms.length} rooms</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {boysRooms.map((room) => {
                const teacher = teachers.find(t => t.id === room.teacherId);
                const studentCount = room.studentIds.length;
                return (
                  <Card key={room.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900">{room.number}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {studentCount} {studentCount === 1 ? 'student' : 'students'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {teacher?.name || 'No teacher assigned'}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-sm text-gray-600">Create and manage teacher & student accounts</p>
          </Card>
        </Link>

        <Link to="/admin/services">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">Service Management</h3>
            <p className="text-sm text-gray-600">Assign and manage student service duties</p>
          </Card>
        </Link>

        <Link to="/admin/tasks">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">Task Management</h3>
            <p className="text-sm text-gray-600">Manage weekly tasks and rotation schedules</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
