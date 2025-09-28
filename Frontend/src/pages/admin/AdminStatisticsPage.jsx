import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, UserRoundCheck, BookOpen, Activity, PieChart as PieIcon, BarChart3 } from "lucide-react";

import userService from "../../services/userService";
import courseService from "../../services/courseService";

// Bảng màu (na ná Tailwind)
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

const nf = new Intl.NumberFormat("vi-VN");
const fmt = (n) => (typeof n === "number" ? nf.format(n) : "0");

export default function AdminStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalLecturers, setTotalLecturers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [binhDanSoCourses, setBinhDanSoCourses] = useState([]);
  const [totalBinhDanSoCourses, setTotalBinhDanSoCourses] = useState(0);
  const [totalBinhDanSoParticipants, setTotalBinhDanSoParticipants] = useState(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError("");
        const [studentsRes, lecturersRes, coursesRes, bdsRes] = await Promise.all([
          userService.getAllStudents(),
          userService.getAllLecturers(),
          courseService.getAllCourses(),
          courseService.getBinhDanSoCourses(),
        ]);

        setTotalStudents(studentsRes?.data?.length || 0);
        setTotalLecturers(lecturersRes?.data?.length || 0);
        setTotalCourses(coursesRes?.total ?? coursesRes?.data?.length ?? 0);
        setTotalParticipants(coursesRes?.totalParticipants || 0);

        const bds = bdsRes?.data || [];
        setBinhDanSoCourses(bds);
        setTotalBinhDanSoCourses(bds.length);
        const bdsParticipants = bds.reduce((acc, c) => acc + (c.totalParticipants || 0), 0);
        setTotalBinhDanSoParticipants(bdsParticipants);
      } catch (e) {
        console.error(e);
        setError("Không thể tải thống kê. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Data cho biểu đồ
  const barData = useMemo(() => {
    return (binhDanSoCourses || []).map((c, idx) => ({
      name: c?.title?.length > 18 ? c.title.slice(0, 16) + "…" : c?.title || `Khóa ${idx + 1}`,
      fullName: c?.title || `Khóa ${idx + 1}`,
      participants: c?.totalParticipants || 0,
    }));
  }, [binhDanSoCourses]);

  const pieData = useMemo(() => {
    const bds = totalBinhDanSoParticipants || 0;
    const others = Math.max((totalParticipants || 0) - bds, 0);
    return [
      { name: "Bình dân số", value: bds },
      { name: "Khác", value: others },
    ];
  }, [totalParticipants, totalBinhDanSoParticipants]);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Thống kê quản trị
      </h1>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard icon={Users} label="Học viên" value={totalStudents} subtitle="Tổng số học viên" />
            <StatCard icon={UserRoundCheck} label="Giảng viên" value={totalLecturers} subtitle="Tổng số giảng viên" />
            <StatCard icon={BookOpen} label="Khóa học" value={totalCourses} subtitle="Tổng số khóa" />
            <StatCard icon={Activity} label="Người tham gia" value={totalParticipants} subtitle="Tổng tham gia tất cả khóa" />
            <StatCard icon={BarChart3} label="Bình dân số - Khóa" value={totalBinhDanSoCourses} subtitle="Số khóa Bình dân số" />
            <StatCard icon={PieIcon} label="Bình dân số - Người tham gia" value={totalBinhDanSoParticipants} subtitle="Lượt tham gia Bình dân số" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Bar chart: BĐS theo khóa */}
            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-medium text-gray-700">Bình dân số theo khóa (người tham gia)</p>
              <div className="h-80">
                {barData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Chưa có dữ liệu khóa Bình dân số
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" interval={0} height={50} tick={<CustomXAxisTick />} />
                      <YAxis allowDecimals={false} />
                      <ReTooltip content={<CustomBarTooltip />} />
                      <Legend />
                      <Bar dataKey="participants" name="Người tham gia" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Pie chart: tỉ trọng BĐS vs Khác */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-medium text-gray-700">Tỷ trọng người tham gia</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip formatter={(v, n, p) => [fmt(v), p?.payload?.name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bảng chi tiết BĐS */}
          <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Khóa học (Bình dân số)</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Người tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {binhDanSoCourses.map((c, i) => (
                  <tr key={c._id || i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-normal break-words" title={c.title}>
                      {c.title || `Khóa ${i + 1}`}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">{fmt(c.totalParticipants || 0)}</td>
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
        <p className="text-2xl font-semibold text-gray-900">{fmt(value)}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

// Tooltip cột: hiện tên đầy đủ + số liệu
function CustomBarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="rounded-md border border-gray-200 bg-white p-2 shadow">
        <div className="text-xs text-gray-500">Người tham gia</div>
        <div className="text-sm font-medium text-gray-900">{d.fullName}</div>
        <div className="text-sm text-gray-700">{fmt(d.participants)}</div>
      </div>
    );
  }
  return null;
}

// Tick trục X có tooltip native để xem tên đầy đủ khi hover
function CustomXAxisTick(props) {
  const { x, y, payload } = props;
  const labelShort = payload.value;
  const full = payload.payload?.fullName;
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={16} textAnchor="end" transform="rotate(-15)" className="fill-gray-700 text-[12px]">
        {labelShort}
        <title>{full}</title>
      </text>
    </g>
  );
}
