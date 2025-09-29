import React, { useEffect, useMemo, useState } from "react";

import courseService from "../../services/courseService";
import { ROUTE_PATH } from "../../constants/routePath";
import { Link } from "react-router-dom";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";

import SubjectSidebar from "../../components/SubjectSidebar";

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

const normalize = (str = "") =>
  str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Group mảng khóa học thành object theo subject (key là EN key như trong SUBJECT_MAPPING)
const groupBySubject = (arr = []) =>
  arr.reduce((acc, c) => {
    // nếu BE trả subject là key hợp lệ thì giữ, ngược lại đẩy vào Other1
    const key = c?.subject && SUBJECT_MAPPING[c.subject] ? c.subject : "Other1";
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

function BinhDanSoPage() {
  // CHÚ Ý: cần object { subjectKey: Course[] } để khớp render hiện tại
  const [courses, setCourses] = useState({}); // khởi tạo object, không để undefined/string
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await courseService.getTeachingCourses();
      // BE đang trả { data: [...], message: "..." }
      const arr = Array.isArray(res?.data) ? res.data : [];
      const grouped = groupBySubject(arr);
      setCourses(grouped);
    };
    fetchCourses();
  }, []);

  // Lọc theo tìm kiếm
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

      const filteredCourses = (courses[subject] || []).filter(
        (c) =>
          normalize(c?.instructor?.fullName || "").includes(q) ||
          normalize(c?.title || "").includes(q)
      );

      if (filteredCourses.length > 0) {
        result[subject] = filteredCourses;
      }
    }
    return result;
  }, [courses, searchTerm]);

  // Danh sách subject hiển thị (sau search + filter sidebar)
  const visibleSubjects = useMemo(() => {
    let keys = Object.keys(filteredBySearch || {});
    if (selectedSubject !== "ALL")
      keys = keys.filter((k) => k === selectedSubject);

    return keys.sort((a, b) => {
      const pa = SUBJECT_PRIORITY[a] ?? 100;
      const pb = SUBJECT_PRIORITY[b] ?? 100;
      if (pa !== pb) return pa - pb;

      const nameA = SUBJECT_MAPPING[a] || a;
      const nameB = SUBJECT_MAPPING[b] || b;
      return nameA.localeCompare(nameB, "vi");
    });
  }, [filteredBySearch, selectedSubject]);

  // Dữ liệu sidebar dựa trên kết quả tìm kiếm hiện tại
  const sidebarItems = useMemo(() => {
    const allKeys = Object.keys(SUBJECT_MAPPING).sort((a, b) => {
      const pa = SUBJECT_PRIORITY[a] ?? 100;
      const pb = SUBJECT_PRIORITY[b] ?? 100;
      if (pa !== pb) return pa - pb;
      const nameA = SUBJECT_MAPPING[a] || a;
      const nameB = SUBJECT_MAPPING[b] || b;
      return nameA.localeCompare(nameB, "vi");
    });

    return allKeys.map((key) => {
      const count = filteredBySearch?.[key]?.length || 0;
      return {
        key,
        label: SUBJECT_MAPPING[key],
        count,
        disabled: count === 0 && selectedSubject !== key,
      };
    });
  }, [filteredBySearch, selectedSubject]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header + Search */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Các khóa học giảng dạy miễn phí
          </h1>

          <div className="relative w-full ">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên môn học, giáo viên hoặc tên khóa học…"
              className="border border-gray-300 rounded-2xl px-4 py-2.5 pr-11 w-full bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
            />
            <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          </div>
        </div>

        {/* Layout 2 cột */}
        <div className="grid grid-cols-1 sm:grid-cols-[300px_minmax(0,1fr)] gap-6">
          {/* Sidebar trái */}
          <SubjectSidebar
            items={sidebarItems}
            selected={selectedSubject}
            onSelect={(key) => setSelectedSubject(key)}
            onClear={() => setSelectedSubject("ALL")}
          />

          {/* Nội dung phải */}
          <section className="flex-1">
            {visibleSubjects.length === 0 ? (
              <div className="text-center text-gray-600 py-16 bg-white border border-gray-200 rounded-2xl">
                Không tìm thấy khóa học phù hợp.
              </div>
            ) : (
              visibleSubjects.map((subject) => (
                <div key={subject} className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {SUBJECT_MAPPING[subject] || subject}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(filteredBySearch?.[subject] || []).map((course) => (
                      <div
                        key={course._id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md h-full flex flex-col"
                      >
                        <div className="overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full aspect-[3/2] object-cover transition-transform duration-500 hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>

                        {/* Nội dung kéo giãn còn lại để dồn cụm đáy */}
                        <div className="p-5 flex flex-col flex-1">
                          {/* Tiêu đề: luôn chiếm 2 dòng */}
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 min-h-[3.2rem] sm:min-h-[3.6rem]">
                            {course.title}
                          </h3>

                          {/* Giáo viên (nằm ở vùng nội dung giữa) */}
                          <div className="mb-2 text-sm">
                            <span className="text-gray-500">Giáo viên: </span>
                            <span className="font-medium text-gray-900">
                              {course?.instructor?.fullName || "N/A"}
                            </span>
                          </div>

                          {/* Cụm đáy: luôn dính đáy nhờ mt-auto */}
                          <div className="mt-auto">
                            <div className="mb-2 flex items-center text-sm">
                              <CalendarMonthIcon
                                fontSize="small"
                                className="text-gray-500 mr-1 shrink-0 w-4 h-4"
                              />
                              <span className="font-medium text-gray-900">
                                {course?.createdAt
                                  ? new Date(
                                      course.createdAt
                                    ).toLocaleDateString("vi-VN")
                                  : "N/A"}
                              </span>
                            </div>

                            <div className="mb-4 flex items-center text-sm">
                              <i className="fa-solid fa-eye text-gray-500 mr-2 ml-1 w-4 h-4 shrink-0"></i>
                              <span className="font-medium text-gray-900">
                                {course?.totalParticipant || 0} học viên
                              </span>
                            </div>

                            <Link
                              to={`${ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
                                ":courseId",
                                course._id
                              ).replace(
                                ":courseName",
                                course.title.replace(/\s+/g, "-").toLowerCase()
                              )}`}
                              className="relative inline-flex items-center justify-center w-full rounded-xl border border-custom-blue text-custom-blue font-medium px-4 py-2.5 overflow-hidden transition
              before:absolute before:inset-0 before:w-0 before:bg-blue-50 before:transition-all before:duration-300 hover:before:w-full"
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
          </section>
        </div>
      </main>
    </div>
  );
}

export default BinhDanSoPage;
