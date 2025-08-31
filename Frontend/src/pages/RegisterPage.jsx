import React, { useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { ROUTE_PATH } from "../constants/routePath";

import userService from "../services/userService";

import { toast } from "sonner";

import { red } from "@mui/material/colors";

import logoHocCungEm from "../assets/logoHocCungEm.png";
import owlStudent from "../assets/owlStudent.png";
import owlTeacher from "../assets/owlTeacher.png";

import { motion } from "framer-motion";

import { Button } from "@mui/material";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");

  const totalSteps = 2; // tổng số bước
  const progress = (step / totalSteps) * 100;

  const navigate = useNavigate();

  const passwordValid = useMemo(
    () => password.length >= 6 && password.length <= 20,
    [password]
  );

  const passwordsMatch = useMemo(
    () => (password && confirmPassword ? password === confirmPassword : true),
    [password, confirmPassword]
  );

  const canSubmit = useMemo(
    () => passwordValid && passwordsMatch && !!role && !loading,
    [passwordValid, passwordsMatch, role, loading]
  );

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const userData = Object.fromEntries(formData.entries());
    delete userData["confirm-password"];
    userData.role = role === "student" ? "student" : "lecturer";

    try {
      setLoading(true);
      const response = await userService.register(userData);

      if (response.success) {
        navigate(ROUTE_PATH.VERIFY, { state: { email: userData.email } });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Đăng ký thất bại");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChooseRole = (selected) => {
    setRole(selected);
  };

  const handleContinue = () => {
    if (!role) {
      toast.error("Vui lòng chọn vai trò trước khi tiếp tục");
      return;
    }
    setStep(2);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://khoinguonsangtao.vn/wp-content/uploads/2022/08/hinh-nen-powerpoint-hoc-tap-cac-dung-cu-hoc-tap.jpg')`,
      }}
    >
      {/* Lớp phủ mờ */}
      {/* <div className="absolute inset-0 opacity-100 bg-black z-1" /> */}

      {/* Container chính */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="login-container bg-white opacity-100 backdrop-blur-md rounded-xl overflow-hidden w-full max-w-md shadow-2xl transition-all hover:shadow-2xl border border-gray-100">
          {/* Header */}
          {step === 1 && (
            <div className="bg-blue-50 p-3 text-center border-b border-gray-200">
              <div className="flex justify-center mb-4">
                <img
                  src={logoHocCungEm}
                  alt="Logo"
                  className="w-20 h-20 rounded-full"
                />
              </div>
              <h1 className="text-2xl font-bold text-custom-blue">Bạn là ai</h1>
            </div>
          )}
          {step === 2 && (
            <div className="bg-blue-50 p-3 text-center border-b border-gray-200">
              <div className="flex justify-center mb-4">
                <img
                  src={logoHocCungEm}
                  alt="Logo"
                  className="w-20 h-20 rounded-full"
                />
              </div>
              <h1 className="text-2xl font-bold text-custom-blue">
                Đăng kí {role === "student" ? "học sinh" : "giáo viên"}
              </h1>
            </div>
          )}

          {/* Progress bar */}
          <div className="mx-4 my-6">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className="h-full bg-blue-600"
              />
            </div>
          </div>
          {/* Chọn vai trò đăng kí */}
          {step === 1 && (
            <div className="p-8 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "student", label: "Học sinh" },
                  { key: "teacher", label: "Giáo viên" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleChooseRole(opt.key)}
                    className={`cursor-pointer relative border rounded-2xl p-6 flex flex-col items-center text-center transition transform hover:shadow-sm
                    ${
                      role === opt.key
                        ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={opt.key === "student" ? owlStudent : owlTeacher}
                      alt={opt.label}
                      className="w-20 h-20 mb-3"
                    />
                    <div className="font-semibold text-gray-800">
                      {opt.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 italic">
                      {opt.key}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-center text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    to={ROUTE_PATH.LOGIN}
                    className="font-medium text-yellow-400 hover:text-yellow-500"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="px-4 py-2 rounded-lg bg-custom-blue text-white hover:bg-custom-hover-blue transition cursor-pointer"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Login Form */}

          {step === 2 && (
            <div className="p-8 pt-0">
              <form className="space-y-3" onSubmit={handleSubmit}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-custom-orange hover:underline cursor-pointer"
                >
                  ← Quay lại chọn vai trò
                </button>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ Và Tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-user text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                </div>

                {/* Giới tính */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giới tính
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-venus-mars text-gray-400" />
                    </div>
                    <select
                      id="gender"
                      name="gender"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border cursor-pointer"
                      required
                    >
                      <option value="" className="text-gray-400">
                        Chọn giới tính
                      </option>
                      <option value={true}>Nam</option>
                      <option value={false}>Nữ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                </div>
                {/* Chọn trường học với select */}
                <div>
                  <label
                    htmlFor="school"
                    className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
                  >
                    Chọn trường học
                  </label>

                  <div className="relative">
                    <i className="fa-solid fa-school absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <select
                      id="workplace"
                      name="workplace"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 pl-10 border cursor-pointer"
                      required
                    >
                      <option value="">Chọn trường học</option>
                      <option value="school1">Trường 1</option>
                      <option value="school2">Trường 2</option>
                      <option value="school3">Trường 3</option>
                    </select>
                  </div>
                </div>

                {/* Giới thiệu bản thân */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giới thiệu bản thân
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-user text-gray-400" />
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                      placeholder="Dạy môn ..., đã công tác ... năm, từng học tại ..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                      placeholder="Nhập mật khẩu"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePassword}
                    >
                      <i
                        className={`fas ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        } text-gray-400 hover:text-gray-600 cursor-pointer`}
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      name="confirm-password"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border"
                      placeholder="Nhập lại mật khẩu"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={toggleConfirmPassword}
                    >
                      <i
                        className={`fas ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        } text-gray-400 hover:text-gray-600 cursor-pointer`}
                      />
                    </button>
                  </div>
                </div>
                {!passwordsMatch && (
                  <div className="text-red-500 text-sm mt-1">
                    Mật khẩu không khớp
                  </div>
                )}
                {!passwordValid && (
                  <div className="text-red-500 text-sm mt-1">
                    Mật khẩu phải từ 6 đến 20 ký tự
                  </div>
                )}
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    loading={loading} // 👈 Thêm prop này
                    disableElevation
                    fullWidth
                    disabled={!canSubmit} // 👈 tránh user bấm khi đang loading
                    sx={{
                      py: "8px",
                      px: "16px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      borderRadius: "6px",
                      textTransform: "none",
                      color: "white",
                      bgcolor: canSubmit ? red[500] : "grey.400",
                      transition:
                        "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: canSubmit ? red[600] : "grey.400",
                        transform: canSubmit ? "translateY(-2px)" : "none",
                      },
                      "&.Mui-disabled": {
                        color: "white",
                        bgcolor: "grey.400",
                        cursor: "not-allowed",
                        opacity: 1,
                      },
                    }}
                  >
                    {!loading && (
                      <i
                        className="fas fa-sign-in-alt"
                        style={{ marginRight: 8 }}
                      />
                    )}
                    {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
                  </Button>
                </div>
              </form>

              <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                <div className="text-center text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    to={ROUTE_PATH.LOGIN}
                    className="font-medium text-yellow-400 hover:text-yellow-500"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
                <div className="text-sm"></div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>&copy; 2025 Binh Dan Hoc Vu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
