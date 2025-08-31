import React, { useEffect, useState } from "react";
import userService from "../services/userService";
import courseService from "../services/courseService";
import quizService from "../services/quizService";
import quizResultService from "../services/quizResultService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function StatisticsPage() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalQuizResults, setTotalQuizResults] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await userService.getAllStudents();
      setTotalStudents(response.data.length);

      const courseResponse = await courseService.getAllCourses();
      setTotalCourses(courseResponse.data.length);

      const quizResponse = await quizService.getAllQuizzes();
      setTotalQuizzes(quizResponse.data.length);

      const quizResultResponse = await quizResultService.getAllQuizResults();
      setTotalQuizResults(quizResultResponse.data.length);
    };
    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = [
    { name: "Học sinh", value: totalStudents },
    { name: "Khóa học", value: totalCourses },
    { name: "Bài kiểm tra", value: totalQuizzes },
    { name: "Kết quả bài kiểm tra", value: totalQuizResults },
  ];

  const barData = [
    { name: "Học sinh", value: totalStudents },
    { name: "Khóa học", value: totalCourses },
    { name: "Bài kiểm tra", value: totalQuizzes },
    { name: "Số bài làm", value: totalQuizResults },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Thống kê tổng quan
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Sinh viên</h2>
          <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Khóa học</h2>
          <p className="text-3xl font-bold text-green-600">{totalCourses}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Bài kiểm tra</h2>
          <p className="text-3xl font-bold text-yellow-600">{totalQuizzes}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-600">Số lần đã kiểm tra</h2>
          <p className="text-3xl font-bold text-red-600">{totalQuizResults}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Biểu đồ cột
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Biểu đồ tròn
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
