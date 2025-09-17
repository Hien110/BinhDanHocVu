import React, { useEffect, useState } from "react";

import classroomService from "../../services/classroomService";

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";
import { ROUTE_PATH } from "../../constants/routePath";
import { Button } from "@mui/material";

function ManageStudentInCoursePage() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [courseToLeave, setCourseToLeave] = useState(null);

  const closeModals = () => {
    setShowDeleteLessonModal(false);
    setCourseToLeave(null);
  };

  const handleLeaveCourse = async () => {
    try {
      setLoading(true);
      const result = await classroomService.leaveClassRoom(courseToLeave._id);
      if (result.success) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== courseToLeave._id)
        );
        toast.success("Xóa học viên khỏi lớp học thành công");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.", error);
    } finally {
      setLoading(false);
      closeModals();
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const result = await classroomService.getStudentsInCourse(courseId);
        if (result?.success) {
          setStudents(result.data || []);
        } else {
          setError(result?.message || "Không thể tải danh sách học sinh");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const filteredStudents = students.filter((item) => {
    const s = item?.student || {};
    const keyword = search.toLowerCase();
    return (
      s?.fullName?.toLowerCase().includes(keyword) ||
      s?.email?.toLowerCase().includes(keyword)
    );
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const sa = a?.student || {};
    const sb = b?.student || {};
    if (sortBy === "name") {
      return sa.fullName?.localeCompare(sb.fullName);
    } else if (sortBy === "date") {
      return new Date(a?.createdAt) - new Date(b?.createdAt);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        {students[0]?.course?.title}
      </h1>

      <h2 className="text-2xl font-semibold text-custom-blue mb-6 border-b border-gray-300 pb-2">
        Danh sách học sinh
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mb-4 justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên hoặc email"
          className="w-full sm:w-120 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-56 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">-- Sắp xếp --</option>
          <option value="name">Sắp xếp theo tên</option>
          <option value="date">Sắp xếp theo ngày tham gia</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {sortedStudents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
          Không tìm thấy học sinh nào.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 py-3 text-left text-sm font-semibold text-gray-600">
                  Ảnh đại diện
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Họ và tên
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Ngày tham gia
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {sortedStudents.map((item) => {
                const s = item?.student || {};
                return (
                  <tr key={item?._id || s?._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={s?.avatar || "https://via.placeholder.com/40"}
                        alt={s?.fullName || "avatar"}
                        className="h-20 w-20 rounded-sm object-cover ring-1 ring-gray-200"
                        loading="lazy"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {s?.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {s?.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {/* <Link
                        to={ROUTE_PATH.LECTURER_STUDENT_DETAIL.replace(
                          ":studentId",
                          s._id
                        )}
                        className="inline-flex items-center rounded-md border border-custom-orange px-3 py-1.5 text-sm text-custom-orange hover:bg-custom-hover-orange2 transition-colors duration-300 "
                      >
                        Xem chi tiết
                      </Link> */}
                      <button
                        onClick={() => {
                          setShowDeleteLessonModal(true);
                          setCourseToLeave(item);
                        }}
                        className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 border border-red-500 transition-colors duration-300 cursor-pointer "
                      >
                        Xóa khỏi lớp học
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <AnimatePresence>
            {showDeleteLessonModal && (
              <motion.div
                className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-red-500 mb-4">
                    Xóa học viên
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Bạn có chắc chắn muốn xóa{" "}
                    <span className="font-semibold text-red-500">
                      {courseToLeave?.student?.fullName}
                    </span>{" "}
                    ra khỏi lớp học không?
                  </p>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLeaveCourse();
                    }}
                  >
                    <div className="text-right gap-4 flex justify-end">
                      <Button
                        type="button"
                        variant="contained"
                        disableElevation
                        fullWidth
                        disabled={loading}
                        onClick={() => closeModals()}
                        sx={{
                          py: "8px",
                          px: "16px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          borderRadius: "6px",
                          textTransform: "none",
                          color: "white",
                          bgcolor: "grey.600",
                          transition:
                            "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                          "&:hover": {
                            bgcolor: "grey.700",
                          },
                          "&.Mui-disabled": {
                            color: "white",
                            bgcolor: "grey.400",
                            cursor: "not-allowed",
                            opacity: 1,
                          },
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        loading={loading} // 👈 Thêm prop này
                        disableElevation
                        fullWidth
                        disabled={loading} // 👈 tránh user bấm khi đang loading
                        sx={{
                          py: "8px",
                          px: "16px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          borderRadius: "6px",
                          textTransform: "none",
                          color: "white",
                          bgcolor: !loading ? "#e43939" : "grey.400",
                          transition:
                            "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                          "&:hover": {
                            bgcolor: !loading ? "#dd1c1cff" : "grey.400",
                          },
                          "&.Mui-disabled": {
                            color: "white",
                            bgcolor: "grey.400",
                            cursor: "not-allowed",
                            opacity: 1,
                          },
                        }}
                      >
                        {loading ? "Đang xử lý..." : "Xóa học viên"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default ManageStudentInCoursePage;
