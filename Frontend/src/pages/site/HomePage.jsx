import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import courseService from "../../services/courseService";
import { ROUTE_PATH } from "../../constants/routePath";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";
import SchoolIcon from "@mui/icons-material/School";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

/* ===================== Constants / Helpers ===================== */

// Map tên hiển thị (kết hợp nhóm Bình dân số + môn học phổ thông)
const SUBJECT_MAPPING = Object.freeze({
  // Bình dân số
  BasicDigitalSkills: "Kỹ năng số cơ bản",
  PublicServices: "Dịch vụ công & hành chính số",
  Finance: "Tài chính – Ngân hàng số",
  Health: "Ứng dụng y tế & an sinh xã hội số",
  Safety: "An toàn thông tin & Phòng chống lừa đảo",
  Education: "Ứng dụng học tập & giảng dạy số",
  TechnologyAdmin: "Thương mại & dịch vụ trực tuyến",
  DigitalLifeSkills: "Kỹ năng sống số & Quảng bá văn hóa và thành tựu sản xuất",
  Other1: "Khác",

  // Khối học phổ thông
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

// Sắp xếp chủ đề ưu tiên hiển thị
const SUBJECT_PRIORITY = Object.freeze({
  // Ưu tiên nhóm BĐS trước
  BasicDigitalSkills: 1,
  PublicServices: 2,
  Finance: 3,
  Health: 4,
  Safety: 5,
  Education: 6,
  TechnologyAdmin: 7,
  DigitalLifeSkills: 8,
  Other1: 99,

  // Học miễn phí (learning)
  Math: 11,
  Literature: 12,
  English: 13,
  NaturalSciences: 14,
  HistoryAndGeography: 15,
  CivicEducation: 16,
  InformationTechnology: 17,
  Technology: 18,
  Other: 99,
});

// Gom mảng → object { subjectKey: Course[] }
const groupBySubject = (arr = []) =>
  arr.reduce((acc, c) => {
    const key = c?.subject && SUBJECT_MAPPING[c.subject] ? c.subject : "Other1";
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

// Chuẩn hóa response về mảng
const pickArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

// Check “Mới” trong N ngày
const isNewWithinDays = (dateStr, days = 14) => {
  if (!dateStr) return false;
  const created = new Date(dateStr).getTime();
  if (Number.isNaN(created)) return false;
  const diffDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

/* ===================== Page ===================== */

export default function HomePage() {
  // Dữ liệu 2 khối
  const [bdsCourses, setBdsCourses] = useState([]); // type: binhdanso
  const [learningCourses, setLearningCourses] = useState([]); // type: learning

  const [loadingBds, setLoadingBds] = useState(true);
  const [loadingLearning, setLoadingLearning] = useState(true);

  const [errorBds, setErrorBds] = useState("");
  const [errorLearning, setErrorLearning] = useState("");

  useEffect(() => {
    // Bình dân số
    (async () => {
      try {
        setLoadingBds(true);
        const res = await courseService.getBinhDanSoCourses();
        setBdsCourses(pickArray(res));
      } catch (e) {
        setErrorBds("Không thể tải danh sách khóa học bình dân số.");
        setBdsCourses([]);
      } finally {
        setLoadingBds(false);
      }
    })();

    // Giảng dạy miễn phí (learning)
    (async () => {
      try {
        setLoadingLearning(true);

        // Nếu có API riêng:
        if (typeof courseService.getTeachingCourses === "function") {
          const resFree = await courseService.getTeachingCourses();
          setLearningCourses(pickArray(resFree));
        } else {
          // Fallback từ all → filter
          const resAll = await courseService.getAllCourses?.();
          const all = pickArray(resAll);
          setLearningCourses(all.filter((c) => c?.type === "learning"));
        }
      } catch (e) {
        setErrorLearning(
          "Không thể tải danh sách khóa học giảng dạy miễn phí."
        );
        setLearningCourses([]);
      } finally {
        setLoadingLearning(false);
      }
    })();
  }, []);

  // Nhóm theo subject & sắp thứ tự hiển thị
  const bdsGroupedSorted = useMemo(() => {
    const grouped = groupBySubject(bdsCourses);
    return Object.keys(grouped)
      .sort(
        (a, b) => (SUBJECT_PRIORITY[a] ?? 1000) - (SUBJECT_PRIORITY[b] ?? 1000)
      )
      .reduce((acc, k) => ((acc[k] = grouped[k]), acc), {});
  }, [bdsCourses]);

  const learningGroupedSorted = useMemo(() => {
    const grouped = groupBySubject(learningCourses);
    return Object.keys(grouped)
      .sort(
        (a, b) => (SUBJECT_PRIORITY[a] ?? 1000) - (SUBJECT_PRIORITY[b] ?? 1000)
      )
      .reduce((acc, k) => ((acc[k] = grouped[k]), acc), {});
  }, [learningCourses]);

  // Tính vài con số demo từ dữ liệu để show Stats
  const totalCourses =
    (bdsCourses?.length || 0) + (learningCourses?.length || 0);
  const totalTeachers = countDistinct(
    [...bdsCourses, ...learningCourses]
      .map((c) => c?.instructor?.fullName)
      .filter(Boolean)
  );
  const totalLearners = (learningCourses || []).reduce(
    (sum, c) => sum + (Number(c?.totalParticipants) || 0),
    0
  );
  const totalViews = (bdsCourses || []).reduce(
    (sum, c) => sum + (Number(c?.viewCount) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-indigo-600 to-emerald-500 text-white py-16 md:py-24 rounded-lg mb-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Học tập miễn phí cho mọi người
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Bình Dân Học Vụ mang đến cơ hội học tập chất lượng cao hoàn toàn
              miễn phí. Tham gia ngay để khám phá các khóa học thực tế, an toàn,
              hữu ích cho mọi lứa tuổi.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#bds"
                className="px-8 py-3 border border-white bg-white text-indigo-700 font-bold rounded-lg text-center hover:bg-indigo-50 transition"
              >
                Khám phá Bình dân số
              </a>
              <a
                href="#learning"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg text-center hover:bg-white/10 transition"
              >
                Khoá học miễn phí
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* ======= SECTION: BÌNH DÂN SỐ ======= */}
        <SectionBlock
          id="bds"
          title="Các khóa học Bình dân số"
          groupedCourses={bdsGroupedSorted}
          loading={loadingBds}
          error={errorBds}
          emptyText="Chưa có khóa học Bình dân số."
        />

        {/* Divider */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-gray-400 text-sm uppercase tracking-wider">
            Tiếp theo
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* ======= SECTION: GIẢNG DẠY MIỄN PHÍ ======= */}
        <SectionBlock
          id="learning"
          title="Các khóa học giảng dạy miễn phí"
          groupedCourses={learningGroupedSorted}
          loading={loadingLearning}
          error={errorLearning}
          emptyText="Chưa có khóa học giảng dạy miễn phí."
        />

        {/* ======= EXTRA CONTENT: Thêm thông tin phía dưới ======= */}
        <AboutStrip />

        <StatsRow
          items={[
            { label: "Khoá học", value: formatNumber(totalCourses) },
            { label: "Giáo viên", value: formatNumber(totalTeachers) },
            { label: "Học viên", value: formatNumber(totalLearners) },
            { label: "Lượt xem", value: formatNumber(totalViews) },
          ]}
        />

        <FeaturesGrid />

        <TeacherCTA />

        <Testimonials />

        <FAQ />

        <NewsletterForm />

        <BottomCTA />
      </main>
    </div>
  );
}

/* ===================== Sub Components ===================== */

function SectionBlock({
  id,
  title,
  groupedCourses,
  loading,
  error,
  emptyText,
}) {
  const subjectKeys = Object.keys(groupedCourses || {});
  const hasData = subjectKeys.length > 0;

  return (
    <section id={id} className="mb-6">
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        {title}
      </motion.h2>

      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorBox message={error} />
      ) : !hasData ? (
        <EmptyBox text={emptyText} />
      ) : (
        subjectKeys.map((subjectKey) => (
          <div key={subjectKey} className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {SUBJECT_MAPPING[subjectKey] || subjectKey}
              </h3>

              {/* Nút xem tất cả của nhóm (tuỳ bạn map route riêng) */}
              <Link
                to={"/khoa-hoc"}
                className="text-blue-600 hover:underline font-medium"
              >
                Xem tất cả
              </Link>
            </div>

            <CoursesGrid
              courses={groupedCourses[subjectKey]}
              subjectKey={subjectKey}
            />
          </div>
        ))
      )}
    </section>
  );
}

function CoursesGrid({ courses = [], subjectKey }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course, idx) => (
        <motion.div
          key={course._id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: Math.min(idx * 0.06, 0.3) }}
        >
          <CourseCard course={course} subjectKey={subjectKey} />
        </motion.div>
      ))}
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md group">
      <div className="overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full aspect-[3/2] object-cover transition-transform duration-500 hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* Ẩn GV nếu là admin */}
        {course?.instructor?.role === "admin" ? null : (
          <div className="mb-2 text-sm">
            <span className="text-gray-500">Giáo viên: </span>
            <span className="font-medium text-gray-900">
              {course?.instructor?.fullName || "N/A"}
            </span>
          </div>
        )}

        <div className="mb-2 flex items-center text-sm">
          <CalendarMonthIcon
            fontSize="small"
            className="text-gray-500 mr-1 shrink-0 w-4 h-4"
          />
          <span className="font-medium text-gray-900">
            {course?.createdAt
              ? new Date(course.createdAt).toLocaleDateString("vi-VN")
              : "N/A"}
          </span>
        </div>

        {/* Hiển thị metric phù hợp từng loại */}
        {course?.type === "binhdanso" ? (
          <div className="mb-4 flex items-center text-sm">
            <i className="fa-solid fa-eye text-gray-500 mr-2 ml-1 w-4 h-4 shrink-0" />
            <span className="font-medium text-gray-900">
              {course?.viewCount || 0} lượt xem
            </span>
          </div>
        ) : (
          <div className="mb-4 flex items-center text-sm">
            <i className="fa-solid fa-user-group text-gray-500 mr-2 ml-1 w-4 h-4 shrink-0" />
            <span className="font-medium text-gray-900">
              {course?.totalParticipants || 0} học viên
            </span>
          </div>
        )}

        <Link
          to={`${ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
            ":courseId",
            course._id
          ).replace(
            ":courseName",
            course.title.replace(/\s+/g, "-").toLowerCase()
          )}`}
          className="relative inline-flex items-center justify-center w-full rounded-xl border border-blue-600 text-blue-600 font-medium px-4 py-2.5 overflow-hidden transition
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
  );
}

/* ====== Skeleton / Empty / Error ====== */

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-[3/2] bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-9 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div className="text-center text-gray-600 py-16 bg-white border border-gray-200 rounded-2xl">
      {text}
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="text-center text-red-600 py-16 bg-white border border-red-200 rounded-2xl">
      {message}
    </div>
  );
}

/* ===================== Extra Sections (dưới nội dung) ===================== */

function AboutStrip() {
  return (
    <section className="mt-16 bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100 rounded-2xl p-6 sm:p-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Sứ mệnh</h3>
          <p className="text-gray-700">
            Mở rộng cơ hội học tập chất lượng cho mọi người dân, thu hẹp khoảng
            cách số và nâng cao kỹ năng sống.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Giá trị</h3>
          <p className="text-gray-700">
            Miễn phí, thực tiễn, dễ áp dụng. Đặt sự an toàn thông tin và trải
            nghiệm người học lên hàng đầu.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Cộng đồng</h3>
          <p className="text-gray-700">
            Kết nối giáo viên, tổ chức xã hội và người học trên khắp cả nước để
            cùng lan tỏa tri thức.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatsRow({ items = [] }) {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <div className="text-2xl font-extrabold text-gray-900">
              {it.value}
            </div>
            <div className="mt-1 text-sm text-gray-600">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesGrid() {
  const feats = [
    {
      icon: <SchoolIcon className="w-6 h-6" />,
      title: "Nội dung chuẩn – dễ học",
      desc: "Bài giảng ngắn gọn, ví dụ gần gũi, có bài tập thực hành.",
    },
    {
      icon: <SecurityIcon className="w-6 h-6" />,
      title: "An toàn thông tin",
      desc: "Hướng dẫn phòng chống lừa đảo, bảo mật tài khoản và dữ liệu.",
    },
    {
      icon: <EmojiEventsIcon className="w-6 h-6" />,
      title: "Chứng nhận hoàn thành",
      desc: "Ghi nhận nỗ lực học tập, tạo động lực tiến bộ mỗi ngày.",
    },
    {
      icon: <SupportAgentIcon className="w-6 h-6" />,
      title: "Hỗ trợ tận tâm",
      desc: "Cộng đồng giáo viên và trợ giảng sẵn sàng giải đáp.",
    },
  ];

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Vì sao chọn chúng tôi?
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {feats.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
              {f.icon}
            </div>
            <div className="font-semibold text-gray-900 mb-1">{f.title}</div>
            <div className="text-sm text-gray-700">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeacherCTA() {
  return (
    <section className="mt-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white p-8">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-2">
            Bạn là giáo viên/tình nguyện viên?
          </h3>
          <p className="opacity-90">
            Hãy tham gia giảng dạy để lan tỏa tri thức đến cộng đồng. Chúng tôi
            hỗ trợ công cụ, tài liệu và cộng đồng đồng hành.
          </p>
        </div>
        <div className="flex md:justify-end">
          <Link
            to="/tro-thanh-giao-vien"
            className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition"
          >
            Đăng ký giảng dạy
          </Link>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const list = [
    {
      quote:
        "Mẹ mình đã biết dùng dịch vụ công trực tuyến, tiết kiệm rất nhiều thời gian. Khoá học dễ hiểu và thực tế!",
      name: "Nguyễn Thị H.",
      role: "Người học Bình dân số",
    },
    {
      quote:
        "Tài liệu giảng dạy miễn phí rất hệ thống, mình áp dụng ngay cho lớp học vùng xa của mình.",
      name: "Thầy Lê Văn T.",
      role: "Giáo viên THCS",
    },
    {
      quote:
        "Phần an toàn thông tin cực kỳ hữu ích, giúp mình tránh được một vụ lừa trên mạng.",
      name: "Trần Minh K.",
      role: "Công nhân",
    },
  ];

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Cảm nhận từ cộng đồng
      </h3>
      <div className="grid md:grid-cols-3 gap-5">
        {list.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-gray-800 leading-relaxed">“{t.quote}”</p>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{t.name}</span> —{" "}
              {t.role}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Khoá học có miễn phí hoàn toàn không?",
      a: "Có. Hầu hết các khoá do cộng đồng đóng góp và được cung cấp miễn phí.",
    },
    {
      q: "Mình có nhận chứng nhận hoàn thành không?",
      a: "Một số khoá có chứng nhận khi bạn hoàn thành đầy đủ nội dung và bài kiểm tra.",
    },
    {
      q: "Không rành công nghệ thì có học được không?",
      a: "Hoàn toàn được. Các khoá BĐS thiết kế cho người mới bắt đầu, có hướng dẫn từng bước.",
    },
    {
      q: "Làm sao để trở thành giáo viên?",
      a: "Bạn hãy vào mục “Đăng ký giảng dạy”, điền thông tin cơ bản; chúng tôi sẽ liên hệ hướng dẫn.",
    },
  ];

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Câu hỏi thường gặp
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <details
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-4 open:shadow-sm"
          >
            <summary className="cursor-pointer font-semibold text-gray-900">
              {it.q}
            </summary>
            <p className="mt-2 text-gray-700">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function NewsletterForm() {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: hook real submission if needed
    alert("Cảm ơn bạn đã đăng ký! (demo)");
  };

  return (
    <section className="mt-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">
          Nhận bản tin khoá học & sự kiện
        </h3>
        <p className="text-gray-700 mt-1">
          Mỗi tháng một email: khoá mới, tài nguyên hay, và câu chuyện truyền
          cảm hứng.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-4 grid sm:grid-cols-[1fr_auto] gap-3"
        >
          <input
            type="email"
            required
            placeholder="Nhập email của bạn"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
          />
          <button
            type="submit"
            className="rounded-xl px-5 py-2.5 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="mt-12 text-center">
      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900">
          Sẵn sàng bắt đầu học?
        </h3>
        <p className="text-gray-700 mt-2">
          Chọn một khoá học phù hợp và khám phá tri thức ngay hôm nay.
        </p>
        <Link
          to="/khoa-hoc"
          className="inline-block mt-4 rounded-xl px-6 py-3 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Xem tất cả khoá học
        </Link>
      </div>
    </section>
  );
}

/* ===================== Utils ===================== */

function formatNumber(n) {
  const num = Number(n || 0);
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(num);
}

function countDistinct(arr) {
  return new Set(arr).size;
}
