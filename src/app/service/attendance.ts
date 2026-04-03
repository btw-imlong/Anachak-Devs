export interface AttendanceSummaryResponse {
  present: number;
  absent: number;
  late: number;
  total: number;
}
export interface AttendanceSummaryResponse {
  present: number;
  absent: number;
  late: number;
  total: number;
}

export interface AttendanceRecordResponse {
  recordId: number;
  studentId: number;
  studentName: string;
  status: string;
  teacherName?: string;
}
