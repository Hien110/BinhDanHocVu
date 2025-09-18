// src/layouts/RoleLayoutSwitcher.jsx
import React from "react";
import userService from "../services/userService";
import AdminLayout from "./admin-layout";
import LecturerLayout from "./lecturer-layout";

export default function RoleLayoutSwitcher(props) {
  // Đọc user mỗi lần render
  const currentUser = userService.getCurrentUser();
  const Layout = currentUser?.role === "admin" ? AdminLayout : LecturerLayout;

  // Phòng thủ: nếu vì lý do gì đó Layout không tồn tại
  const SafeLayout = Layout || React.Fragment;

  return <SafeLayout>{props?.children}</SafeLayout>;
}
