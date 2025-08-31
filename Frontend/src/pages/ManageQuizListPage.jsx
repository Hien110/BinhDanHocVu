import React, { useEffect, useState } from "react";

import { ROUTE_PATH } from "../constants/routePath";

import { useParams } from "react-router-dom";

import QuizService from "../services/quizService";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function ManageQuizListPage() {
  const { courseId } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [Loading, setLoading] = useState(true);

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const result = await QuizService.getQuizzesByCourse(courseId);
        if (result.success) {
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

  const handleDeleteQuiz = async () => {
    try {
      const result = await QuizService.deleteQuiz(courseId, quizToDelete._id);
      if (result.success) {
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz._id !== quizToDelete._id)
        );
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error deleting quiz:", error);
    } finally {
      closeModals();
    }
  };

  const closeModals = () => {
    setShowModalDelete(false);
    setQuizToDelete(null);
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (Loading) {
    return <div className="min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Quản lý bài kiểm tra
      </h1>
      <div className="mb-4 text-red-400">
        <span className="font-bold">Tổng số bài kiểm tra:</span> {quizzes.length}{" "}
        bài kiểm tra
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
                <h2 className="text-xl font-semibold mb-2 text-yellow-600 max-w-xs truncate">
                  {quiz.title}
                </h2>

                {/* Số câu hỏi */}
                <p className="text-gray-600">
                  <span className="font-medium">Số câu hỏi:</span>{" "}
                  {quiz.totalQuestions}
                </p>
              </div>
              {/* Loại Quiz (canh giữa) */}
              <div className="">
                <span className="font-medium text-gray-600">Loại đề:</span>{" "}
                {quiz.typeQuiz === "manual" && "Thủ công"}
                {quiz.typeQuiz === "excel" && "Excel"}
                {quiz.typeQuiz === "random" && "Tự động"}
                {/* Ngày tạo */}
                {/* <p className="text-gray-600">
                  <span className="font-medium">Ngày tạo:</span>{" "}
                  {new Date(quiz.createdAt).toLocaleDateString("vi-VN")}
                </p> */}
                {/* Thời gian làm bài */}
                <p className="">
                  <span className="font-medium text-gray-600">
                    Thời gian làm bài:
                  </span>{" "}
                  {quiz.timeLimit} phút
                </p>
              </div>

              {/* Nút hành động */}
              <div className="">
                <button
                  className="cursor-pointer text-yellow-600 border border-yellow-600 px-3 py-1 text-sm rounded-lg hover:bg-yellow-100 font-medium transition duration-300"
                  onClick={() => {
                    window.location.href =
                      ROUTE_PATH.LECTURER_QUIZ_DETAIL.replace(
                        ":courseId",
                        courseId
                      ).replace(":quizId", quiz._id);
                  }}
                >
                  Xem chi tiết
                </button>
                <button
                  className="cursor-pointer text-red-600 border border-red-600 px-3 py-1 text-sm rounded-lg hover:bg-red-100 font-medium transition duration-300 ml-3"
                  onClick={() => {
                    setQuizToDelete(quiz);
                    setShowModalDelete(true);
                  }}
                >
                  Xóa bài kiểm tra
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModalDelete && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Xóa bài bài kiểm tra
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa bài kiểm tra{" "}
                <span className="font-semibold text-red-500">
                  {quizToDelete?.title}
                </span>{" "}
                không?
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteQuiz(quizToDelete?._id);
                }}
              >
                {/* Buttons */}
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 max-w-[250px] px-4 py-1 ">
        <button
          className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-red-500 to-red-400 transition-colors duration-500 ease-in-out hover:from-red-600 hover:to-red-500 cursor-pointer shadow-md"
          onClick={() =>
            (window.location.href = ROUTE_PATH.LECTURER_QUIZ_CREATE.replace(
              ":courseId",
              courseId
            ))
          }
        >
          <span className="text-lg mr-2">+</span>
          Tạo bài kiểm tra
        </button>
      </div>
    </div>
  );
}

export default ManageQuizListPage;
