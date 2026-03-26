import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Calendar, Save, HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { getRoomsByTeacher, getStudentsByRoom, rooms } from '../../data/mockData';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface StudentAttendance {
  studentId: string;
  status: AttendanceStatus;
}

export default function TeacherAttendance() {
  const currentTeacherId = 'teacher1';
  const [helpMode, setHelpMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);

  // Get available rooms based on help mode
  const myRooms = getRoomsByTeacher(currentTeacherId);
  const availableRooms = helpMode ? rooms : myRooms;

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);
  const students = selectedRoom ? getStudentsByRoom(selectedRoom) : [];

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const existing = prev.find(a => a.studentId === studentId);
      if (existing) {
        return prev.map(a => a.studentId === studentId ? { ...a, status } : a);
      }
      return [...prev, { studentId, status }];
    });
  };

  const getStudentStatus = (studentId: string): AttendanceStatus | null => {
    return attendance.find(a => a.studentId === studentId)?.status || null;
  };

  const handleSave = () => {
    alert(`Attendance saved for ${students.length} students on ${selectedDate}${helpMode ? ' (Substitute Teacher Mode)' : ''}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Help Mode Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Take Attendance</h2>
            <p className="text-sm text-gray-500">Mark student attendance for the selected date</p>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    <strong>Help Mode:</strong> Enable this when the assigned teacher is absent. 
                    It allows you to take attendance for rooms not assigned to you. 
                    The system will record that you acted as a substitute teacher.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="help-mode" className="text-sm font-medium cursor-pointer">
                Help Mode (Substitute)
              </Label>
              <Switch 
                id="help-mode" 
                checked={helpMode} 
                onCheckedChange={setHelpMode}
              />
            </div>
          </div>
        </div>

        {helpMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Substitute Teacher Mode Active</p>
              <p className="text-sm text-blue-700">
                You can now select and manage attendance for any room. Your name will be recorded as the substitute teacher.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <div className="relative">
              <Input 
                id="date"
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">
              Select Room
              {helpMode && <span className="ml-2 text-xs text-blue-600">(All rooms available)</span>}
            </Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    Room {room.number} - {room.side === 'girls' ? 'Girls' : 'Boys'} Side
                    {!myRooms.includes(room) && helpMode && (
                      <span className="ml-2 text-xs text-blue-600">(Other teacher's room)</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      {selectedRoom && students.length > 0 && (
        <>
          <Card className="overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Room {selectedRoomData?.number} - Attendance
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {students.length} students • {selectedDate}
                  </p>
                </div>
                <Badge variant={selectedRoomData?.side === 'girls' ? 'secondary' : 'default'}>
                  {selectedRoomData?.side === 'girls' ? 'Girls' : 'Boys'} Side
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {students.map((student, index) => {
                  const status = getStudentStatus(student.id);
                  return (
                    <div 
                      key={student.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
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

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              status === 'present'
                                ? 'bg-green-500 text-white shadow-md scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              status === 'late'
                                ? 'bg-yellow-500 text-white shadow-md scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              status === 'absent'
                                ? 'bg-red-500 text-white shadow-md scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Summary Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Attendance Summary</h3>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Present: {attendance.filter(a => a.status === 'present').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Late: {attendance.filter(a => a.status === 'late').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Absent: {attendance.filter(a => a.status === 'absent').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-700">
                      Not marked: {students.length - attendance.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={handleSave}
                disabled={attendance.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </Card>
        </>
      )}

      {selectedRoom && students.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No students found in this room</p>
        </Card>
      )}

      {!selectedRoom && (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a room to start taking attendance</p>
        </Card>
      )}
    </div>
  );
}
