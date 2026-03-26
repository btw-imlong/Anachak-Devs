import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, TrendingUp } from 'lucide-react';
import { students, getAttendanceByStudent } from '../../data/mockData';

export default function StudentAttendance() {
  const currentStudent = students[0]; // Emma Wilson
  const myAttendance = getAttendanceByStudent(currentStudent.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const presentCount = myAttendance.filter(a => a.status === 'present').length;
  const lateCount = myAttendance.filter(a => a.status === 'late').length;
  const absentCount = myAttendance.filter(a => a.status === 'absent').length;
  const attendanceRate = myAttendance.length > 0 
    ? Math.round((presentCount / myAttendance.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">My Attendance History</h2>
        <p className="text-sm text-gray-500">Track your attendance records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
              <p className="text-3xl font-bold text-gray-900">{attendanceRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Present</p>
              <p className="text-3xl font-bold text-green-600">{presentCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Late</p>
              <p className="text-3xl font-bold text-yellow-600">{lateCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Absent</p>
              <p className="text-3xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card className="overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">Recent Attendance Records</h3>
        </div>

        {myAttendance.length > 0 ? (
          <div className="divide-y">
            {myAttendance.map((record, index) => {
              const date = new Date(record.date);
              const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });

              return (
                <div 
                  key={record.id} 
                  className={`p-5 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    index === 0 ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{formattedDate}</p>
                      <p className="text-sm text-gray-500">
                        {index === 0 ? 'Most recent' : `${index + 1} days ago`}
                      </p>
                    </div>
                  </div>

                  <Badge 
                    className={
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                        : record.status === 'late'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No attendance records found</p>
          </div>
        )}
      </Card>

      {/* Performance Insights */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-3">Attendance Performance</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Overall Attendance</span>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{attendanceRate}%</span>
            </div>
          </div>
          
          {attendanceRate >= 90 && (
            <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                🎉 Excellent attendance! Keep up the great work!
              </p>
            </div>
          )}
          
          {attendanceRate >= 75 && attendanceRate < 90 && (
            <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Good attendance, but there's room for improvement.
              </p>
            </div>
          )}
          
          {attendanceRate < 75 && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ Your attendance needs attention. Please speak with your teacher.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
