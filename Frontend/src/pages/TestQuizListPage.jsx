import React, { useEffect, useState } from "react";

import QuizService from "../services/quizService";
import quizResultService from "../services/quizResultService";
import userService from "../services/userService";

import { ROUTE_PATH } from "../constants/routePath";

import { toast } from "sonner";


import { Navigate } from "react-router-dom";


function TestQuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const user = userService.getCurrentUser();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const result = await QuizService.getAllQuizzes();
      if (result.success) {
        setQuizzes(result.data);
      }
    };
    fetchQuizzes();
  }, []);

  const handleQuizTest = async (quizId) => {
    if (!user?._id) {
      toast.error("Không tìm thấy thông tin người dùng");
      Navigate(ROUTE_PATH.LOGIN);
      return;
    }

    try {
      const [existingQuizResult, quizTest] = await Promise.all([
        quizResultService.getQuizResultsByUserIdAndQuizId(user._id, quizId),
        QuizService.getQuizById(quizId),
      ]);

      if (!existingQuizResult?.success || !quizTest?.success) {
        toast.error("Không thể làm bài kiểm tra");
        return;
      }

      if (existingQuizResult.data?.length >= quizTest.data?.attempts) {
        toast.error("Bạn đã hết số lượt kiểm tra bài này.");
        return;
      }

      window.location.href = ROUTE_PATH.STUDENT_QUIZ_TEST.replace(
        ":quizId",
        quizId
      );
    } catch (error) {
      toast.error("Lỗi khi kiểm tra bài quiz");
      console.error(error);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center text-red-800">
        Danh sách bài ôn tập
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes?.map((quiz) => (
          <div
            key={quiz._id}
            className="group bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:border-yellow-500 transition"
          >
            {/* Thông tin quiz */}
            <h2 className="text-xl font-bold text-yellow-600 group-hover:text-yellow-400 transition">
              {quiz.title}
            </h2>
            <p className="text-gray-500 mt-2">
              Khóa học:{" "}
              <span className="text-black"> {quiz.course?.title} </span>
            </p>
            <p className="text-gray-500">
              Số câu hỏi:{" "}
              <span className="text-black">{quiz.totalQuestions} câu</span>
            </p>
            <p className="text-gray-500">
              Thời gian:{" "}
              <span className="text-black">{quiz.timeLimit} phút</span>
            </p>
            <p className="text-gray-500">
              Số lần làm:{" "}
              <span className="text-black">{quiz.attempts} lần</span>
            </p>

            {/* Nút hành động */}
            <button
              onClick={() => handleQuizTest(quiz._id)}
              className="mt-4 w-full py-2 border border-yellow-600 text-yellow-600 font-semibold rounded-xl hover:bg-yellow-100 transition duration-300 cursor-pointer"
            >
              Làm bài ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestQuizListPage;
