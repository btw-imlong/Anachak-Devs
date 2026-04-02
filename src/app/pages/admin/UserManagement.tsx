import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import {
  getAllUsers,
  createTeacher,
  createStudent,
  deleteUser,
} from "../../service/users";
import type { User } from "../../service/users";

export default function UserManagement() {
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  const teachers = users.filter(
    (u) => u.role === "TEACHER" || u.role === "ROLE_TEACHER",
  );
  const students = users.filter(
    (u) => u.role === "STUDENT" || u.role === "ROLE_STUDENT",
  );

  useEffect(() => {
    getAllUsers().then(setUsers).catch(console.error);
  }, []);

  // ── Teacher form ───────────────────────────────────────
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
    idCardNumber: "",
  });
  const [teacherLoading, setTeacherLoading] = useState(false);

  const handleCreateTeacher = async () => {
    try {
      setTeacherLoading(true);
      await createTeacher(teacherForm);
      const updated = await getAllUsers();
      setUsers(updated);
      setTeacherDialogOpen(false);
      setTeacherForm({ name: "", email: "", password: "", idCardNumber: "" });
      toast.success("Teacher account created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create teacher!");
    } finally {
      setTeacherLoading(false);
    }
  };

  // ── Student form ───────────────────────────────────────
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    idCardNumber: "",
    roomNumber: "",
  });
  const [studentLoading, setStudentLoading] = useState(false);

  const handleCreateStudent = async () => {
    try {
      setStudentLoading(true);
      await createStudent(studentForm);
      const updated = await getAllUsers();
      setUsers(updated);
      setStudentDialogOpen(false);
      setStudentForm({
        name: "",
        email: "",
        password: "",
        idCardNumber: "",
        roomNumber: "",
      });
      toast.success("Student account created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create student!");
    } finally {
      setStudentLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      const updated = await getAllUsers();
      setUsers(updated);
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user!");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="teachers" className="w-full">
        <TabsList>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        {/* ── Teachers Tab ── */}
        <TabsContent value="teachers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Teacher Accounts
              </h2>
              <p className="text-sm text-gray-500">
                Manage teacher accounts and room assignments
              </p>
            </div>
            <Dialog
              open={teacherDialogOpen}
              onOpenChange={setTeacherDialogOpen}
            >
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
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Enter teacher name"
                      value={teacherForm.name}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="teacher@school.edu"
                      value={teacherForm.email}
                      onChange={(e) =>
                        setTeacherForm({
                          ...teacherForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={teacherForm.password}
                      onChange={(e) =>
                        setTeacherForm({
                          ...teacherForm,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ID Card Number</Label>
                    <Input
                      placeholder="Enter ID card number"
                      value={teacherForm.idCardNumber}
                      onChange={(e) =>
                        setTeacherForm({
                          ...teacherForm,
                          idCardNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1"
                      onClick={handleCreateTeacher}
                      disabled={teacherLoading}
                    >
                      {teacherLoading ? "Creating..." : "Create Account"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setTeacherDialogOpen(false)}
                    >
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
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-400 py-6"
                    >
                      No teachers found
                    </TableCell>
                  </TableRow>
                ) : (
                  teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {teacher.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{teacher.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ── Students Tab ── */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Student Accounts
              </h2>
              <p className="text-sm text-gray-500">
                Manage student accounts and service assignments
              </p>
            </div>
            <Dialog
              open={studentDialogOpen}
              onOpenChange={setStudentDialogOpen}
            >
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
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Enter student name"
                      value={studentForm.name}
                      onChange={(e) =>
                        setStudentForm({ ...studentForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="student@school.edu"
                      value={studentForm.email}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={studentForm.password}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ID Card Number</Label>
                    <Input
                      placeholder="Enter ID card number"
                      value={studentForm.idCardNumber}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          idCardNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Room Number</Label>
                    <Input
                      placeholder="Enter room number"
                      value={studentForm.roomNumber}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          roomNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1"
                      onClick={handleCreateStudent}
                      disabled={studentLoading}
                    >
                      {studentLoading ? "Creating..." : "Create Account"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setStudentDialogOpen(false)}
                    >
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
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-400 py-6"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{student.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
