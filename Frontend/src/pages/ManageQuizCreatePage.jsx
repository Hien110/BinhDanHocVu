import React, { useEffect, useRef, useState } from "react";

import questionBankService from "../services/questionBankService";
import QuizService from "../services/quizService";

import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { ROUTE_PATH } from "../constants/routePath"; // import đường dẫn

function ManageQuizCreatePage() {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(1);
  const [attempts, setAttempts] = useState(1);
  const [loading, setLoading] = useState(false);

  const [questionBank, setQuestionBank] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Chế độ chọn câu hỏi: manual | excel | random
  const [questionSource, setQuestionSource] = useState("manual");
  const [randomCount, setRandomCount] = useState(1);

  const [file, setFile] = useState(null);
  let ids = [];
  let totalQuestions = 0;
  const fileInputRef = useRef();

  // Lấy danh sách lessons & question bank khi chọn course
  useEffect(() => {
    if (courseId) {
      questionBankService.getQuestionByCourse(courseId).then((res) => {
        setQuestionBank(res.data);
      });
    }
  }, [courseId]);

  // Chọn câu hỏi thủ công
  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  // Upload từ file Excel
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questionSource === "excel" && !file) {
      toast.error("Vui lòng tải lên file Excel");
      return;
    }

    if (questionSource === "excel") {
      try {
        const res = await questionBankService.uploadExcel(courseId, file);
        if (res.success) {
          setSelectedQuestions(res.data.map((q) => q._id));
          ids = res.data.map((q) => q._id);
          totalQuestions = res.data.length;
        } else {
          toast.error(res.message || "Lỗi khi tải câu hỏi từ Excel");
        }
      } catch (error) {
        console.log(error);

        toast.error("Lỗi khi tải câu hỏi từ Excel", error.message);
        return;
      }
    }

    if (questionSource === "manual") {
      ids = selectedQuestions;
      totalQuestions = selectedQuestions.length;
      if (totalQuestions === 0) {
        toast.error("Vui lòng chọn ít nhất một câu hỏi");
        return;
      }
    }

    if (questionSource === "random") {
      if (randomCount <= 0 || randomCount > questionBank.length) {
        toast.error("Ngân hàng câu hỏi không đủ");
        return;
      }

      totalQuestions = randomCount;
    }

    

    const newQuiz = {
      course: courseId,
      title,
      questions: ids,
      timeLimit,
      totalQuestions,
      attempts,
      typeQuiz: questionSource,
    };

    try {
      setLoading(true);
      const response = await QuizService.createQuiz(courseId, newQuiz);
      if (response.success) {
        // Reset form
        toast.success("Tạo bài kiểm tra thành công! Đang quay về trang danh sách bài kiểm tra ...");
        // chờ 3s sau đó chuyển hướng
        setTimeout(() => {
          window.location.href = ROUTE_PATH.LECTURER_QUIZ_LIST.replace(":courseId", courseId);
        }, 3000);
      } else {
        toast.error(response.message || "Lỗi khi tạo quiz");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo quiz", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto bg-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-3">
        Tạo bài kiểm tra
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tiêu đề */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Tiêu đề
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            placeholder="Nhập tiêu đề bài kiểm tra..."
            required
          />
        </div>

        {/* Giới hạn thời gian */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Giới hạn thời gian (phút)
          </label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            min={1}
          />
        </div>

        {/* Số lần làm */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Số lần làm
          </label>
          <input
            type="number"
            value={attempts}
            onChange={(e) => setAttempts(Number(e.target.value))}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            min={1}
          />
        </div>

        {/* Chọn nguồn câu hỏi */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Nguồn câu hỏi
          </label>
          <select
            value={questionSource}
            onChange={(e) => setQuestionSource(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            <option value="manual">Chọn thủ công từ QuestionBank</option>
            <option value="excel">Tải từ file Excel</option>
            <option value="random">Chọn ngẫu nhiên từ QuestionBank</option>
          </select>
        </div>

        {/* Chọn câu hỏi thủ công */}
        {questionSource === "manual" && questionBank.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold">Chọn câu hỏi</label>
              <span className="text-sm text-gray-600">
                Đã chọn: {selectedQuestions.length}/{questionBank.length}
              </span>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {questionBank.map((q) => (
                <label
                  key={q._id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(q._id)}
                    onChange={() => handleQuestionSelect(q._id)}
                    className="w-4 h-4"
                  />
                  <span>{q.question}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Upload từ file Excel */}
        {questionSource === "excel" && (
          <div>
            <div>
              <input
                type="file"
                accept=".xlsx, .xls"
                ref={fileInputRef}
                className="border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-red-50 file:text-red-700
                     hover:file:bg-red-100"
                onChange={handleExcelUpload}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Chọn file Excel chứa câu hỏi để tải lên
            </p>
            {/* warning */}
            <p className="text-sm text-red-500 mt-2">
              Sau khi tải lên, câu hỏi sẽ được cập nhập vào ngân hàng câu hỏi
            </p>

            {/* File mẫu */}
            <a
              href={`${import.meta.env.BASE_URL}TaoCauHoiMau.xlsx`}
              download
              className="text-sm text-blue-600 hover:underline mt-2 block"
            >
              Tải về file mẫu
            </a>
          </div>
        )}

        {/* Random câu hỏi */}
        {questionSource === "random" && (
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Số câu hỏi muốn random
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={randomCount}
                onChange={(e) => setRandomCount(Number(e.target.value))}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                min={1}
              />
              <p className="text-sm text-red-500">
                Đề sẽ được random khi sinh viên bắt đầu làm bài
              </p>
            </div>
          </div>
        )}

        {/* Nút submit */}
        <div className="flex space-x-4">
          <button
            type="button"
            className="w-full py-3 rounded-xl text-white font-semibold bg-gray-600 transition-colors duration-500 ease-in-out hover:bg-gray-500 cursor-pointer shadow-md"
            onClick={() => (window.location.href = ROUTE_PATH.LECTURER_QUIZ_LIST.replace(":courseId", courseId))}
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="cursor-pointer py-3 px-4 w-full rounded-xl text-white font-semibold bg-red-500 hover:bg-red-600 shadow-md transition-all duration-300"
          >
            {loading ? "Đang tạo..." : "Tạo bài kiểm tra"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManageQuizCreatePage;
