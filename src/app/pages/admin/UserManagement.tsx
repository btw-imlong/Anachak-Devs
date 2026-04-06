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
import { BASE_URL } from "../../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeacherForm {
  name: string;
  email: string;
  password: string;
  idCardNumber: string;
}

interface StudentForm {
  name: string;
  email: string;
  password: string;
  idCardNumber: string;
  roomNumber: string;
}

interface UpdateTeacherForm {
  name: string;
  email: string;
  idCardNumber: string;
}

interface UpdateStudentForm {
  name: string;
  email: string;
  idCardNumber: string;
  roomNumber: string;
}

const EMPTY_TEACHER: TeacherForm = {
  name: "",
  email: "",
  password: "",
  idCardNumber: "",
};

const EMPTY_STUDENT: StudentForm = {
  name: "",
  email: "",
  password: "",
  idCardNumber: "",
  roomNumber: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Create state ──────────────────────────────────────────────────────────
  const [teacherDialogOpen, setTeacherDialogOpen] = useState<boolean>(false);
  const [studentDialogOpen, setStudentDialogOpen] = useState<boolean>(false);
  const [teacherForm, setTeacherForm] = useState<TeacherForm>(EMPTY_TEACHER);
  const [studentForm, setStudentForm] = useState<StudentForm>(EMPTY_STUDENT);
  const [teacherLoading, setTeacherLoading] = useState<boolean>(false);
  const [studentLoading, setStudentLoading] = useState<boolean>(false);

  // ── Edit state ────────────────────────────────────────────────────────────
  const [editTeacherOpen, setEditTeacherOpen] = useState<boolean>(false);
  const [editStudentOpen, setEditStudentOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updateTeacherForm, setUpdateTeacherForm] = useState<UpdateTeacherForm>(
    { name: "", email: "", idCardNumber: "" },
  );
  const [updateStudentForm, setUpdateStudentForm] = useState<UpdateStudentForm>(
    { name: "", email: "", idCardNumber: "", roomNumber: "" },
  );
  const [editLoading, setEditLoading] = useState<boolean>(false);

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const teachers = users.filter(
    (u) => u.role === "TEACHER" || u.role === "ROLE_TEACHER",
  );
  const students = users.filter(
    (u) => u.role === "STUDENT" || u.role === "ROLE_STUDENT",
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  // ── Create teacher ─────────────────────────────────────────────────────────

  async function handleCreateTeacher() {
    if (
      !teacherForm.name ||
      !teacherForm.email ||
      !teacherForm.password ||
      !teacherForm.idCardNumber
    ) {
      toast.warning("Please fill in all fields");
      return;
    }
    try {
      setTeacherLoading(true);
      await createTeacher(teacherForm);
      await fetchUsers();
      setTeacherDialogOpen(false);
      setTeacherForm(EMPTY_TEACHER);
      toast.success("Teacher account created successfully!");
    } catch {
      toast.error("Failed to create teacher");
    } finally {
      setTeacherLoading(false);
    }
  }

  // ── Create student ─────────────────────────────────────────────────────────

  async function handleCreateStudent() {
    if (
      !studentForm.name ||
      !studentForm.email ||
      !studentForm.password ||
      !studentForm.idCardNumber
    ) {
      toast.warning("Please fill in all required fields");
      return;
    }
    try {
      setStudentLoading(true);
      await createStudent(studentForm);
      await fetchUsers();
      setStudentDialogOpen(false);
      setStudentForm(EMPTY_STUDENT);
      toast.success("Student account created successfully!");
    } catch {
      toast.error("Failed to create student");
    } finally {
      setStudentLoading(false);
    }
  }

  // ── Open edit ──────────────────────────────────────────────────────────────

  function openEditTeacher(user: User) {
    setSelectedUser(user);
    setUpdateTeacherForm({
      name: user.name,
      email: user.email,
      idCardNumber: "",
    });
    setEditTeacherOpen(true);
  }

  function openEditStudent(user: User) {
    setSelectedUser(user);
    setUpdateStudentForm({
      name: user.name,
      email: user.email,
      idCardNumber: "",
      roomNumber: "",
    });
    setEditStudentOpen(true);
  }

  // ── Update teacher ─────────────────────────────────────────────────────────

  async function handleUpdateTeacher() {
    if (!selectedUser) return;
    try {
      setEditLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/users/teacher/${selectedUser.id}`,
        {
          method: "PUT",
          headers: authHeader,
          body: JSON.stringify(updateTeacherForm),
        },
      );
      if (!res.ok) throw new Error("Failed to update teacher");
      await fetchUsers();
      setEditTeacherOpen(false);
      setSelectedUser(null);
      toast.success("Teacher updated successfully!");
    } catch {
      toast.error("Failed to update teacher");
    } finally {
      setEditLoading(false);
    }
  }

  // ── Update student ─────────────────────────────────────────────────────────

  async function handleUpdateStudent() {
    if (!selectedUser) return;
    try {
      setEditLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/users/student/${selectedUser.id}`,
        {
          method: "PUT",
          headers: authHeader,
          body: JSON.stringify(updateStudentForm),
        },
      );
      if (!res.ok) throw new Error("Failed to update student");
      await fetchUsers();
      setEditStudentOpen(false);
      setSelectedUser(null);
      toast.success("Student updated successfully!");
    } catch {
      toast.error("Failed to update student");
    } finally {
      setEditLoading(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  function openDelete(user: User) {
    setDeleteTarget(user);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteUser(deleteTarget.id);
      await fetchUsers();
      setDeleteOpen(false);
      setDeleteTarget(null);
      toast.success("User deleted successfully!");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Role display ───────────────────────────────────────────────────────────

  function roleLabel(role: string): string {
    return (
      role.replace("ROLE_", "").charAt(0) +
      role.replace("ROLE_", "").slice(1).toLowerCase()
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="teachers" className="w-full">
        <TabsList>
          <TabsTrigger value="teachers">
            Teachers ({teachers.length})
          </TabsTrigger>
          <TabsTrigger value="students">
            Students ({students.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Teachers Tab ──────────────────────────────────────────────────── */}
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
                  Create Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Teacher Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter teacher name"
                      value={teacherForm.name}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Email <span className="text-red-500">*</span>
                    </Label>
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
                    <Label>
                      Password <span className="text-red-500">*</span>
                    </Label>
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
                    <Label>
                      ID Card Number <span className="text-red-500">*</span>
                    </Label>
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
                  <div className="flex gap-2 pt-2">
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
                        <Badge variant="secondary">
                          {roleLabel(teacher.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditTeacher(teacher)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDelete(teacher)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* ── Students Tab ───────────────────────────────────────────────────── */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Student Accounts
              </h2>
              <p className="text-sm text-gray-500">
                Manage student accounts and room assignments
              </p>
            </div>
            <Dialog
              open={studentDialogOpen}
              onOpenChange={setStudentDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Student Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter student name"
                      value={studentForm.name}
                      onChange={(e) =>
                        setStudentForm({ ...studentForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Email <span className="text-red-500">*</span>
                    </Label>
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
                    <Label>
                      Password <span className="text-red-500">*</span>
                    </Label>
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
                    <Label>
                      ID Card Number <span className="text-red-500">*</span>
                    </Label>
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
                      placeholder="Optional — assign room later"
                      value={studentForm.roomNumber}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          roomNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
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
                        <Badge variant="secondary">
                          {roleLabel(student.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditStudent(student)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDelete(student)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* ── Edit Teacher Modal ─────────────────────────────────────────────── */}
      <Dialog open={editTeacherOpen} onOpenChange={setEditTeacherOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={updateTeacherForm.name}
                onChange={(e) =>
                  setUpdateTeacherForm({
                    ...updateTeacherForm,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={updateTeacherForm.email}
                onChange={(e) =>
                  setUpdateTeacherForm({
                    ...updateTeacherForm,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>ID Card Number</Label>
              <Input
                placeholder="Leave empty to keep current"
                value={updateTeacherForm.idCardNumber}
                onChange={(e) =>
                  setUpdateTeacherForm({
                    ...updateTeacherForm,
                    idCardNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1"
                onClick={handleUpdateTeacher}
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditTeacherOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Student Modal ─────────────────────────────────────────────── */}
      <Dialog open={editStudentOpen} onOpenChange={setEditStudentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={updateStudentForm.name}
                onChange={(e) =>
                  setUpdateStudentForm({
                    ...updateStudentForm,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={updateStudentForm.email}
                onChange={(e) =>
                  setUpdateStudentForm({
                    ...updateStudentForm,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>ID Card Number</Label>
              <Input
                placeholder="Leave empty to keep current"
                value={updateStudentForm.idCardNumber}
                onChange={(e) =>
                  setUpdateStudentForm({
                    ...updateStudentForm,
                    idCardNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Room Number</Label>
              <Input
                placeholder="Leave empty to keep current"
                value={updateStudentForm.roomNumber}
                onChange={(e) =>
                  setUpdateStudentForm({
                    ...updateStudentForm,
                    roomNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1"
                onClick={handleUpdateStudent}
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditStudentOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Modal ───────────────────────────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {deleteTarget?.name ?? ""}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
