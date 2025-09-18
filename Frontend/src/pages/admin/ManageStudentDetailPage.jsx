import React, { useEffect, useState } from "react";

import userService from "../../services/userService";
import classroomService from "../../services/classroomService";

import { useParams } from "react-router-dom";
import CourseCard from "../../components/CourseCard";

function AdminManageStudentDetail() {
  const { studentId } = useParams();

  const [lecturer, setLecturer] = useState(null);
  const [classrooms, setClassrooms] = useState([]);

  const fetchLecturerDetails = async () => {
    try {
      const res = await userService.getUserById(studentId);
      setLecturer(res.data);
    } catch (error) {
      console.error("Failed to fetch lecturer details:", error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const res = await classroomService.getUserClassRooms(studentId);
      console.log(res.data);

      setClassrooms(res.data);
    } catch (error) {
      console.error("Failed to fetch classrooms:", error);
    }
  };

  useEffect(() => {
    fetchLecturerDetails();
    fetchClassrooms();
  }, [studentId]);

  return (
    <div>
      <div className="min-h-screen ">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
          Hồ sơ học viên{" "}
          <span className="text-custom-blue">{lecturer?.fullName}</span>
        </h1>

        {/* Card bao ngoài */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Thông tin giảng viên */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Thông tin cá nhân
            </h2>

            <div className="flex items-center gap-6">
              {/* Avatar */}
              <img
                src={lecturer?.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="w-28 h-28 rounded-full border shadow-sm object-cover"
              />

              {/* Thông tin */}
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p>
                  <span className="font-medium text-gray-600">Họ và tên:</span>{" "}
                  <span className="text-black">{lecturer?.fullName}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">Email:</span>{" "}
                  <span className="text-black">{lecturer?.email}</span>
                </p>
                <p className="col-span-2">
                  <span className="font-medium text-gray-600">
                    Ngày tham gia:
                  </span>{" "}
                  {new Date(lecturer?.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto mt-12 mb-20">
          <h1 className="text-xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
            Danh sách lớp học đã tham gia
          </h1>
          {classrooms.length === 0 ? (
            <p className="text-gray-500 italic">
              Học sinh này chưa có lớp học nào.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom) => (
                <CourseCard
                  key={classroom.course._id}
                  course={classroom.course}
                  message={"ClassWereJoined"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminManageStudentDetail;
