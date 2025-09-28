import React, { useEffect, useMemo, useState } from "react";

import courseService from "../../services/courseService";
import userService from "../../services/userService";
import { ROUTE_PATH } from "../../constants/routePath";

import CourseCard from "../../components/CourseCard";

// --- tiện ích: bỏ dấu tiếng Việt & lower-case để search "không phân biệt dấu" ---
const stripVN = (s = "") =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

// Bảng quy đổi subject -> tiếng Việt (learning & binhdanso khác nhau ở Technology)
const LABELS_LEARNING = {
  Math: "Toán học",
  Literature: "Ngữ văn",
  English: "Tiếng Anh",
  CivicEducation: "Giáo dục công dân",
  HistoryAndGeography: "Lịch sử và Địa Lý",
  NaturalSciences: "Khoa học tự nhiên",
  Technology: "Công nghệ",
  InformationTechnology: "Tin học",
  Other: "Khác",
};

const LABELS_BINHDANSO = {
  BasicDigitalSkills: "Kỹ năng số cơ bản",
  PublicServices: "Dịch vụ công & hành chính số",
  Finance: "Tài chính – Ngân hàng số",
  Health: "Ứng dụng y tế & an sinh xã hội số",
  Safety: "An toàn thông tin & Phòng chống lừa đảo",
  Education: "Ứng dụng học tập & giảng dạy số",
  Technology: "Thương mại & dịch vụ trực tuyến", // khác với learning
  DigitalLifeSkills: "Kỹ năng sống số & Quảng bá văn hóa và thành tựu sản xuất",
  Other1: "Khác",
};

// Trả về nhãn tiếng Việt theo subject + type
const getSubjectLabel = (subjectCode, typeCode = "learning") => {
  if (typeCode === "binhdanso") {
    return LABELS_BINHDANSO[subjectCode] || subjectCode || "Khác";
  }
  return LABELS_LEARNING[subjectCode] || subjectCode || "Khác";
};

function ManageCoursesListPage() {
  const [courses, setCourses] = useState([]); // dữ liệu phẳng từ API
  const [search, setSearch] = useState(""); // giá trị input tìm kiếm
  const [selectedSubject, setSelectedSubject] = useState(""); // bộ lọc subject
  const [loading, setLoading] = useState(false);

  const instructorId = userService.getCurrentUser()?._id;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await courseService.getCoursesByInstructor(instructorId);
      if (result?.success) setCourses(result.data || []);
      else console.error(result?.message);
      setLoading(false);
    };
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorId]);

  // Lọc theo title (không phân biệt dấu) và theo subject
  const filtered = useMemo(() => {
    const q = stripVN(search);
    return courses.filter((c) => {
      const matchTitle = !q || stripVN(c?.title || "").includes(q);
      const matchSubject = !selectedSubject
        ? true
        : getSubjectLabel(c?.subject, c?.type) === selectedSubject;
      return matchTitle && matchSubject;
    });
  }, [courses, search, selectedSubject]);

  // Nhóm theo subject + type để tránh đè nhau (vd: Technology ở 2 hệ)
  const groups = useMemo(() => {
    const map = new Map();
    for (const c of filtered) {
      const subject = c?.subject || "Other";
      const type = c?.type || "learning";
      const key = `${subject}__${type}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    return Array.from(map.entries())
      .map(([key, list]) => {
        const [subjectCode, typeCode] = key.split("__");
        const label = getSubjectLabel(subjectCode, typeCode);
        return {
          key,
          subjectCode,
          typeCode,
          label,
          courses: [...list].sort(
            (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
          ),
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label, "vi"));
  }, [filtered]);

  const totalCourses = filtered.length;

  // Danh sách subject duy nhất (theo dữ liệu đã tải) để đưa vào dropdown lọc
  const subjectOptions = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => set.add(getSubjectLabel(c?.subject, c?.type)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "vi"));
  }, [courses]);

  return (
    <div className="">
      <div className="max-w-screen mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
          Danh sách môn học
        </h1>

        {/* Thanh tìm kiếm + Bộ lọc */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm theo tên môn học…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Tất cả môn học</option>
              {subjectOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 italic">Đang tải…</p>
        ) : totalCourses === 0 ? (
          <p className="text-gray-500 italic">
            {search || selectedSubject
              ? "Không tìm thấy môn học phù hợp."
              : "Bạn chưa có khóa học nào."}
          </p>
        ) : (
          <div className="space-y-10">
            {groups.map((group) => (
              <section key={group.key}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {group.label}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {group.courses.length} khóa học
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 max-w-[250px] px-4 py-1 ">
        <button
          className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-custom-blue transition-colors duration-500 ease-in-out hover:bg-custom-hover-blue cursor-pointer shadow-md"
          onClick={() =>
            (window.location.href = ROUTE_PATH.LECTURER_CREATE_COURSE)
          }
        >
          <span className="text-lg mr-2">+</span>
          Tạo môn học mới
        </button>
      </div>
    </div>
  );
}

export default ManageCoursesListPage;
