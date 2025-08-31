import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizService from "../services/quizService";
import questionBankService from "../services/questionBankService";
import { toast } from "sonner";
import { ROUTE_PATH } from "../constants/routePath";

function ManageQuizDetailPage() {
  const { courseId, quizId } = useParams();
  const [quizDetail, setQuizDetail] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [questionBankList, setQuestionBankList] = useState([]);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [attempts, setAttempts] = useState(1);
  const [duration, setDuration] = useState(1);
  const [randomCount, setRandomCount] = useState(1);

  let totalQuestions = 0;
  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        const result = await QuizService.getQuizById(quizId);
        if (result.success) {
          setQuizDetail(result.data);
          setQuizQuestions(result.data.questions || []);
          setAttempts(result.data.attempts || 1);
          setDuration(result.data.timeLimit || 1);
          setRandomCount(result.data.randomCount || 1);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching quiz detail:", error);
      }
    };

    const fetchQuestionBank = async () => {
      try {
        const result = await questionBankService.getQuestionByCourse(courseId);
        if (result.success) {
          setQuestionBankList(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching question bank:", error);
      }
    };

    fetchQuizDetail();
    fetchQuestionBank();
  }, [courseId, quizId]);

  // Lọc ra câu hỏi chưa có trong quiz
  const availableQuestions = questionBankList.filter(
    (q) => !quizQuestions.some((quizQ) => quizQ._id === q._id)
  );

  // Xóa câu hỏi
  const handleRemoveQuestion = (id) => {
    setQuizQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  // Thêm câu hỏi
  const handleAddQuestion = (q) => {
    setQuizQuestions((prev) => [
      ...prev,
      { _id: `temp-${Date.now()}`, ...q },
    ]);
  };

  // Lưu quiz
  const handleSaveQuiz = async () => {

    if ( quizDetail.typeQuiz === "random" && randomCount > questionBankList.length) {
        toast.error("Số câu hỏi ngẫu nhiên không được lớn hơn số câu hỏi trong ngân hàng");
        return;
    }

    if (quizDetail.typeQuiz === "manual" || quizDetail.typeQuiz === "excel"){
        totalQuestions = quizQuestions.length;
    } else {
        totalQuestions = randomCount;
    }
    try {
      const payload = {
        ...quizDetail,
        questions: quizQuestions,
        attempts: attempts,
        timeLimit: duration,
        totalQuestions: totalQuestions,
      };
      const res = await QuizService.updateQuiz(quizId, payload);
      console.log(payload);

      if (res.success) {
        toast.success("Cập nhật bài kiểm tra thành công!");
      } else {
        toast.error(res.message || "Lỗi khi lưu bài kiểm tra");
      }
    } catch (error) {
      toast.error("Lỗi khi lưu bài kiểm tra: " + error.message);
    }
  };

  if (!quizDetail) {
    return <div className="min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Quản lý câu hỏi của bài kiểm tra
      </h1>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600 max-w-md">
          Bài kiểm tra: {quizDetail?.title}
        </h2>

        {/* Số lần kiểm tra */}
        <div className="flex items-center gap-2 mr-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Số lần làm
          </label>
          <input
            type="number"
            defaultValue={quizDetail?.attempts || 1}
            onChange={(e) => setAttempts(Number(e.target.value))}
            className="w-16 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            min={1}
          />
        </div>

        {/* Thời gian kiểm tra */}
        <div className="flex items-center gap-2">
          <label className="block mb-2 font-semibold text-gray-700">
            Thời gian làm bài (phút)
          </label>
          <input
            type="number"
            defaultValue={quizDetail?.timeLimit || 1}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-16 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            min={1}
          />
        </div>
      </div>
      {/* Danh sách câu hỏi trong quiz */}
      <ul className="space-y-6">
        {quizQuestions.map((item, index) => (
          <li
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <p className="font-semibold text-lg text-gray-800">
                Câu hỏi {index + 1}:{" "}
                <span className="font-normal">
                  {item?.question}
                </span>
              </p>
              <button
                onClick={() => handleRemoveQuestion(item._id)}
                className="text-sm border border-red-500 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 transition-all duration-300 cursor-pointer"
              >
                Xóa
              </button>
            </div>
            <ul className="space-y-2 pl-5">
              {item?.options?.map((opt, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    opt.isCorrect
                      ? "bg-green-50 text-green-700 border border-green-300"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="font-bold">{alphabet[idx]}.</span>
                  <span>{opt.text}</span>
                  {opt.isCorrect && (
                    <span className="ml-2 text-sm font-medium text-green-600">
                      Đáp án đúng
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {quizDetail?.typeQuiz !== "random" ? (
        <>
          {/* Danh sách câu hỏi có thể thêm */}
          <h3 className="text-xl font-bold mt-8 mb-4">
            Thêm câu hỏi từ ngân hàng
          </h3>
          <ul className="space-y-4">
            {availableQuestions.map((q) => (
              <li
                key={q._id}
                className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center"
              >
                <span>{q.question}</span>
                <button
                  onClick={() => handleAddQuestion(q)}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                >
                  Thêm
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          {/* Câu hỏi ngẫu nhiên */}
          {/* Số câu hỏi random */}
          <div className="flex items-center gap-2">
            <label className="block mb-2 font-semibold text-gray-700">
              Số câu hỏi ngẫu nhiên
            </label>
            <input
              type="number"
              defaultValue={quizDetail?.totalQuestions || 1}
              onChange={(e) => setRandomCount(Number(e.target.value))}
              className="w-16 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              min={1}
            />
          </div>
          <p className="text-red-600">
            Các câu hỏi ngẫu nhiên sẽ được chọn từ ngân hàng câu hỏi.
          </p>
        </>
      )}

      {/* Nút lưu quiz */}

      <div className="flex space-x-4 mt-4">
        <button
          type="button"
          className="w-full py-3 rounded-xl text-white font-semibold bg-gray-600 transition-colors duration-500 ease-in-out hover:bg-gray-500 cursor-pointer shadow-md"
          onClick={() =>
            (window.location.href = ROUTE_PATH.LECTURER_QUIZ_LIST.replace(
              ":courseId",
              courseId
            ))
          }
        >
          Quay lại
        </button>
        <button
          onClick={handleSaveQuiz}
          className="cursor-pointer py-3 px-4 w-full rounded-xl text-white font-semibold bg-red-500 hover:bg-red-600 shadow-md transition-all duration-300"
        >
          Lưu lại chỉnh sửa
        </button>
      </div>
    </div>
  );
}

export default ManageQuizDetailPage;
