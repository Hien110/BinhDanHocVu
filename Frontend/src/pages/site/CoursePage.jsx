import React, { useEffect, useMemo, useState } from "react";

import courseService from "../../services/courseService";
import { ROUTE_PATH } from "../../constants/routePath";

import { Link } from "react-router-dom";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";

// Hiển thị tên môn học
const SUBJECT_MAPPING = Object.freeze({
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

// Thứ tự ưu tiên (Math 1, Văn 2, Anh 3, KHTN 4, LS&ĐL 5, GDCD 6, Tin 7, CN 8, Khác cuối)
const SUBJECT_PRIORITY = Object.freeze({
  Math: 1,
  Literature: 2,
  English: 3,
  NaturalSciences: 4,
  HistoryAndGeography: 5,
  CivicEducation: 6,
  InformationTechnology: 7,
  Technology: 8,
  Other: 9999,
});

function CoursePage() {
  const [courses, setCourses] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await courseService.getAllCourses();
      setCourses(response?.data || {});
    };
    fetchCourses();
  }, []);

  const normalize = (str = "") =>
    str
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const allSubjects = useMemo(() => Object.keys(courses || {}), [courses]);

  // Lọc theo search:
  // - Nếu khớp tên môn (EN key hoặc tên TV) -> giữ nguyên TẤT CẢ khóa của môn đó
  // - Nếu KHÔNG khớp tên môn -> lọc theo giáo viên trong từng khóa
  const filteredBySearch = useMemo(() => {
    const q = normalize(searchTerm);
    if (!q) return courses;

    const result = {};
    for (const subject of Object.keys(courses || {})) {
      const viName = SUBJECT_MAPPING[subject] || subject;
      const isSubjectMatch =
        normalize(subject).includes(q) || normalize(viName).includes(q);

      if (isSubjectMatch) {
        result[subject] = courses[subject];
        continue;
      }

      // Lọc theo giáo viên
      const filteredCourses = (courses[subject] || []).filter((c) =>
        normalize(c?.instructor?.fullName || "").includes(q)
        // Nếu muốn cho phép tìm theo tên khóa học, mở thêm điều kiện sau:
        // || normalize(c?.title || "").includes(q)
      );

      if (filteredCourses.length > 0) {
        result[subject] = filteredCourses;
      }
    }
    return result;
  }, [courses, searchTerm]);

  const visibleSubjects = useMemo(() => {
    let keys = Object.keys(filteredBySearch || {});
    if (selectedSubject !== "ALL") {
      keys = keys.filter((k) => k === selectedSubject);
    }

    // sắp theo ưu tiên; nếu bằng nhau thì theo tên TV
    return keys.sort((a, b) => {
      const pa = SUBJECT_PRIORITY[a] ?? 100;
      const pb = SUBJECT_PRIORITY[b] ?? 100;
      if (pa !== pb) return pa - pb;

      const nameA = SUBJECT_MAPPING[a] || a;
      const nameB = SUBJECT_MAPPING[b] || b;
      return nameA.localeCompare(nameB, "vi");
    });
  }, [filteredBySearch, selectedSubject]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Filter buttons */}
        <div className="overflow-x-auto mb-4 text-sm">
          <div className="flex space-x-3 w-max">
            <button
              onClick={() => setSelectedSubject("ALL")}
              className={`font-semibold py-2 px-4 rounded-lg border cursor-pointer whitespace-nowrap transition
                ${
                  selectedSubject === "ALL"
                    ? "bg-custom-blue text-white border-custom-blue"
                    : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
                }`}
            >
              Tất cả
            </button>

            {Object.keys(SUBJECT_MAPPING)
              .sort((a, b) => {
                const pa = SUBJECT_PRIORITY[a] ?? 100;
                const pb = SUBJECT_PRIORITY[b] ?? 100;
                if (pa !== pb) return pa - pb;
                const nameA = SUBJECT_MAPPING[a] || a;
                const nameB = SUBJECT_MAPPING[b] || b;
                return nameA.localeCompare(nameB, "vi");
              })
              .map((key) => {
                const isActive = selectedSubject === key;
                const hasData = (courses?.[key]?.length || 0) > 0;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSubject(key)}
                    disabled={!hasData && selectedSubject !== key}
                    className={`font-semibold py-1 px-2 rounded-lg border whitespace-nowrap transition cursor-pointer
                      ${
                        isActive
                          ? "bg-custom-blue text-white border-custom-blue"
                          : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
                      }
                      ${
                        !hasData && !isActive
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                    title={
                      hasData
                        ? SUBJECT_MAPPING[key]
                        : `${SUBJECT_MAPPING[key]} (chưa có khóa học)`
                    }
                  >
                    {SUBJECT_MAPPING[key]}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Search box: môn học hoặc giáo viên */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên môn học hoặc giáo viên…"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Các khóa học phổ biến
        </h2>

        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            {visibleSubjects.length === 0 ? (
              <div className="text-center text-gray-600 py-10">
                Không tìm thấy khóa học phù hợp.
              </div>
            ) : (
              visibleSubjects.map((subject) => (
                <div key={subject} className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {SUBJECT_MAPPING[subject] || subject}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(filteredBySearch?.[subject] || []).map((course) => (
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
                          <h3 className="text-xl font-bold text-gray-800 mb-3">
                            {course.title}
                          </h3>

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
                                ? new Date(course.createdAt).toLocaleDateString(
                                    "vi-VN"
                                  )
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
      </main>
    </div>
  );
}

export default CoursePage;
