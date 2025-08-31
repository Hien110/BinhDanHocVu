import React, { useEffect, useState } from "react";
import userService from "../services/userService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../constants/routePath";

function ManageStudentPage() {
  const [allStudents, setAllStudents] = useState([]);
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const closeModals = () => {
    setShowLockModal(false);
  };

  const fetchStudents = async () => {
    try {
      const res = await userService.getAllStudents();
      setAllStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLockStudent = async (studentId) => {
    try {
      const res = await userService.lockStudentAccount(studentId);
      if (res.success) {
        toast.success(res.message);
        setShowLockModal(false);
        fetchStudents();
      }
    } catch (error) {
      console.error("Failed to lock student account:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "locked":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = allStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (allStudents?.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-gray-500 text-lg">Không có sinh viên nào.</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Quản lý sinh viên
      </h1>

      <div className="mb-4 flex justify-between text-center items-center">
        {/* Ô tìm kiếm */}
        <div className="mb-4 flex w-2/3">
          <input
            type="text"
            placeholder="Tìm kiếm sinh viên theo tên..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Tổng số sinh viên */}
        <div className="mb-4 text-red-400">
          <span className="font-bold">Tổng số sinh viên:</span>{" "}
          {allStudents.length} sinh viên
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-xs sm:text-sm md:text-base text-gray-700">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-2 sm:p-4 border-b text-left font-semibold">
                Avatar
              </th>
              <th className="p-2 sm:p-4 border-b text-left font-semibold">
                Họ tên
              </th>
              <th className="p-2 sm:p-4 border-b text-left font-semibold">
                Email
              </th>
              <th className="p-2 sm:p-4 border-b text-left font-semibold">
                Khóa học
              </th>
              <th className="p-2 sm:p-4 border-b text-left font-semibold">
                Trạng thái
              </th>
              <th className="p-2 sm:p-4 border-b text-center font-semibold">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-2 sm:p-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-sm object-cover border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="p-2 sm:p-4 font-medium text-gray-800">
                    {student.name}
                  </td>
                  <td className="p-2 sm:p-4 text-gray-600 break-words">
                    {student.email}
                  </td>
                  <td className="p-2 sm:p-4">
                    K{student.yearOfAdmission || "-"}
                  </td>
                  <td
                    className={`p-2 sm:p-4 font-semibold ${getStatusColor(
                      student.status
                    )}`}
                  >
                    {student.status === "locked"
                      ? "Đã khóa"
                      : student.status === "non-active"
                      ? "Chưa kích hoạt"
                      : "Đang hoạt động"}
                  </td>
                  <td className="p-2 sm:p-4 text-center space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center">
                    {student.status !== "non-active" && (
                      <button
                        onClick={() => {
                          setShowLockModal(true);
                          setSelectedStudent(student);
                        }}
                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium shadow-sm transition-all cursor-pointer ${
                          student.status === "locked"
                            ? "bg-white border border-green-600 text-green-600 hover:bg-green-100"
                            : "bg-white border border-red-600 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {student.status === "locked"
                          ? "Mở khóa"
                          : "Khóa tài khoản"}
                      </button>
                    )}
                    <Link
                      to={ROUTE_PATH.LECTURER_STUDENT_DETAIL.replace(
                        ":studentId",
                        student._id
                      )}
                      className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-white border border-yellow-500 text-yellow-500 hover:bg-yellow-100 font-medium shadow-sm transition-all text-center"
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-gray-500 italic"
                >
                  Không tìm thấy sinh viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showLockModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-2000 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg sm:text-xl font-bold text-red-500 mb-4">
                {selectedStudent?.status === "locked"
                  ? "Mở khóa tài khoản"
                  : "Khóa tài khoản"}
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Bạn có chắc chắn muốn{" "}
                {selectedStudent?.status === "locked" ? "mở khóa" : "khóa"} tài
                khoản của sinh viên{" "}
                <span className="font-semibold text-red-500">
                  {selectedStudent?.name}
                </span>{" "}
                không?
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLockStudent(selectedStudent?._id);
                }}
              >
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm cursor-pointer w-full sm:w-auto"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white text-sm cursor-pointer w-full sm:w-auto"
                  >
                    {selectedStudent?.status === "locked" ? "Mở khóa" : "Khóa"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManageStudentPage;
