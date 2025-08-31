import React from "react";

import logoHocCungEm from "../assets/logoHocCungEm.png";
function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-400 flex items-center py-4 justify-between w-full px-10">
      <div className="flex items-center">
        <img src={logoHocCungEm} alt="Logo" className="w-12" />
        <h1 className="text-lg sm:text-lg lg:text-lg font-bold text-custom-blue leading-tight">
          Bình Dân Học Vụ
        </h1>
      </div>
      <div className="text-center text-sm text-gray-600">
        <p>&copy; 2025 Binh Dan Hoc Vu</p>
      </div>
      {/* điều khoản và chính sách bảo mật */}
      <div className="text-center text-sm text-gray-600 flex">
        <a href="#" className="mr-4">Điều khoản sử dụng</a>
        <a href="#">Chính sách bảo mật</a>
      </div>
    </footer>
  );
}

export default Footer;
