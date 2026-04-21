import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card } from "../../components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import axiosInstance from "../../service/axios";
import type { AttendanceRecordResponse } from "../../service/attendance";

export default function AttendanceToday() {
  const [records, setRecords] = useState<AttendanceRecordResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PRESENT" | "LATE" | "ABSENT">(
    "ALL",
  );

  useEffect(() => {
    fetchTodayRecords();
  }, []);

  async function fetchTodayRecords() {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/attendance/today");
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    filter === "ALL" ? records : records.filter((r) => r.status === filter);
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;

  const statusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-700";
      case "LATE":
        return "bg-yellow-100 text-yellow-700";
      case "ABSENT":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const avatarColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-500";
      case "LATE":
        return "bg-yellow-500";
      case "ABSENT":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading today's attendance...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading today's attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/teacher"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Today's Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-400"
          onClick={() => setFilter(filter === "PRESENT" ? "ALL" : "PRESENT")}
        >
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          <p className="text-xs text-gray-500 mt-1">Present</p>
          {filter === "PRESENT" && (
            <span className="text-xs text-green-600 font-medium">
              ● Filtering
            </span>
          )}
        </Card>

        <Card
          className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-yellow-400"
          onClick={() => setFilter(filter === "LATE" ? "ALL" : "LATE")}
        >
          <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
          <p className="text-xs text-gray-500 mt-1">Late</p>
          {filter === "LATE" && (
            <span className="text-xs text-yellow-600 font-medium">
              ● Filtering
            </span>
          )}
        </Card>

        <Card
          className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-red-400"
          onClick={() => setFilter(filter === "ABSENT" ? "ALL" : "ABSENT")}
        >
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          <p className="text-xs text-gray-500 mt-1">Absent</p>
          {filter === "ABSENT" && (
            <span className="text-xs text-red-600 font-medium">
              ● Filtering
            </span>
          )}
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["ALL", "PRESENT", "LATE", "ABSENT"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "ALL"
              ? `All (${records.length})`
              : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Records List */}
      <Card className="overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {filtered.length} {filtered.length === 1 ? "student" : "students"}
            {filter !== "ALL" &&
              ` — ${filter.charAt(0) + filter.slice(1).toLowerCase()}`}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">
              No students with this status today
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((record) => (
              <div
                key={record.recordId}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 ${avatarColor(record.status)} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white font-medium text-sm">
                      {record.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {record.studentName}
                    </p>
                    {record.teacherName && (
                      <p className="text-xs text-gray-400">
                        Marked by: {record.teacherName}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(record.status)}`}
                >
                  {record.status.charAt(0) +
                    record.status.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
