// ─── Room ─────────────────────────────────────────────────────────────────────

export interface RoomInfo {
  roomId: number;
  roomNumber: string;
  side: string; // "girls" | "boys"
}

// ─── Teacher ──────────────────────────────────────────────────────────────────

export interface TeacherResponse {
  id: number;
  name: string;
  email: string;
  idCardNumber: string;
  rooms: RoomInfo[];
}

// ─── Student ──────────────────────────────────────────────────────────────────

export interface StudentRoomInfo {
  roomId: number;
  roomNumber: string;
  side: string;
}

export interface StudentResponse {
  id: number;
  name: string;
  email: string;
  idCardNumber: string;
  room: StudentRoomInfo | null;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page
  size: number;
}
