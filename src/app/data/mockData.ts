// Mock data for the Student Accommodation Management System

export interface Student {
  id: string;
  name: string;
  roomId: string;
  serviceRole?: string;
  side: 'girls' | 'boys';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  assignedRooms: string[];
}

export interface Room {
  id: string;
  number: string;
  side: 'girls' | 'boys';
  teacherId: string;
  studentIds: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  assignedStudents: string[];
}

export interface Task {
  id: string;
  roomId: string;
  day: string;
  task: string;
  rotationMonth: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  recordedBy: string;
}

// Generate 48 rooms (A1-D12)
export const rooms: Room[] = [];
const sections = ['A', 'B', 'C', 'D'];
for (let section of sections) {
  for (let i = 1; i <= 12; i++) {
    const roomNumber = `${section}${i}`;
    const side = section === 'A' || section === 'B' ? 'girls' : 'boys';
    rooms.push({
      id: roomNumber,
      number: roomNumber,
      side,
      teacherId: `teacher${Math.floor(Math.random() * 10) + 1}`,
      studentIds: [],
    });
  }
}

// Generate teachers
export const teachers: Teacher[] = [
  { id: 'teacher1', name: 'Ms. Sarah Johnson', email: 'sarah.j@school.edu', assignedRooms: ['A1', 'A2', 'A3', 'A4'] },
  { id: 'teacher2', name: 'Ms. Emily Davis', email: 'emily.d@school.edu', assignedRooms: ['A5', 'A6', 'A7', 'A8'] },
  { id: 'teacher3', name: 'Ms. Maria Garcia', email: 'maria.g@school.edu', assignedRooms: ['A9', 'A10', 'A11', 'A12'] },
  { id: 'teacher4', name: 'Ms. Lisa Anderson', email: 'lisa.a@school.edu', assignedRooms: ['B1', 'B2', 'B3', 'B4'] },
  { id: 'teacher5', name: 'Ms. Jennifer Wilson', email: 'jennifer.w@school.edu', assignedRooms: ['B5', 'B6', 'B7', 'B8'] },
  { id: 'teacher6', name: 'Mr. James Smith', email: 'james.s@school.edu', assignedRooms: ['C1', 'C2', 'C3', 'C4'] },
  { id: 'teacher7', name: 'Mr. Michael Brown', email: 'michael.b@school.edu', assignedRooms: ['C5', 'C6', 'C7', 'C8'] },
  { id: 'teacher8', name: 'Mr. David Martinez', email: 'david.m@school.edu', assignedRooms: ['C9', 'C10', 'C11', 'C12'] },
  { id: 'teacher9', name: 'Mr. Robert Taylor', email: 'robert.t@school.edu', assignedRooms: ['D1', 'D2', 'D3', 'D4'] },
  { id: 'teacher10', name: 'Mr. John Thompson', email: 'john.t@school.edu', assignedRooms: ['D5', 'D6', 'D7', 'D8'] },
];

// Update rooms with correct teacher assignments
rooms.forEach(room => {
  const teacher = teachers.find(t => t.assignedRooms.includes(room.id));
  if (teacher) {
    room.teacherId = teacher.id;
  }
});

// Generate students
export const students: Student[] = [
  // Girls' side (A & B sections)
  { id: 's1', name: 'Emma Wilson', roomId: 'A1', serviceRole: 'Library Duty', side: 'girls' },
  { id: 's2', name: 'Olivia Brown', roomId: 'A1', serviceRole: 'Cleaning Leader', side: 'girls' },
  { id: 's3', name: 'Ava Jones', roomId: 'A2', serviceRole: 'Garden Work', side: 'girls' },
  { id: 's4', name: 'Sophia Garcia', roomId: 'A2', side: 'girls' },
  { id: 's5', name: 'Isabella Martinez', roomId: 'A3', serviceRole: 'Hall Monitor', side: 'girls' },
  { id: 's6', name: 'Mia Rodriguez', roomId: 'A3', serviceRole: 'Library Duty', side: 'girls' },
  { id: 's7', name: 'Charlotte Lee', roomId: 'A4', side: 'girls' },
  { id: 's8', name: 'Amelia Walker', roomId: 'A4', serviceRole: 'Cleaning Leader', side: 'girls' },
  { id: 's9', name: 'Harper Hall', roomId: 'A5', serviceRole: 'Garden Work', side: 'girls' },
  { id: 's10', name: 'Evelyn Allen', roomId: 'A5', side: 'girls' },
  { id: 's11', name: 'Abigail Young', roomId: 'B1', serviceRole: 'Hall Monitor', side: 'girls' },
  { id: 's12', name: 'Emily King', roomId: 'B1', side: 'girls' },
  { id: 's13', name: 'Elizabeth Wright', roomId: 'B2', serviceRole: 'Library Duty', side: 'girls' },
  { id: 's14', name: 'Sofia Lopez', roomId: 'B2', serviceRole: 'Cleaning Leader', side: 'girls' },
  { id: 's15', name: 'Avery Hill', roomId: 'B3', side: 'girls' },
  { id: 's16', name: 'Ella Scott', roomId: 'B3', serviceRole: 'Garden Work', side: 'girls' },
  { id: 's17', name: 'Scarlett Green', roomId: 'B4', serviceRole: 'Hall Monitor', side: 'girls' },
  { id: 's18', name: 'Grace Adams', roomId: 'B4', side: 'girls' },
  { id: 's19', name: 'Chloe Baker', roomId: 'B5', serviceRole: 'Library Duty', side: 'girls' },
  { id: 's20', name: 'Victoria Nelson', roomId: 'B5', side: 'girls' },
  
  // Boys' side (C & D sections)
  { id: 's21', name: 'Liam Smith', roomId: 'C1', serviceRole: 'Library Duty', side: 'boys' },
  { id: 's22', name: 'Noah Johnson', roomId: 'C1', serviceRole: 'Cleaning Leader', side: 'boys' },
  { id: 's23', name: 'Oliver Williams', roomId: 'C2', serviceRole: 'Garden Work', side: 'boys' },
  { id: 's24', name: 'Elijah Brown', roomId: 'C2', side: 'boys' },
  { id: 's25', name: 'William Jones', roomId: 'C3', serviceRole: 'Hall Monitor', side: 'boys' },
  { id: 's26', name: 'James Garcia', roomId: 'C3', serviceRole: 'Library Duty', side: 'boys' },
  { id: 's27', name: 'Benjamin Miller', roomId: 'C4', side: 'boys' },
  { id: 's28', name: 'Lucas Davis', roomId: 'C4', serviceRole: 'Cleaning Leader', side: 'boys' },
  { id: 's29', name: 'Henry Rodriguez', roomId: 'C5', serviceRole: 'Garden Work', side: 'boys' },
  { id: 's30', name: 'Alexander Martinez', roomId: 'C5', side: 'boys' },
  { id: 's31', name: 'Mason Hernandez', roomId: 'D1', serviceRole: 'Hall Monitor', side: 'boys' },
  { id: 's32', name: 'Michael Lopez', roomId: 'D1', side: 'boys' },
  { id: 's33', name: 'Ethan Gonzalez', roomId: 'D2', serviceRole: 'Library Duty', side: 'boys' },
  { id: 's34', name: 'Daniel Wilson', roomId: 'D2', serviceRole: 'Cleaning Leader', side: 'boys' },
  { id: 's35', name: 'Jacob Anderson', roomId: 'D3', side: 'boys' },
  { id: 's36', name: 'Logan Thomas', roomId: 'D3', serviceRole: 'Garden Work', side: 'boys' },
  { id: 's37', name: 'Jackson Taylor', roomId: 'D4', serviceRole: 'Hall Monitor', side: 'boys' },
  { id: 's38', name: 'Sebastian Moore', roomId: 'D4', side: 'boys' },
  { id: 's39', name: 'Jack Martin', roomId: 'D5', serviceRole: 'Library Duty', side: 'boys' },
  { id: 's40', name: 'Aiden Lee', roomId: 'D5', side: 'boys' },
];

// Update rooms with student assignments
students.forEach(student => {
  const room = rooms.find(r => r.id === student.roomId);
  if (room && !room.studentIds.includes(student.id)) {
    room.studentIds.push(student.id);
  }
});

// Services
export const services: Service[] = [
  { 
    id: 'service1', 
    name: 'Library Duty', 
    description: 'Manage library operations, organize books, assist students',
    assignedStudents: students.filter(s => s.serviceRole === 'Library Duty').map(s => s.id)
  },
  { 
    id: 'service2', 
    name: 'Cleaning Leader', 
    description: 'Supervise daily cleaning routines and maintain cleanliness standards',
    assignedStudents: students.filter(s => s.serviceRole === 'Cleaning Leader').map(s => s.id)
  },
  { 
    id: 'service3', 
    name: 'Garden Work', 
    description: 'Maintain garden area, water plants, and general landscaping',
    assignedStudents: students.filter(s => s.serviceRole === 'Garden Work').map(s => s.id)
  },
  { 
    id: 'service4', 
    name: 'Hall Monitor', 
    description: 'Monitor corridors, ensure discipline, and report issues',
    assignedStudents: students.filter(s => s.serviceRole === 'Hall Monitor').map(s => s.id)
  },
];

// Weekly tasks
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const taskTypes = [
  'Room Cleaning',
  'Corridor Duty',
  'Garden Maintenance',
  'Dining Hall Service',
  'Library Organization',
  'Common Area Cleaning',
  'Laundry Room Duty',
];

export const tasks: Task[] = [];
rooms.forEach(room => {
  days.forEach((day, index) => {
    tasks.push({
      id: `task-${room.id}-${day}`,
      roomId: room.id,
      day,
      task: taskTypes[index % taskTypes.length],
      rotationMonth: 1,
    });
  });
});

// Attendance records
export const attendanceRecords: AttendanceRecord[] = [];
students.forEach(student => {
  // Generate records for the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const statuses: ('present' | 'absent' | 'late')[] = ['present', 'present', 'present', 'present', 'late', 'absent'];
    attendanceRecords.push({
      id: `att-${student.id}-${i}`,
      studentId: student.id,
      date: date.toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      recordedBy: 'teacher1',
    });
  }
});

// Helper functions
export const getTeacherById = (id: string) => teachers.find(t => t.id === id);
export const getStudentById = (id: string) => students.find(s => s.id === id);
export const getRoomById = (id: string) => rooms.find(r => r.id === id);
export const getServiceById = (id: string) => services.find(s => s.id === id);
export const getStudentsByRoom = (roomId: string) => students.filter(s => s.roomId === roomId);
export const getRoomsByTeacher = (teacherId: string) => {
  const teacher = teachers.find(t => t.id === teacherId);
  return teacher ? rooms.filter(r => teacher.assignedRooms.includes(r.id)) : [];
};
export const getTasksByRoom = (roomId: string) => tasks.filter(t => t.roomId === roomId);
export const getAttendanceByStudent = (studentId: string) => attendanceRecords.filter(a => a.studentId === studentId);
