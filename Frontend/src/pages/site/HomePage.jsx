import React, { useEffect, useMemo, useState } from "react";

import courseService from "../../services/courseService";
import { ROUTE_PATH } from "../../constants/routePath";

import { motion } from "framer-motion";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";

// Tên hiển thị môn học (ổn định reference)
const SUBJECT_MAPPING = Object.freeze({
  BinhDanSo: "Bình dân số",
  Math: "Toán học",
  Literature: "Ngữ văn",
  English: "Tiếng Anh",
  CivicEducation: "Giáo dục công dân",
  HistoryAndGeography: "Lịch sử và Địa Lý",
  NaturalSciences: "Khoa học tự nhiên",
  Technology: "Công nghệ",
  InformationTechnology: "Tin học",
  Other: "Khác",
});

// Thứ tự ưu tiên (số nhỏ đứng trước)
// Other để 9999 để luôn cuối
const SUBJECT_PRIORITY = Object.freeze({
  BinhDanSo: 1,
  Math: 2,
  Literature: 3,
  English: 4,
  NaturalSciences: 5,
  HistoryAndGeography: 6,
  CivicEducation: 7,
  InformationTechnology: 8,
  Technology: 9,
  Other: 9999,
});

function HomePage() {
  // courses dạng: { [subject]: Course[] }
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getTop3CoursesBySubject();
        const payload =
          (response && response.data && response.data.data) || response?.data || {};
        setCourses(payload || {});
      } catch (e) {
        console.error(e);
        setError("Không thể tải danh sách khóa học.");
        setCourses({});
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const sortedSubjects = useMemo(() => {
    const keys = Object.keys(courses || {});
    if (keys.length === 0) return [];

    return keys.sort((a, b) => {
      const pa = SUBJECT_PRIORITY[a] ?? 100;    // mặc định 100 cho môn lạ
      const pb = SUBJECT_PRIORITY[b] ?? 100;

      if (pa !== pb) return pa - pb;

      // fallback: sort giữa theo tên hiển thị TV
      const nameA = SUBJECT_MAPPING[a] || a;
      const nameB = SUBJECT_MAPPING[b] || b;
      return nameA.localeCompare(nameB, "vi");
    });
  }, [courses]);

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
              Bình Dân Học Vụ mang đến cơ hội học tập chất lượng cao hoàn toàn miễn phí.
              Tham gia ngay để khám phá hàng trăm khóa học từ các giáo viên tâm huyết.
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
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
              alt="Học sinh học tập"
              className="rounded-xl shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Các khóa học phổ biến
      </h2>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-600 py-10">Đang tải…</div>
          ) : error ? (
            <div className="text-center text-red-600 py-10">{error}</div>
          ) : sortedSubjects.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              Chưa có khóa học để hiển thị.
            </div>
          ) : (
            sortedSubjects.map((subject) => (
              <div key={subject} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {SUBJECT_MAPPING[subject] || subject}
                  </h3>
                  <a
                    href="/khoa-hoc"
                    className="text-custom-blue font-medium hover:underline"
                  >
                    Xem tất cả
                    <ArrowForwardIcon className="inline-block ml-1" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {(courses?.[subject] || []).map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300 transform hover:translate-y-1"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="group-hover:scale-105 transition-transform duration-500 rounded-xl w-full aspect-[3/2] object-cover"
                      />
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-gray-800 mb-3">
                          {course.title}
                        </h4>

                        <div className="mb-4 text-sm">
                          <span className="text-gray-500">Giáo viên: </span>
                          <span className="font-medium text-gray-800">
                            {course?.instructor?.fullName || "N/A"}
                          </span>
                        </div>

                        <div className="mb-4 flex flex-row items-center text-sm">
                          <CalendarMonthIcon
                            fontSize="small"
                            className="text-gray-500 mr-1 w-4 h-4"
                          />
                          <span className="font-medium text-gray-800">
                            {course?.createdAt
                              ? new Date(course.createdAt).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center w-full">
                          <Link
                            to={`${ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
                              ":courseId",
                              course._id
                            ).replace(
                              ":courseName",
                              course.title.replace(/\s+/g, "-").toLowerCase()
                            )}`}
                            className="relative w-full text-center text-custom-blue font-medium border border-custom-blue cursor-pointer rounded-lg px-4 py-2 overflow-hidden
                            before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-blue-50 before:transition-all before:duration-300 before:z-0
                            hover:before:w-full"
                          >
                            <span className="relative z-10 text-sm">
                              Xem chi tiết{" "}
                              <ArrowForwardTwoToneIcon
                                fontSize="inherit"
                                className="inline-block pb-0.5"
                              />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
