import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, BookOpen, ListChecks, BarChart3 } from "lucide-react";

import quizService from "../../services/quizService";
import lessonService from "../../services/lessonService";
import courseService from "../../services/courseService";
import userService from "../../services/userService";

// Màu sắc dùng cho biểu đồ (gần với Tailwind)
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#e11d48",
];

export default function ManageStaticPage() {
  const [perCourseStats, setPerCourseStats] = useState([]); // [{id,title,participants,lessons,quizzes}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const instructorId = userService.getCurrentUser()?._id;
  // Tổng quan
  const totals = useMemo(() => {
    const courses = perCourseStats.length;
    const students = perCourseStats.reduce(
      (sum, c) => sum + (c.participants || 0),
      0
    );
    const lessons = perCourseStats.reduce(
      (sum, c) => sum + (c.lessons || 0),
      0
    );
    const quizzes = perCourseStats.reduce(
      (sum, c) => sum + (c.quizzes || 0),
      0
    );
    return { courses, students, lessons, quizzes };
  }, [perCourseStats]);

  // Chọn metric cho cột
  const [metric, setMetric] = useState("participants"); // 'participants' | 'lessons' | 'quizzes'
  const metricOptions = useMemo(
    () => [
      { key: "participants", label: "Lượt tham gia" },
      { key: "lessons", label: "Bài học" },
      { key: "quizzes", label: "Bài kiểm tra" },
    ],
    []
  );
  const activeIndex = Math.max(
    0,
    metricOptions.findIndex((o) => o.key === metric)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const resCourses = await courseService.getCoursesByInstructor(instructorId);
        if (!resCourses?.success)
          throw new Error(resCourses?.message || "Không thể tải khóa học");

        const rawCourses = resCourses.data || [];
        // Lấy thống kê từng khóa (song song)
        const stats = await Promise.all(
          rawCourses.map(async (course) => {
            const [lessRes, quizRes] = await Promise.allSettled([
              lessonService.getLessonsByCourse(course._id),
              quizService.getQuizzesByCourse(course._id),
            ]);

            const lessons =
              lessRes.status === "fulfilled" && lessRes.value?.success
                ? (lessRes.value.data || []).length
                : 0;
            const quizzes =
              quizRes.status === "fulfilled" && quizRes.value?.success
                ? (quizRes.value.data || []).length
                : 0;

            return {
              id: course._id,
              title: course.title || "Không tên",
              participants: course.totalParticipants || 0,
              lessons,
              quizzes,
            };
          })
        );

        setPerCourseStats(stats);
      } catch (e) {
        console.error(e);
        setError("Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const barData = useMemo(() => {
    // Dữ liệu cho BarChart: mỗi cột là 1 khóa
    return perCourseStats.map((c) => ({
      name: c.title.length > 18 ? c.title.slice(0, 16) + "…" : c.title, // nhãn ngắn để đỡ tràn
      fullName: c.title, // tên đầy đủ để hiện tooltip khi hover
      participants: c.participants,
      lessons: c.lessons,
      quizzes: c.quizzes,
    }));
  }, [perCourseStats]);

  const pieData = useMemo(() => {
    // Chia tỉ trọng theo lượt tham gia
    const total = perCourseStats.reduce((s, c) => s + (c.participants || 0), 0);
    if (total === 0) return [];
    return perCourseStats.map((c) => ({
      name: c.title,
      value: c.participants,
    }));
  }, [perCourseStats]);

  // Tooltip tùy biến cho BarChart để hiển thị TÊN ĐẦY ĐỦ
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="rounded-md border border-gray-200 bg-white p-2 shadow">
          <div className="text-xs text-gray-500">{metricLabel(metric)}</div>
          <div className="text-sm font-medium text-gray-900">{d.fullName}</div>
          <div className="text-sm text-gray-700">{d[metric]}</div>
        </div>
      );
    }
    return null;
  };

  // Tick tùy biến để có tooltip native (không hiện dấu … khi hover, vẫn thấy tên đầy đủ)
  const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    const labelShort = payload.value;
    const full = payload.payload?.fullName;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          dy={16}
          textAnchor="end"
          transform="rotate(-15)"
          className="fill-gray-700 text-[12px]"
        >
          {labelShort}
          <title>{full}</title>
        </text>
      </g>
    );
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Thống kê
      </h1>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
            ))}
          </div>
          <div className="h-80 bg-gray-100 rounded-2xl" />
          <div className="h-80 bg-gray-100 rounded-2xl" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={BookOpen}
              label="Khóa học"
              value={totals.courses}
              subtitle="Tổng số khóa đang quản lý"
            />
            <StatCard
              icon={Users}
              label="Số lượt tham gia"
              value={totals.students}
              subtitle="Tổng lượt học viên"
            />
            <StatCard
              icon={ListChecks}
              label="Bài học"
              value={totals.lessons}
              subtitle="Tổng số bài học"
            />
            <StatCard
              icon={ListChecks}
              label="Bài kiểm tra"
              value={totals.quizzes}
              subtitle="Tổng số bài kiểm tra"
            />
          </div>

          {/* Controls - pill slider */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">Hiển thị cột theo:</span>
            <div className="relative inline-block rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              {/* Thanh trượt nền */}
              <span
                className="pointer-events-none absolute top-0 bottom-0 rounded-lg bg-blue-600 transition-all duration-300 ease-in-out"
                style={{
                  left: `calc((100% / ${metricOptions.length}) * ${activeIndex})`,
                  width: `calc(100% / ${metricOptions.length}) `,
                }}
              />
              {/* Nút chọn */}
              <div className="relative z-10 grid grid-cols-3">
                {metricOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setMetric(opt.key)}
                    className={`px-3 py-1.5 mx-1 text-sm rounded-lg transition-colors cursor-pointer ${
                      metric === opt.key
                        ? "text-white"
                        : "text-gray-700 hover:bg-custom-hover-blue2 transition duration-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Bar chart */}
            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-medium text-gray-700">
                Phân bố theo khóa học
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      height={50}
                      tick={<CustomXAxisTick />}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend />
                    <Bar
                      dataKey={metric}
                      name={metricLabel(metric)}
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie chart */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-medium text-gray-700">
                Tỉ trọng lượt tham gia theo khóa
              </p>
              <div className="h-80">
                {pieData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Chưa có dữ liệu tham gia
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v, n, p) => [v, p?.payload?.name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Bảng chi tiết theo khóa */}
          <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Khóa học
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                    Lượt tham gia
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                    Bài học
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                    Bài kiểm tra
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {perCourseStats.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td
                      className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-normal break-words"
                      title={c.title}
                    >
                      {c.title}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {c.participants}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {c.lessons}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {c.quizzes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtitle }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function metricLabel(key) {
  switch (key) {
    case "participants":
      return "Lượt tham gia";
    case "lessons":
      return "Bài học";
    case "quizzes":
      return "Bài kiểm tra";
    default:
      return "";
  }
}
