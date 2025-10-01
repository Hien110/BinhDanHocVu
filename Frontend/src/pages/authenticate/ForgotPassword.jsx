import React, { useState } from "react";

import { ROUTE_PATH } from "../../constants/routePath";

import userService from "../../services/userService";

import { toast } from "sonner";

import { Link, useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import logoHocCungEm from "../../assets/logoHocCungEm.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      setLoading(true);
      const result = await userService.resendOtp(email);

      if (result.success) {
        toast.success("Đã gửi mã OTP!");
        navigate(ROUTE_PATH.VERIFY, {
          state: {
            email,
            type: "forgot-password",
          },
        });
      } else {
        toast.error(result.message); // Hiển thị lỗi ở góc phải trên
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setLoading(false);
    }
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
          <div className="bg-blue-50 p-3 text-center border-b border-gray-200">
            <div className="flex justify-center mb-4">
              <img
                                src={logoHocCungEm}
                                alt="Logo"
                                className="w-20 h-20 rounded-full"
                              />
            </div>
            <h1 className="text-2xl font-bold text-custom-blue">
              LẤY LẠI MẬT KHẨU
            </h1>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div>
                <Button
                  loading={loading}
                  type="submit"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "10px 0",
                    backgroundColor: "#4A90E2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#357ABD",
                      transition: "transform 0.05s",
                      transform: "translateY(-0.5px)",
                    },
                  }}
                >
                  Lấy mã OTP
                </Button>
              </div>
            </form>
            <div className="text-sm text-center text-gray-600 mt-4">
              <Link
                to={ROUTE_PATH.LOGIN}
                className="text-custom-orange hover:text-custom-hover-orange font-medium"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>&copy; 2025 Binh Dan Hoc Vu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
