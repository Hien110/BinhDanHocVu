import React, { useState } from "react";
import { toast } from "sonner";

import { ROUTE_PATH } from "../constants/routePath";

import userService from "../services/userService";

import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { Link } from "react-router-dom";

import Button from "@mui/material/Button";

import logoHocCungEm from "../assets/logoHocCungEm.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lấy user từ sessionStorage (nếu có)
  const userData = userService.getCurrentUser();
  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    userService.logout();
    window.location.href = ROUTE_PATH.HOME; // Chuyển hướng về trang chủ
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-100/30 backdrop-blur-md shadow-md px-8 py-4 sm:py-5">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logoHocCungEm} alt="Logo" className="h-8" />
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-custom-blue leading-tight">
            BÌNH DÂN HỌC VỤ
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:block z-10">
          <ul className="flex items-center space-x-6 lg:space-x-10">
            <li>
              <Link
                to={ROUTE_PATH.HOME}
                className=" font-medium hover:text-custom-blue transition-colors"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to={ROUTE_PATH.COURSE}
                className="text-black font-medium hover:text-custom-blue transition-colors"
              >
                Khóa học
              </Link>
            </li>
            <li>
              <Link
                to={ROUTE_PATH.TEST_QUIZ_LIST}
                className="text-black font-medium hover:text-custom-blue transition-colors"
              >
                Giáo viên
              </Link>
            </li>
          </ul>
        </nav>

        {/* User menu (luôn hiển thị cả mobile & desktop) */}
        <div className="flex items-center space-x-2">
          {userData ? (
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="rounded-full py-1 px-3 text-custom-blue cursor-pointer outline-none transition duration-300 hover:shadow-md hover:bg-[#DDECFF] border border-custom-blue flex items-center text-sm lg:text-base">
                <PersonIcon className="inline-block mr-1 sm:mr-2" />
                <span className="truncate max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]">
                  {userData.fullName || userData.email}
                </span>
              </MenuButton>

              {/* Dropdown */}
              <MenuItems className="absolute outline-none right-0 z-10 mt-2 w-64 sm:w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
                <div className="py-1">
                  <MenuItem>
                    <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                      <AccountCircleIcon
                        className="mr-2 text-custom-blue"
                        style={{ fontSize: "36px" }}
                      />
                      <div>
                        <span className="font-normal">Xin chào,</span>
                        <br />
                        <span className="text-custom-blue font-semibold text-base sm:text-lg">
                          {userData.name || userData.email}
                        </span>
                      </div>
                    </div>
                  </MenuItem>
                </div>

                {userData.role !== "admin" && (
                  <div className="py-1">
                    <MenuItem>
                      <Link
                        to={ROUTE_PATH.USER_PROFILE}
                        state={{ user: userData }}
                        className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <AssignmentIndOutlinedIcon className="inline mr-2 group-hover:animate-slide-profile" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                    </MenuItem>
                  </div>
                )}

                {userData.role == "lecturer" && (
                  <div className="py-1">
                    <MenuItem>
                      <Link
                        to={ROUTE_PATH.LECTURER_STATISTICS}
                        state={{ user: userData }}
                        className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BookOutlinedIcon className="inline mr-2 group-hover:animate-slide-profile" />
                        <span>Quản lý giảng dạy</span>
                      </Link>
                    </MenuItem>
                  </div>
                )}

                {userData.role === "admin" && (
                  <div className="py-1">
                    <MenuItem>
                      <Link
                        to={ROUTE_PATH.ADMIN_STATISTICS}
                        className="group block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BookOutlinedIcon className="inline mr-2 group-hover:animate-slide-profile" />
                        Quản lý hệ thống
                      </Link>
                    </MenuItem>
                  </div>
                )}
                <div className="py-1">
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="group w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogoutIcon className="inline mr-2 group-hover:animate-slide-shake" />
                      Đăng xuất
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    color: "#4A90E2",
                    px: 2,
                    fontSize: "0.85rem",
                  }}
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    color: "#FFFFFF",
                    px: 2,
                    fontSize: "0.85rem",
                    borderColor: "#4A90E2",
                    backgroundColor: "#4A90E2",
                    "&:hover": {
                      backgroundColor: "#357ABD",
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            <i className="fas fa-bars text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <ul className="flex flex-col">
            <li>
              <Link
                to={ROUTE_PATH.HOME}
                className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-100 text-red-600 font-semibold"
                onClick={toggleMenu}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to={ROUTE_PATH.COURSE}
                className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-100 text-red-600 font-semibold"
                onClick={toggleMenu}
              >
                Môn học
              </Link>
            </li>
            <li>
              <Link
                to={ROUTE_PATH.TEST_QUIZ_LIST}
                className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-100 text-red-600 font-semibold"
                onClick={toggleMenu}
              >
                Ôn luyện
              </Link>
            </li>
            <li>
              <Link
                to={ROUTE_PATH.NEWS}
                className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-100 text-red-600 font-semibold"
                onClick={toggleMenu}
              >
                Tin tức
              </Link>
            </li>
            {userData && (
              <li>
                <Link
                  to={ROUTE_PATH.USER_PROFILE}
                  className="block px-4 py-3 hover:bg-gray-100 text-red-600 font-semibold"
                  onClick={toggleMenu}
                >
                  Hồ sơ cá nhân
                </Link>
              </li>
            )}
            {userData ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500 font-semibold cursor-pointer"
                >
                  Đăng xuất
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-3 hover:bg-gray-100 text-red-600 font-semibold cursor-pointer"
                  onClick={toggleMenu}
                >
                  Đăng nhập
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
