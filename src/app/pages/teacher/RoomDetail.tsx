import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Users, ClipboardCheck } from "lucide-react";
import axiosInstance from "../../service/axios";
import type { RoomDetailResponse } from "../../service/room";

export default function TeacherRoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    fetchRoomDetail();
  }, [roomId]);

  async function fetchRoomDetail() {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/api/rooms/id/${roomId}`);
      setRoom(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading room details...</p>
      </div>
    );
  if (error || !room)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Room not found</p>
      </div>
    );

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
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Room {room.roomNumber}
              </h1>
              <Badge
                variant={
                  room.side.toLowerCase() === "girls" ? "secondary" : "default"
                }
              >
                {room.side} Side
              </Badge>
            </div>
            {room.teachers.length > 0 && (
              <p className="text-gray-600">
                Assigned Teacher: {room.teachers.map((t) => t.name).join(", ")}
              </p>
            )}
          </div>
          <Link to="/teacher/attendance" className="sm:flex-shrink-0">
            <Button className="w-full sm:w-auto">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Take Attendance
            </Button>
          </Link>
        </div>
      </Card>

      {/* Room Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {room.totalStudents}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Assigned Teachers</p>
              <p className="text-3xl font-bold text-gray-900">
                {room.teachers.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Present Today</p>
              <p className="text-3xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400 mt-1">
                Attendance coming soon
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Students</h2>

        {room.students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No students assigned to this room yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {room.students.map((student, index) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {student.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {student.idCardNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
