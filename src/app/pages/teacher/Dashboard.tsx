import { Card } from '../../components/ui/card';
import { Home, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import { getRoomsByTeacher, getStudentsByRoom, attendanceRecords, teachers } from '../../data/mockData';

export default function TeacherDashboard() {
  // Using teacher1 (Ms. Sarah Johnson) as the logged-in teacher
  const currentTeacherId = 'teacher1';
  const myRooms = getRoomsByTeacher(currentTeacherId);
  const currentTeacher = teachers.find(t => t.id === currentTeacherId);
  
  const allMyStudents = myRooms.flatMap(room => getStudentsByRoom(room.id));
  
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(r => 
    r.date === todayDate && 
    allMyStudents.some(s => s.id === r.studentId)
  );
  const presentCount = todayAttendance.filter(r => r.status === 'present').length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Rooms</p>
              <p className="text-3xl font-bold text-gray-900">{myRooms.length}</p>
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
              <p className="text-3xl font-bold text-gray-900">{allMyStudents.length}</p>
              <p className="text-xs text-gray-500 mt-1">Under your supervision</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendance Today</p>
              <p className="text-3xl font-bold text-gray-900">{presentCount}</p>
              <p className="text-xs text-gray-500 mt-1">Out of {todayAttendance.length} students</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* My Rooms Grid */}
      <div id="rooms">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Assigned Rooms</h2>
            <p className="text-sm text-gray-500">Rooms under your supervision</p>
          </div>
          <Link to="/teacher/attendance">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Take Attendance
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {myRooms.map((room) => {
            const roomStudents = getStudentsByRoom(room.id);
            return (
              <Link key={room.id} to={`/teacher/room/${room.id}`}>
                <Card className="p-5 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-gray-900">{room.number}</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      room.side === 'girls' 
                        ? 'bg-pink-100 text-pink-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {room.side === 'girls' ? 'Girls' : 'Boys'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{roomStudents.length} {roomStudents.length === 1 ? 'student' : 'students'}</span>
                    </div>
                    
                    {roomStudents.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-1">Students:</p>
                        <div className="space-y-1">
                          {roomStudents.map(student => (
                            <p key={student.id} className="text-xs text-gray-700 truncate">
                              • {student.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <p className="text-xs text-green-600 font-medium">View Details →</p>
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
            <h3 className="font-semibold text-gray-900 mb-2">Take Attendance</h3>
            <p className="text-sm text-gray-600">Mark student attendance for today</p>
          </Card>
        </Link>

        <Link to="/teacher/tasks">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <h3 className="font-semibold text-gray-900 mb-2">View Weekly Tasks</h3>
            <p className="text-sm text-gray-600">Check room task schedules and rotation</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
