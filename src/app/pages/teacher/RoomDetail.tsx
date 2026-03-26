import { useParams, Link } from 'react-router';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Users, ClipboardCheck } from 'lucide-react';
import { getRoomById, getStudentsByRoom, getTeacherById, attendanceRecords } from '../../data/mockData';

export default function TeacherRoomDetail() {
  const { roomId } = useParams();
  const room = getRoomById(roomId || '');
  const students = getStudentsByRoom(roomId || '');
  const teacher = getTeacherById(room?.teacherId || '');

  const todayDate = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(r => 
    r.date === todayDate && students.some(s => s.id === r.studentId)
  );

  if (!room) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Room not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/teacher">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Room Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Room {room.number}</h1>
              <Badge variant={room.side === 'girls' ? 'secondary' : 'default'}>
                {room.side === 'girls' ? 'Girls' : 'Boys'} Side
              </Badge>
            </div>
            <p className="text-gray-600">Assigned Teacher: {teacher?.name}</p>
          </div>
          <Link to="/teacher/attendance">
            <Button>
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Take Attendance
            </Button>
          </Link>
        </div>
      </Card>

      {/* Room Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{students.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">With Service Roles</p>
              <p className="text-3xl font-bold text-gray-900">
                {students.filter(s => s.serviceRole).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Present Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {todayAttendance.filter(a => a.status === 'present').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Students</h2>
        
        {students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No students assigned to this room yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map(student => {
              const attendance = todayAttendance.find(a => a.studentId === student.id);
              return (
                <div 
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      {student.serviceRole && (
                        <p className="text-sm text-gray-600">{student.serviceRole}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {student.serviceRole && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {student.serviceRole}
                      </Badge>
                    )}
                    {attendance && (
                      <Badge 
                        variant={
                          attendance.status === 'present' ? 'default' :
                          attendance.status === 'late' ? 'secondary' :
                          'destructive'
                        }
                        className={
                          attendance.status === 'present' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                          attendance.status === 'late' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                          'bg-red-100 text-red-700 hover:bg-red-100'
                        }
                      >
                        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
