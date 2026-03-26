import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Home, User, Briefcase, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { students, getTeacherById, rooms, getTasksByRoom } from '../../data/mockData';

export default function StudentDashboard() {
  // Using student s1 (Emma Wilson) as the logged-in student
  const currentStudent = students[0]; // Emma Wilson
  const room = rooms.find(r => r.id === currentStudent.roomId);
  const teacher = room ? getTeacherById(room.teacherId) : null;
  const todayTasks = getTasksByRoom(currentStudent.roomId);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayTask = todayTasks.find(t => t.day === today);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card className="p-8 bg-gradient-to-br from-purple-500 to-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {currentStudent.name.split(' ')[0]}! 👋</h2>
        <p className="text-purple-100">Here's your accommodation overview</p>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Room</p>
              <p className="text-3xl font-bold text-gray-900">{currentStudent.roomId}</p>
              <p className="text-xs text-gray-500 mt-1">
                {room?.side === 'girls' ? 'Girls' : 'Boys'} Side
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Teacher</p>
              <p className="text-lg font-bold text-gray-900">{teacher?.name.split(' ')[1] || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-1">{teacher?.name || 'Not assigned'}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Service Role</p>
              <p className="text-lg font-bold text-gray-900">
                {currentStudent.serviceRole ? currentStudent.serviceRole : 'None'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentStudent.serviceRole ? 'Active duty' : 'No assignment'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Task */}
      <Card className="p-6 border-2 border-blue-200 bg-blue-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">Today's Task - {today}</h3>
              <Badge className="bg-blue-600 hover:bg-blue-600">Current</Badge>
            </div>
            <p className="text-lg text-gray-900 mb-1">
              {todayTask?.task || 'No task assigned for today'}
            </p>
            <p className="text-sm text-gray-600">
              Room {currentStudent.roomId} • Rotation Month {todayTask?.rotationMonth || 1}/3
            </p>
          </div>
        </div>
      </Card>

      {/* Room Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Room Number</p>
            <p className="text-2xl font-bold text-gray-900">{currentStudent.roomId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Section</p>
            <Badge variant={room?.side === 'girls' ? 'secondary' : 'default'} className="text-base px-3 py-1">
              {room?.side === 'girls' ? 'Girls' : 'Boys'} Side
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Assigned Teacher</p>
            <p className="font-medium text-gray-900">{teacher?.name || 'Not assigned'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Teacher Email</p>
            <p className="font-medium text-gray-900">{teacher?.email || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/student/tasks">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Weekly Tasks</h3>
            </div>
            <p className="text-sm text-gray-600">View your complete weekly task schedule</p>
          </Card>
        </Link>

        <Link to="/student/services">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">My Services</h3>
            </div>
            <p className="text-sm text-gray-600">Check your assigned service duties</p>
          </Card>
        </Link>

        <Link to="/student/attendance">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Attendance History</h3>
            </div>
            <p className="text-sm text-gray-600">Review your attendance records</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
