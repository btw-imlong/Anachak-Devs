import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Briefcase, BookOpen, AlertCircle } from "lucide-react";
import { getServicesByStudentId } from "../../service/Studenttask";
import type { StudentService } from "../../service/Studenttask";
import { getStudentByUserId } from "../../service/Studentdashboard";

export default function StudentServices() {
  const [services, setServices] = useState<StudentService[]>([]);
  const [studentName, setStudentName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("No user logged in");
        const student = await getStudentByUserId(userId);
        setStudentName(student.name ?? "");
        const data = await getServicesByStudentId(student.id);
        setServices(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load services",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading services...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          My Services
        </h2>
        <p className="text-sm text-gray-500">Service duties assigned to you</p>
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <Card className="p-10 flex flex-col items-center justify-center text-center gap-3">
            <Briefcase className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">
              You don't have any service duties assigned yet.
            </p>
          </Card>
        ) : (
          services.map((service) => (
            <Card
              key={service.assignmentId}
              className="p-6 hover:shadow-md transition-all border border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {service.serviceName}
                    </h3>
                    <Badge className="bg-purple-600 hover:bg-purple-600 text-white text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {service.serviceDescription}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>
                      Assignment ID:{" "}
                      <span className="font-medium text-gray-600">
                        #{service.assignmentId}
                      </span>
                    </span>
                    <span>
                      Service ID:{" "}
                      <span className="font-medium text-gray-600">
                        #{service.serviceId}
                      </span>
                    </span>
                    <span>
                      Student:{" "}
                      <span className="font-medium text-gray-600">
                        {service.studentName}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Card className="p-5 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-1">About My Services</h3>
        <p className="text-sm text-gray-600">
          These are your assigned service duties. Contact your administrator if
          you believe there is an error in your assignments.
        </p>
      </Card>
    </div>
  );
}
