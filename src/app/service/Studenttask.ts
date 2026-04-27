import axiosInstance from "./axios";

export interface StudentService {
  assignmentId: number;
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  studentId: number;
  studentName: string;
}

export const getServicesByStudentId = async (
  studentId: number | string,
): Promise<StudentService[]> => {
  const { data } = await axiosInstance.get(
    `/api/services/student/${studentId}`,
  );
  return data;
};
