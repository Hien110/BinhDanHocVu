import React, { useEffect, useState } from "react";

import courseService from "../services/courseService";
import CourseCard from "../components/CourseCard";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function CoursePage() {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await courseService.getAllCourses();
      setCourse(response.data);
    };

    fetchCourse();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Marquee Section */}
      <main className="container mx-auto px-4 py-8">
        {/* Dãy danh sách môn học theo chiều ngang để filter */}
        <div className="overflow-x-auto mb-4">
          <div className="flex space-x-4">
            <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">
              Tất cả
            </button>
            <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">
              Toán học
            </button>
            <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">
              Vật lý
            </button>
            <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">
              Hóa học
            </button>
            <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">
              Tiếng Anh
            </button>
          </div>
        </div>

        {/*  nút tìm kiếm khóa học */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Các khóa học phổ biến
        </h2>
        <section class="py-8 bg-white">
          <div class="container mx-auto px-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-800">Học vụ số</h2>
              <a href="#" class="text-custom-blue font-medium hover:underline">
                Xem tất cả
                <ArrowForwardIcon className="inline-block ml-1" />
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Toán học"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Toán nâng cao lớp 10
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học giúp học sinh nắm vững kiến thức toán nâng cao,
                    chuẩn bị cho các kỳ thi học sinh giỏi.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Vật lý"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Vật lý đại cương
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học cung cấp kiến thức nền tảng về vật lý, phù hợp với
                    học sinh THPT và sinh viên năm nhất.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Tiếng Anh"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Tiếng Anh giao tiếp cơ bản
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học giúp bạn tự tin giao tiếp tiếng Anh trong các tình
                    huống hàng ngày chỉ sau 3 tháng.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="py-8 bg-white">
          <div class="container mx-auto px-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-800">Toán</h2>
              <a href="#" class="text-custom-blue font-medium hover:underline">
                Xem tất cả
                <ArrowForwardIcon className="inline-block ml-1" />
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Toán học"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Toán nâng cao lớp 10
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học giúp học sinh nắm vững kiến thức toán nâng cao,
                    chuẩn bị cho các kỳ thi học sinh giỏi.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Vật lý"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Vật lý đại cương
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học cung cấp kiến thức nền tảng về vật lý, phù hợp với
                    học sinh THPT và sinh viên năm nhất.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Tiếng Anh"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Tiếng Anh giao tiếp cơ bản
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học giúp bạn tự tin giao tiếp tiếng Anh trong các tình
                    huống hàng ngày chỉ sau 3 tháng.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="py-8 bg-white">
          <div class="container mx-auto px-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-800">Vật lý</h2>
              <a href="#" class="text-custom-blue font-medium hover:underline">
                Xem tất cả
                <ArrowForwardIcon className="inline-block ml-1" />
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Toán học"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Toán nâng cao lớp 10
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học giúp học sinh nắm vững kiến thức toán nâng cao,
                    chuẩn bị cho các kỳ thi học sinh giỏi.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Vật lý"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Vật lý đại cương
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học cung cấp kiến thức nền tảng về vật lý, phù hợp với
                    học sinh THPT và sinh viên năm nhất.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                  alt="Tiếng Anh"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2"></div>
                  <h3 class="text-xl font-bold text-gray-800 mb-3">
                    Tiếng Anh giao tiếp cơ bản
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    Khóa học giúp bạn tự tin giao tiếp tiếng Anh trong các tình
                    huống hàng ngày chỉ sau 3 tháng.
                  </p>
                  <div className="mb-4">
                    <span class="text-gray-500">Giáo viên: </span>
                    <span class="font-medium text-gray-800">Nguyễn Văn A</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <a
                      href="#"
                      class="text-custom-blue font-medium border border-custom-blue hover:bg-blue-50 cursor-pointer rounded-lg px-2 py-1"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CoursePage;
