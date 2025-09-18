import React, { useEffect, useMemo, useState } from "react";
import userService from "../../services/userService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../constants/routePath";
import { Button } from "@mui/material";

function AdminManageLecturerPage() {
  const [allLecturers, setAllLecturer] = useState([]);
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW: sort & filter state
  const [nameSort, setNameSort] = useState("az"); // 'az' | 'za'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'locked' | 'non-active'

  const closeModals = () => setShowLockModal(false);

  const fetchLecturers = async () => {
    try {
      const res = await userService.getAllLecturers();
      setAllLecturer(res.data || []);
    } catch (error) {
      console.error("Failed to fetch lecturers:", error);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const handleLockLecturer = async (lecturerId) => {
    try {
      setLoading(true);
      const res = await userService.lockStudentAccount(lecturerId);
      if (res?.success) {
        toast.success(res.message || "Cập nhật thành công");
        setShowLockModal(false);
        fetchLecturers();
      } else {
        toast.error(res?.message || "Không thể cập nhật tài khoản");
      }
    } catch (error) {
      console.error("Failed to lock lecturer account:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // approve lecturer
  const approveLecturer = async (lecturerId) => {
    try {
      setLoading(true);
      const res = await userService.approveLecturer(lecturerId);
      if (res?.success) {
        toast.success(res.message || "Cập nhật thành công");
        fetchLecturers();
      } else {
        toast.error(res?.message || "Không thể cập nhật tài khoản");
      }
    } catch (error) {
      console.error("Failed to approve lecturer account:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "locked":
        return "text-red-600";
      case "non-active":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  // NEW: derive list with search + filter + sort (memoized)
  const displayedLecturers = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    let list = [...allLecturers];

    // search
    if (kw) {
      list = list.filter((s) => (s.fullName || "").toLowerCase().includes(kw));
    }

    // filter status
    if (statusFilter !== "all") {
      list = list.filter((s) => (s.status === statusFilter && s.approved === true) || (s.approved === false && statusFilter === "false"));
    }

    // sort by name
    list.sort((a, b) => {
      const aName = (a.fullName || "").toLowerCase();
      const bName = (b.fullName || "").toLowerCase();
      if (nameSort === "az") return aName.localeCompare(bName, "vi");
      return bName.localeCompare(aName, "vi");
    });

    return list;
  }, [allLecturers, searchTerm, nameSort, statusFilter]);

  if (!allLecturers || allLecturers.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-white">
        <div className="text-gray-500 text-lg">Không có giảng viên nào.</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mb-6 md:mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Quản lý giáo viên
        </h1>
        <p className="text-gray-500 mt-1">
          Quản trị danh sách giáo viên, khóa/mở khóa tài khoản và xem chi tiết.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Search */}
        <div className="md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm theo tên
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập tên sinh viên…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            />
            <svg
              className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sắp xếp theo tên
          </label>
          <select
            value={nameSort}
            onChange={(e) => setNameSort(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-white"
          >
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
        </div>

        {/* Filter status */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lọc theo trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-white"
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Đã khóa</option>
            <option value="non-active">Chờ xác thực email</option>
            <option value="false">Chờ phê duyệt</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-gray-600">
          <span className="font-semibold">Tổng số giảng viên:</span>{" "}
          {allLecturers.length} giảng viên
        </div>
        <div className="text-sm text-gray-500">
          Hiển thị:{" "}
          <span className="font-medium">{displayedLecturers.length}</span> kết
          quả phù hợp
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full border-collapse text-sm md:text-base text-gray-700">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-4 border-b text-left font-semibold">Ảnh</th>
              <th className="p-4 border-b text-left font-semibold">Họ tên</th>
              <th className="p-4 border-b text-left font-semibold">Email</th>
              <th className="p-4 border-b text-left font-semibold">
                Trạng thái
              </th>
              <th className="p-4 border-b text-center font-semibold">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="[&>tr:hover]:bg-gray-50">
            {displayedLecturers.length > 0 ? (
              displayedLecturers.map((lecturer) => (
                <tr key={lecturer._id} className="border-b">
                  <td className="p-4">
                    <img
                      src={lecturer.avatar || "/placeholder-avatar.png"}
                      alt={lecturer.fullName || "avatar"}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200 shadow-xs"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {lecturer.fullName}
                  </td>
                  <td className="p-4 text-gray-600 break-words">
                    {lecturer.email}
                  </td>

                  {lecturer.approved === false ? (
                    <td className="p-4 font-semibold text-custom-orange">
                      Đang chờ phê duyệt
                    </td>
                  ) : (
                    <td
                      className={`p-4 font-semibold ${getStatusColor(
                        lecturer.status
                      )}`}
                    >
                      {lecturer.status === "locked"
                        ? "Đã khóa tài khoản"
                        : lecturer.status === "non-active"
                        ? "Chờ xác thực email"
                        : "Đang hoạt động"}
                    </td>
                  )}

                  {lecturer.approved === false ? (
                    <td className="p-4 font-semibold text-amber-600 text-center">
                      {/* button cấp phép giáo viên */}
                      <button
                        onClick={() => approveLecturer(lecturer._id)}
                        className="cursor-pointer px-3 py-1.5 text-sm rounded-xl bg-white border border-custom-blue text-custom-blue hover:bg-custom-hover-blue2 font-medium shadow-sm transition-all text-center"
                      >
                        Cấp phép
                      </button>
                    </td>
                  ) : (
                    <td className="p-4">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Link
                          to={ROUTE_PATH.ADMIN_LECTURER_DETAIL.replace(
                            ":lecturerId",
                            lecturer._id
                          )}
                          className="px-3 py-1.5 text-sm rounded-xl bg-white border border-custom-blue text-custom-blue hover:bg-custom-hover-blue2 font-medium shadow-sm transition-all text-center"
                        >
                          Xem chi tiết
                        </Link>

                        {lecturer.status !== "non-active" && (
                          <button
                            onClick={() => {
                              setShowLockModal(true);
                              setSelectedLecturer(lecturer);
                            }}
                            className={`px-3 py-1.5 text-sm rounded-xl font-medium shadow-sm transition-all cursor-pointer ${
                              lecturer.status === "locked"
                                ? "bg-white border border-green-600 text-green-600 hover:bg-green-50"
                                : "bg-white border border-red-600 text-red-600 hover:bg-red-50"
                            }`}
                          >
                            {lecturer.status === "locked"
                              ? "Mở khóa"
                              : "Khóa tài khoản"}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500 italic"
                >
                  Không tìm thấy sinh viên nào phù hợp.
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
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <h2
                className="text-xl font-bold text-red-500
              mb-2"
              >
                {selectedLecturer?.status === "locked"
                  ? "Mở khóa tài khoản"
                  : "Khóa tài khoản"}
              </h2>
              <p className="text-gray-600 mb-5 text-sm sm:text-base">
                Bạn có chắc chắn muốn{" "}
                <span className="font-semibold">
                  {selectedLecturer?.status === "locked" ? "mở khóa" : "khóa"}
                </span>{" "}
                tài khoản của giáo viên{" "}
                <span className="font-semibold text-red-500">
                  {selectedLecturer?.fullName}
                </span>{" "}
                không?
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLockLecturer(selectedLecturer?._id);
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
                    {loading ? "Đang xử lý..." : "Xác nhận"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminManageLecturerPage;
