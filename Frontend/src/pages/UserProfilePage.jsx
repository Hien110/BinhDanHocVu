/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { uploadToCloudinary } from "../services/uploadCloudinary";
import userService from "../services/userService";
import quizResultService from "../services/quizResultService";

import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { LoadingButton } from "@mui/lab";

import { red } from "@mui/material/colors";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import QuizHistoryItem from "../components/QuizHistoryItem";
import AverageScoreCard from "../components/AverageScoreCard";
import ResultClassification from "../components/ResultClassification";

const UserProfile = () => {
  const user = userService.getCurrentUser();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [fullName, setFullName] = useState(user?.name || "");
  const [yearOfAdmission, setYearOfAdmission] = useState(
    user?.yearOfAdmission || ""
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkLength, setCheckLength] = useState(false);
  const [checkMatch, setCheckMatch] = useState(false);
  const [loading, setLoading] = useState(false);

  //kết quả kiểm tra
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length >= 6 && newPassword.length <= 20) {
      setCheckLength(true);
    } else {
      setCheckLength(false);
    }
    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword === confirmPassword) {
      setCheckMatch(true);
    } else {
      setCheckMatch(false);
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    const fetchQuizResults = async () => {
      const response = await quizResultService.getQuizResultsByUserId(user._id);
      if (response.success) {
        setQuizResults(response.data);
      }
    };
    fetchQuizResults();
  }, []);
  // Handler submit form cập nhật thông tin người dùng
  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = user.avatar;

    // Nếu có file ảnh mới được chọn
    if (avatarFile) {
      setLoading(true);
      const uploadedUrl = await uploadToCloudinary(avatarFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const userData = {
      name: fullName,
      yearOfAdmission,
      avatar: imageUrl, // dùng URL từ Cloudinary
    };

    try {
      const response = await userService.updateUser(userData);
      if (response.success) {
        toast.success(response.message);
        // Cập nhật lại thông tin người dùng trong sessionStorage
        const updatedUser = { ...user, ...userData, avatar: imageUrl };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload(); // Tải lại trang để cập nhật thông tin
        setShowUpdateModal(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại.", error);
    } finally {
      setLoading(false);
    }
    // Gửi updatedUser lên backend
  };

  // Handler submit form đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    try {
      const response = await userService.changePassword(password, newPassword);
      if (response.success) {
        toast.success(response.message);
        setShowPasswordModal(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại.", error);
    }
  };

  // Handler đóng modal
  const closeModals = () => {
    setShowUpdateModal(false);
    setShowPasswordModal(false);
  };

  return (
    <>
      <div className="bg-gray-50 py-10 px-4 md:px-10 flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
        <div className="w-full md:w-1/3 min-h-[400px]">
          <div className="border border-gray-300 rounded-lg shadow-sm p-6 bg-white">
            <div className="flex flex-col items-center space-y-4">
              <img
                src={previewAvatar}
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="text-center mt-4 p-4">
              <h2 className="text-xl font-bold text-black">{user.name}</h2>
              { user.role === "student" && <p className="text-gray-600">Sinh viên</p>}
              { user.role === "lecturer" && <p className="text-gray-600">Giảng viên</p>}
              <div className="mt-4 space-x-3 flex justify-center">
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="px-5 bg-white border border-yellow-500 text-yellow-500 py-2 text-[12px] rounded hover:bg-yellow-100 transition-colors duration-300 hover:cursor-pointer"
                >
                  Cập nhật hồ sơ
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-5 bg-white border border-yellow-500 text-yellow-500 py-2 text-[12px] rounded hover:bg-yellow-100 transition-colors duration-300 hover:cursor-pointer"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg shadow-sm p-6 bg-white mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin cá nhân
            </h3>
            <ul className="space-y-2">
              <li>
                <div className="flex items-center">
                  <PersonOutlineOutlinedIcon className="text-gray-600 mr-4" />
                  <div>
                    <p className="text-gray-800 text-[14px]">Họ và Tên</p>
                    <p className="text-gray-600">{user.name}</p>
                  </div>
                </div>
              </li>
              {user.role === "student" && (
                <li>
                  <div className="flex items-center">
                    <SchoolOutlinedIcon className="text-gray-600 mr-4" />
                    <div>
                      <p className="text-gray-800 text-[14px]">Khóa học</p>
                      <p className="text-gray-600">K{user.yearOfAdmission}</p>
                    </div>
                  </div>
                </li>
              )}
              <li>
                <div className="flex items-center">
                  <EmailOutlinedIcon className="text-gray-600 mr-4" />
                  <div>
                    <p className="text-gray-800 text-[14px]">Email</p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <CalendarTodayOutlinedIcon className="text-gray-600 mr-4" />
                  <div>
                    <p className="text-gray-800 text-[14px]">Ngày tham gia</p>
                    <p className="text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Điểm trung bình */}
          <AverageScoreCard quizResults={quizResults} />
        </div>
        <div className="w-full md:w-2/3 min-h-[400px]">
          <div className=" border p-4 border border-gray-300 rounded-lg shadow-sm bg-white max-h-[650px] flex flex-col">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-3 mb-3">
              Lịch sử làm bài
            </h2>

            {/* Danh sách quiz results có scroll riêng */}
            <div className="flex-1 overflow-y-auto pr-2">
              {quizResults.reverse().map((item) => (
                <QuizHistoryItem key={item._id} history={item} />
              ))}
            </div>
          </div>
            <ResultClassification quizResults={quizResults} />
        </div>
      </div>

      {/* Modal cập nhật hồ sơ */}
      <AnimatePresence>
        {showUpdateModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-50"
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
                Cập nhật hồ sơ
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Tên */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    name="name"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Khóa học */}
                {user.role === "student" && (
                  <div>
                    <label className="block font-medium text-gray-700 mb-1 text-sm">
                      Khóa học
                    </label>
                    <select
                      value={yearOfAdmission}
                      onChange={(e) => setYearOfAdmission(e.target.value)}
                      name="yearOfAdmission"
                      className="w-full border rounded px-3 py-2"
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const value = 16 + i;
                        return (
                          <option key={value} value={value}>
                            K{value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* Ảnh đại diện upload */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm">
                    Ảnh đại diện
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewAvatar(url);
                        setAvatarFile(file);
                      }
                    }}
                    className="w-full border rounded px-3 py-2"
                  />
                  {previewAvatar && (
                    <img
                      src={previewAvatar}
                      alt="Preview"
                      className="w-24 h-24 mt-2 rounded-full object-cover border"
                    />
                  )}
                </div>

                {/* Buttons */}
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Hủy
                  </button>
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    variant="outlined"
                    fullWidth
                    sx={{
                      // fontFamily: "Noto_Serif",
                      fontSize: "14px",
                      paddingX: 4,
                      textTransform: "none",
                      borderRadius: "4px",
                      backgroundColor: red[500],
                      border: "none",
                      color: "#FFF",
                      "&:hover": {
                        backgroundColor: red[600],
                      },
                    }}
                  >
                    Lưu
                  </LoadingButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal đổi mật khẩu */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Thay đổi mật khẩu
              </h2>
              <form className="space-y-4" onSubmit={handleChangePassword}>
                <div className="relative">
                  <label className="block font-medium text-gray-700 mb-1 text-sm">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 pr-10"
                    name="currentPassword"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 pt-5 flex items-center text-gray-500 cursor-pointer text-xl"
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="relative">
                  <label className="block font-medium text-gray-700 mb-1 text-sm">
                    Mật khẩu mới
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 pr-10"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 pt-5 flex items-center text-gray-500 cursor-pointer text-xl"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="relative">
                  <label className="block font-medium text-gray-700 mb-1 text-sm">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 pr-10"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 pt-5 flex items-center text-gray-500 cursor-pointer text-xl"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {!checkMatch && (
                  <div className="text-red-500 text-sm mt-1">
                    Mật khẩu không khớp
                  </div>
                )}

                {!checkLength ? (
                  <div className="text-red-500 text-sm mt-1">
                    Mật khẩu phải từ 6 đến 20 ký tự
                  </div>
                ) : null}
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-1 bg-gray-300 rounded w-full hover:bg-gray-400 transition-colors cursor-pointer text-[14px]"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!(checkLength && checkMatch)}
                    className={`px-4 py-1 rounded w-full transition-colors cursor-pointer text-[14px]
                        ${
                          checkLength && checkMatch
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }
                    `}
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserProfile;
