import React, { useEffect, useState } from "react";

import userService from "../../services/userService";
import quizResultService from "../../services/quizResultService";

import QuizHistoryItem from "../../components/QuizHistoryItem";
import AverageScoreCard from "../../components/AverageScoreCard";
import ResultClassification from "../../components/ResultClassification";

import { useParams } from "react-router-dom";

function ManageStudentDetailPage() {
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await userService.getUserById(studentId);
        if (res.success) {
          setStudent(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch student details:", error);
      }
    };

    const fetchQuizHistory = async () => {
      try {
        const res = await quizResultService.getQuizResultsByUserId(studentId);
        if (res.success) {
          setQuizHistory(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch quiz history:", error);
      }
    };

    fetchStudent();
    fetchQuizHistory();
  }, [studentId]);

  return (
    <div className="min-h-screen ">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Hồ sơ sinh viên <span className="text-red-600">{student?.name}</span>
      </h1>

      {/* Card bao ngoài */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Thông tin sinh viên */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Thông tin cá nhân
          </h2>

          <div className="flex items-center gap-6">
            {/* Avatar */}
            <img
              src={student?.avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-28 h-28 rounded-full border shadow-sm object-cover"
            />

            {/* Thông tin */}
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-medium">Họ và tên:</span> {student?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {student?.email}
              </p>
              <p className="col-span-2">
                <span className="font-medium">Ngày tham gia:</span>{" "}
                {new Date(student?.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Lịch sử làm bài + thống kê */}
        <div className="">
          {/* Lịch sử làm bài */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 flex flex-col mt-3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
              Lịch sử làm bài
            </h2>
            <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-3">
              {quizHistory.length > 0 ? (
                quizHistory.reverse().map((item) => (
                  <QuizHistoryItem key={item._id} history={item} />
                ))
              ) : (
                <p className="text-gray-500 italic">
                  Chưa có lịch sử làm bài nào.
                </p>
              )}
            </div>
          </div>

          {/* Thống kê */}
          <div className="space-y-6">
            <ResultClassification quizResults={quizHistory} />
            <AverageScoreCard quizResults={quizHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageStudentDetailPage;
