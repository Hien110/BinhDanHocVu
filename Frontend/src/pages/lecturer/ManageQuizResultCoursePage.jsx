import React, { useEffect, useState } from "react";

import { ROUTE_PATH } from "../../constants/routePath";

import { useParams } from "react-router-dom";

import QuizService from "../../services/quizService";

function ManageQuizResultCoursePage() {
  const { courseId } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [Loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const result = await QuizService.getQuizzesByCourse(courseId);
        if (result.success) {
          console.log(result.data);

          setQuizzes(result.data.slice().reverse());
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [courseId]);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (Loading) {
    return <div className="min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        {quizzes[0]?.course?.title || "Khóa học không tồn tại"}
      </h1>

      <h2 className="text-2xl font-semibold text-custom-blue mb-6 border-b border-gray-300 pb-2">
        Danh sách bài kiểm tra
      </h2>
      <div className="mb-4 text-custom-blue">
        <span className="font-bold">Tổng số bài kiểm tra:</span>{" "}
        {quizzes.length} bài kiểm tra
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm bài kiểm tra..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      {filteredQuizzes.length === 0 ? (
        <p className="text-gray-500 italic">
          Khóa học này chưa có bài kiểm tra nào.
        </p>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="w-full flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                {/* Tiêu đề */}
                <h2 className="text-xl font-semibold mb-2 max-w-xs truncate">
                  {quiz.title}
                </h2>
                {/* Số câu hỏi */}
                <span className="font-medium text-gray-600">Loại đề:</span>{" "}
                {quiz.typeQuiz === "manual" && "Thủ công"}
                {quiz.typeQuiz === "excel" && "Excel"}
                {quiz.typeQuiz === "random" && "Tự động"}
              </div>
              {/* Loại Quiz (canh giữa) */}
              <div className="">
                <p className="">
                  <span className="font-medium text-gray-600">Số câu hỏi:</span>{" "}
                  {quiz.totalQuestions} câu
                </p>
                {/* Thời gian làm bài */}
                <p className="">
                  <span className="font-medium text-gray-600">
                    Thời gian làm bài:
                  </span>{" "}
                  {quiz.timeLimit} phút
                </p>
                {/* Ngày tạo */}
                <p className="">
                  <span className="font-medium text-gray-600">Ngày tạo:</span>{" "}
                  {new Date(quiz.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>

              {/* Nút hành động */}
              <div className="">
                <button
                  className="cursor-pointer text-custom-blue border border-custom-blue px-3 py-1 text-sm rounded-lg hover:bg-custom-hover-blue2 font-medium transition duration-300"
                  onClick={() => {
                    window.location.href =
                      ROUTE_PATH.LECTURER_QUIZ_RESULT_DETAIL.replace(
                        ":courseId",
                        courseId
                      ).replace(":quizId", quiz._id).replace(":courseName", quiz.course.title.replace(/\s+/g, "-").toLowerCase());
                  }}
                >
                  Xem các kết quả
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageQuizResultCoursePage;
