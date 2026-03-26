import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { UserPlus, Plus, Edit, Trash2 } from 'lucide-react';
import { teachers, students, rooms, services } from '../../data/mockData';

export default function UserManagement() {
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="teachers" className="w-full">
        <TabsList>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Teacher Accounts</h2>
              <p className="text-sm text-gray-500">Manage teacher accounts and room assignments</p>
            </div>
            <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Teacher Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Teacher Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-name">Full Name</Label>
                    <Input id="teacher-name" placeholder="Enter teacher name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email Address</Label>
                    <Input id="teacher-email" type="email" placeholder="teacher@school.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <Input id="teacher-password" type="password" placeholder="Enter password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-rooms">Assign Rooms (select multiple)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rooms to assign" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            Room {room.number} ({room.side})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" onClick={() => setTeacherDialogOpen(false)}>
                      Create Account
                    </Button>
                    <Button variant="outline" onClick={() => setTeacherDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Rooms</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map(teacher => {
                  const teacherStudents = students.filter(s => 
                    teacher.assignedRooms.includes(s.roomId)
                  );
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell className="text-gray-600">{teacher.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.assignedRooms.map(roomId => (
                            <Badge key={roomId} variant="secondary" className="text-xs">
                              {roomId}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{teacherStudents.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Student Accounts</h2>
              <p className="text-sm text-gray-500">Manage student accounts and service assignments</p>
            </div>
            <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Student Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Student Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Full Name</Label>
                    <Input id="student-name" placeholder="Enter student name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-room">Assign Room</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            Room {room.number} ({room.side})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-service">Service Role (Optional)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service role" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" onClick={() => setStudentDialogOpen(false)}>
                      Create Account
                    </Button>
                    <Button variant="outline" onClick={() => setStudentDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Service Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.roomId}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.side === 'girls' ? 'secondary' : 'default'}>
                        {student.side === 'girls' ? 'Girls' : 'Boys'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.serviceRole ? (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          {student.serviceRole}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
