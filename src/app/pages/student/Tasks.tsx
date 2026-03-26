import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar } from 'lucide-react';
import { students, getTasksByRoom } from '../../data/mockData';

export default function StudentTasks() {
  const currentStudent = students[0]; // Emma Wilson
  const myTasks = getTasksByRoom(currentStudent.roomId);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">My Weekly Tasks</h2>
        <p className="text-sm text-gray-500">Your assigned tasks for Room {currentStudent.roomId}</p>
      </div>

      {/* Rotation Info */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Current Rotation: Month 1 of 3</p>
              <p className="text-sm text-gray-600">Tasks rotate every 3 months (Jan - Mar 2026)</p>
            </div>
          </div>
          <Badge className="bg-purple-600 hover:bg-purple-600">
            Active
          </Badge>
        </div>
      </Card>

      {/* Weekly Task Cards */}
      <div className="grid gap-4">
        {days.map(day => {
          const task = myTasks.find(t => t.day === day);
          const isToday = day === today;
          
          return (
            <Card 
              key={day} 
              className={`p-6 transition-all ${
                isToday 
                  ? 'border-2 border-purple-500 bg-purple-50 shadow-md' 
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isToday 
                      ? 'bg-purple-500' 
                      : 'bg-gray-100'
                  }`}>
                    <Calendar className={`w-6 h-6 ${
                      isToday ? 'text-white' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{day}</h3>
                      {isToday && (
                        <Badge className="bg-purple-600 hover:bg-purple-600">Today</Badge>
                      )}
                    </div>
                    <p className="text-lg text-gray-900">{task?.task || 'No task assigned'}</p>
                  </div>
                </div>
                
                {task && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    Month {task.rotationMonth}/3
                  </Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">About Task Rotation</h3>
        <p className="text-sm text-gray-600">
          Your room's tasks are part of a 3-month rotation schedule. Every 3 months, tasks will rotate 
          to ensure fair distribution of responsibilities across all rooms. Make sure to check your 
          daily assignments and complete them on time.
        </p>
      </Card>
    </div>
  );
}
