import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { CalendarDays } from 'lucide-react';
import { getRoomsByTeacher, getTasksByRoom } from '../../data/mockData';

export default function TeacherTasks() {
  const currentTeacherId = 'teacher1';
  const myRooms = getRoomsByTeacher(currentTeacherId);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Weekly Task Schedule</h2>
        <p className="text-sm text-gray-500">View weekly tasks for your assigned rooms</p>
      </div>

      {/* Rotation Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Current Rotation: Month 1 of 3</p>
              <p className="text-sm text-gray-600">Tasks rotate every 3 months</p>
            </div>
          </div>
          <Badge className="bg-blue-600 hover:bg-blue-600">
            Jan - Mar 2026
          </Badge>
        </div>
      </Card>

      {/* Tasks for Each Room */}
      {myRooms.map(room => {
        const roomTasks = getTasksByRoom(room.id);
        
        return (
          <Card key={room.id} className="overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Room {room.number}</h3>
                  <p className="text-sm text-gray-500">Weekly task schedule</p>
                </div>
                <Badge variant={room.side === 'girls' ? 'secondary' : 'default'}>
                  {room.side === 'girls' ? 'Girls' : 'Boys'} Side
                </Badge>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Rotation Month</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map(day => {
                  const task = roomTasks.find(t => t.day === day);
                  return (
                    <TableRow key={day}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{day}</Badge>
                      </TableCell>
                      <TableCell>{task?.task || 'No task assigned'}</TableCell>
                      <TableCell>
                        {task && (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            Month {task.rotationMonth}/3
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        );
      })}
    </div>
  );
}
