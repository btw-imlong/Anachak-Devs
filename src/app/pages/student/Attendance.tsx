import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import axiosInstance from "../../service/axios";

interface AttendanceRecord {
  recordId: number;
  studentId: number;
  studentName: string;
  status: "PRESENT" | "LATE" | "ABSENT";
  teacherName: string | null;
  date: string;
}

type FilterOption = "ALL" | "THIS_MONTH" | "LAST_3_MONTHS" | "THIS_YEAR";

const getDateRange = (
  filter: FilterOption,
): { from: string; to: string } | null => {
  const today = new Date();
  const to = today.toISOString().split("T")[0];
  if (filter === "THIS_MONTH") {
    return {
      from: new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0],
      to,
    };
  }
  if (filter === "LAST_3_MONTHS") {
    return {
      from: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
        .toISOString()
        .split("T")[0],
      to,
    };
  }
  if (filter === "THIS_YEAR") {
    return {
      from: new Date(today.getFullYear(), 0, 1).toISOString().split("T")[0],
      to,
    };
  }
  return null;
};

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("ALL");

  const fetchAttendance = async (
    selectedFilter: FilterOption,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const range = getDateRange(selectedFilter);
      const url = range
        ? `/api/student/attendance/range?from=${range.from}&to=${range.to}`
        : "/api/student/attendance";
      const { data } = await axiosInstance.get(url);
      setAttendance(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(filter);
  }, [filter]);

  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
  const lateCount = attendance.filter((a) => a.status === "LATE").length;
  const absentCount = attendance.filter((a) => a.status === "ABSENT").length;
  const attendanceRate =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  const filterOptions: { label: string; value: FilterOption }[] = [
    { label: "All Time", value: "ALL" },
    { label: "This Month", value: "THIS_MONTH" },
    { label: "Last 3 Months", value: "LAST_3_MONTHS" },
    { label: "This Year", value: "THIS_YEAR" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            My Attendance History
          </h2>
          <p className="text-sm text-gray-500">Track your attendance records</p>
        </div>
        {/* Filter tabs — scrollable on mobile */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto shrink-0">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                filter === option.value
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Attendance Rate
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {attendanceRate}%
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Present</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {presentCount}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Late</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                {lateCount}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Absent</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">
                {absentCount}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Records list */}
      <Card className="overflow-hidden">
        <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">
            Recent Attendance Records
          </h3>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : attendance.length > 0 ? (
          <div className="divide-y">
            {attendance.map((record, index) => (
              <div
                key={record.recordId}
                className={`px-4 sm:px-5 py-4 sm:py-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors ${
                  index === 0 ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {index === 0 ? "Most recent" : `Record #${index + 1}`}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`shrink-0 ${
                    record.status === "PRESENT"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : record.status === "LATE"
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No attendance records found</p>
          </div>
        )}
      </Card>

      {/* Performance card */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          Attendance Performance
        </h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-gray-700">Overall Attendance</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 shrink-0">
                {attendanceRate}%
              </span>
            </div>
          </div>
          {attendanceRate >= 90 && (
            <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                🎉 Excellent attendance! Keep up the great work!
              </p>
            </div>
          )}
          {attendanceRate >= 75 && attendanceRate < 90 && (
            <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Good attendance, but there's room for improvement.
              </p>
            </div>
          )}
          {attendanceRate < 75 && attendanceRate > 0 && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ Your attendance needs attention. Please speak with your
                teacher.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
