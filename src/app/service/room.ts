export interface RoomDetailResponse {
  id: number;
  roomNumber: string;
  side: string;
  totalStudents: number;
  students: StudentInfo[];
  teachers: TeacherInfo[];
}

export interface StudentInfo {
  studentId: number;
  name: string;
  idCardNumber: string;
}

export interface TeacherInfo {
  teacherId: number;
  name: string;
  idCardNumber: string;
}
