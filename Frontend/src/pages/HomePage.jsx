import React, { useEffect, useState } from "react";

import courseService from "../services/courseService";
import CourseCard from "../components/CourseCard";

import { motion } from "framer-motion";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function HomePage() {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await courseService.getAllCourses();
      setCourse(response.data);
    };

    fetchCourse();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner hình ảnh */}
      {/* <div className="p-4 px-10 mt-0">
        <motion.img
          src="https://inoxnamcuong.vn/wp-content/uploads/2022/08/146_chao_mung_75_nam_quoc_khanh_2_9_greenair_viet_nam-1.jpg"
          alt="Banner"
          className="w-full h-90 rounded-lg shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div> */}

      {/* Marquee Section */}
      {/* <div className="bg-white/30 backdrop-blur-md sm:py-3 fixed top-15 w-full z-10">
        <div className="animate-marquee font-medium flex space-x-12 px-4">
          <span>
            Học để biết – Biết để làm – Làm để sống tốt hơn
          </span>
          <span>Tri thức cho mọi người, học tập cho mọi nhà</span>
          <span>Học tập suốt đời – Bắt đầu từ hôm nay</span>
        </div>
      </div> */}
      {/* <main className="container mx-auto px-4 py-16"></main> */}

      <section className="bg-gradient-to-br from-indigo-600 to-emerald-500 text-white py-16 md:py-24 rounded-lg mb-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Học tập miễn phí cho mọi người
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Bình Dân Học Vụ mang đến cơ hội học tập chất lượng cao hoàn toàn
              miễn phí. Tham gia ngay để khám phá hàng trăm khóa học từ các giáo
              viên tâm huyết.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#explore"
                className="px-8 py-3 text-custom-hover-orange border border-custom-orange bg-white font-bold rounded-lg text-center hover:bg-custom-hover-orange hover:text-white transition"
              >
                Khám phá khóa học
              </a>
              <a
                href="#become-teacher"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg text-center hover:bg-white/70 hover:text-custom-blue transition"
              >
                Trở thành giáo viên
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
              alt="Học sinh học tập"
              className="rounded-xl shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

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
                  Khóa học giúp học sinh nắm vững kiến thức toán nâng cao, chuẩn
                  bị cho các kỳ thi học sinh giỏi.
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
                  Khóa học giúp học sinh nắm vững kiến thức toán nâng cao, chuẩn
                  bị cho các kỳ thi học sinh giỏi.
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
                  Khóa học giúp học sinh nắm vững kiến thức toán nâng cao, chuẩn
                  bị cho các kỳ thi học sinh giỏi.
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Cách thức hoạt động
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 shadow-sm rounded-lg hover:shadow-md transition">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search text-custom-blue text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                1. Tìm kiếm khóa học
              </h3>
              <p className="text-gray-600">
                Khám phá hàng trăm khóa học miễn phí ở nhiều lĩnh vực khác nhau
                phù hợp với nhu cầu của bạn.
              </p>
            </div>

            <div className="text-center p-6 shadow-sm rounded-lg hover:shadow-md transition">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-user-plus text-emerald-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                2. Đăng ký học
              </h3>
              <p className="text-gray-600">
                Đăng ký chỉ với vài cú nhấp chuột, không cần thanh toán, hoàn
                toàn miễn phí.
              </p>
            </div>

            <div className="text-center p-6 shadow-sm rounded-lg hover:shadow-md transition">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-graduation-cap text-amber-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                3. Bắt đầu học tập
              </h3>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-blue-100  ">
        <div className=" text-center">
          <h2 className="text-2xl font-bold mb-6">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Tham gia ngay cùng các bạn học sinh đang học tập miễn phí trên Bình
            Dân Học Vụ
          </p>
          <a
            href="#"
            className="inline-block px-8 py-3 bg-white text-custom-blue font-bold rounded-lg hover:bg-gray-100 transition"
          >
            Đăng ký ngay
          </a>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
