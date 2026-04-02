import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Plus, UserPlus, Edit, Trash2 } from "lucide-react";
import {
  getServices,
  createService,
  deleteService,
} from "../../service/Service";
import type { Service } from "../../service/Service";
import { getAllUsers } from "../../service/users";
import type { User } from "../../service/users";

export default function ServiceManagement() {
  const [createServiceOpen, setCreateServiceOpen] = useState(false);
  const [assignServiceOpen, setAssignServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const [services, setServices] = useState<Service[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  const [serviceForm, setServiceForm] = useState({ name: "", description: "" });
  const [serviceLoading, setServiceLoading] = useState(false);

  // Fetch services and students on mount
  useEffect(() => {
    getServices().then(setServices).catch(console.error);
    getAllUsers()
      .then((users) =>
        setStudents(
          users.filter(
            (u) => u.role === "STUDENT" || u.role === "ROLE_STUDENT",
          ),
        ),
      )
      .catch(console.error);
  }, []);

  const handleCreateService = async () => {
    try {
      setServiceLoading(true);
      await createService(serviceForm);
      const updated = await getServices();
      setServices(updated);
      setCreateServiceOpen(false);
      setServiceForm({ name: "", description: "" });
      toast.success("Service created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create service!");
    } finally {
      setServiceLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService(id);
      const updated = await getServices();
      setServices(updated);
      toast.success("Service deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Service Management
          </h2>
          <p className="text-sm text-gray-500">
            Create and assign student services and duties
          </p>
        </div>
        <div className="flex gap-2">
          {/* Create Service Dialog */}
          <Dialog open={createServiceOpen} onOpenChange={setCreateServiceOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input
                    placeholder="e.g., Library Duty"
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the responsibilities and duties"
                    rows={4}
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={handleCreateService}
                    disabled={serviceLoading}
                  >
                    {serviceLoading ? "Creating..." : "Create Service"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCreateServiceOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Assign Service Dialog */}
          <Dialog open={assignServiceOpen} onOpenChange={setAssignServiceOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign to Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Service to Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Service</Label>
                  <Select
                    value={selectedService}
                    onValueChange={setSelectedService}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => setAssignServiceOpen(false)}
                  >
                    Assign Service
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAssignServiceOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Service List */}
      <div className="grid gap-4">
        {services.length === 0 ? (
          <Card className="p-6 text-center text-gray-400">
            No services found
          </Card>
        ) : (
          services.map((service) => {
            const assignedStudents = students.filter((s) =>
              service.assignedStudents?.includes(s.id),
            );

            return (
              <Card key={service.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <Badge variant="secondary">
                        {assignedStudents.length}{" "}
                        {assignedStudents.length === 1 ? "student" : "students"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {assignedStudents.length > 0 ? (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Assigned Students:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {assignedStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-400">
                      No students assigned yet
                    </p>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Service Examples Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">Example Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-900">Library Duty</p>
            <p className="text-xs text-gray-600">Organize books</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-900">Cleaning Leader</p>
            <p className="text-xs text-gray-600">Supervise cleaning</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-900">Garden Work</p>
            <p className="text-xs text-gray-600">Maintain garden</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-900">Hall Monitor</p>
            <p className="text-xs text-gray-600">Monitor corridors</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
