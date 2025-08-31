import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizService from "../services/quizService";
import quizResultService from "../services/quizResultService";
import userService from "../services/userService";
import questionBankService from "../services/questionBankService";

import { toast } from "sonner";

import { ROUTE_PATH } from "../constants/routePath";

function TestQuizPage() {
  (function () {
    // Chặn chuột phải
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Chặn các phím tắt
    document.addEventListener("keydown", (e) => {
      if (e.key === "F12") e.preventDefault();
      if (
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "u", "a")
      ) {
        e.preventDefault();
      }
    });
  })();

  const { quizId } = useParams();
  const navigate = useNavigate();
  const user = userService.getCurrentUser();
  const [quiz, setQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [endTime, setEndTime] = useState(null);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [questionQuiz, setQuestionQuiz] = useState([]);
  const [checkExistingQuizResult, setCheckExistinigQuizResult] =
    useState(false);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Lấy dữ liệu quiz và endTime từ localStorage
  useEffect(() => {
    const initQuiz = async () => {
      try {
        // 1. Lấy thông tin quiz
        const quizRes = await QuizService.getQuizById(quizId);
        if (!quizRes.success) return;

        const quizData = quizRes.data;
        setQuiz(quizData);

        // 2. Lấy danh sách câu hỏi ngân hàng theo course
        const questionRes = await questionBankService.getQuestionByCourse(
          quizData.course
        );
        if (questionRes.success) {
          setQuestionBanks(questionRes.data);
        }

        // 3. Lấy danh sách câu hỏi của quiz
        setQuestionQuiz(quizData.questions || []);

        // 4. Xử lý thời gian endTime
        let savedEndTime = localStorage.getItem(`quiz-${quizId}-endTime`);
        if (!savedEndTime) {
          savedEndTime = Date.now() + (quizData.timeLimit || 0) * 60 * 1000;
          localStorage.setItem(`quiz-${quizId}-endTime`, savedEndTime);
        }
        setEndTime(Number(savedEndTime));

        // 5. Kiểm tra số lần làm bài (checkExistingQuizResult)
        const existingQuizResult =
          await quizResultService.getQuizResultsByUserIdAndQuizId(
            user._id,
            quizData._id
          );
        if (existingQuizResult.success) {
          if (existingQuizResult.data.length >= quizData.attempts) {
            setCheckExistinigQuizResult(true);
          }
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo quiz:", error);
      }
    };

    initQuiz();
  }, [quizId, user._id]);

  useEffect(() => {
    if (quiz && questionBanks.length > 0 && quiz.typeQuiz === "random") {
      const total = quiz.totalQuestions;

      // Copy mảng questionBanks để tránh thay đổi dữ liệu gốc
      const shuffled = [...questionBanks].sort(() => 0.5 - Math.random());

      // Lấy ra đúng số câu hỏi cần
      const randomQuestions = shuffled.slice(0, total);
      console.log(randomQuestions);
      setQuestionQuiz(randomQuestions);
    }
  }, [quiz, questionBanks]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (!endTime) return;

    const timer = setInterval(() => {
      const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(timer);
        handleSubmitQuiz();
      }
    }, 500);

    return () => clearInterval(timer);
  }, [endTime, answers]);

  // Chọn đáp án
  const handleSelectOption = (questionId, optionIndex, isMultiple) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        return currentAnswers.includes(optionIndex)
          ? {
              ...prev,
              [questionId]: currentAnswers.filter((i) => i !== optionIndex),
            }
          : { ...prev, [questionId]: [...currentAnswers, optionIndex] };
      } else {
        return { ...prev, [questionId]: [optionIndex] };
      }
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmitQuiz = async () => {
    if (!user?._id) {
      console.error("Không tìm thấy thông tin người dùng");
      return;
    }

    if (checkExistingQuizResult) {
      toast.error("Bạn đã vượt quá số lần làm bài");
      //set thời gian 3s sau đó  mới chuyển trang
      localStorage.removeItem(`quiz-${quizId}-endTime`);

      setTimeout(() => {
        window.location.href = ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
          ":courseId",
          quiz.course
        );
      }, 2000);
      return;
    }

    // tính số điểm answer
    let mark = 10;
    let eachMark = mark / quiz.totalQuestions;
    let countCorrectAnswers = 0;
    const correctAnswers = Object.entries(answers).reduce(
      (acc, [questionId, selectedOptions]) => {
        questionQuiz.forEach((question) => {
          if (question?._id === questionId) {
            const correctOptions = question?.options
              .map((opt, index) => (opt.isCorrect ? index : null))
              .filter((index) => index !== null);

            if (
              JSON.stringify(selectedOptions.sort()) ===
              JSON.stringify(correctOptions.sort())
            ) {
              acc += eachMark;
              countCorrectAnswers++;
            }
          }
        });

        return acc;
      },
      0
    );

    // correctAnswers;
    const quizResult = {
      student: user._id,
      quiz: quizId,
      course: quiz.course,
      answers: Object.entries(answers).map(([questionId, selectedOptions]) => ({
        questionBankRef: questionId,
        selectedOptionIndex: Array.isArray(selectedOptions)
          ? selectedOptions
          : [selectedOptions],
      })),
      correctAnswers: countCorrectAnswers,
      score: correctAnswers,
    };

    try {
      const res = await quizResultService.createQuizResult(quizResult);
      if (res.success) {
        toast.success(res.message);
        // Xóa endTime khỏi localStorage
        localStorage.removeItem(`quiz-${quizId}-endTime`);
        // Chuyển hướng hoặc thông báo thành công
        navigate(
          ROUTE_PATH.STUDENT_QUIZ_RESULT.replace(":quizResultId", res.data._id),
          {
            state: { linkFrom: "quizPage" },
          }
        );
      }
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
    }
    // console.log(payload, quiz, answers, Object.entries(answers));
  };

  if (!quiz)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
   <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
  {/* Sidebar */}
  <div className="w-full md:w-1/5 md:border-r bg-white shadow-sm">
    <div className="p-4 border border-gray-100 shadow-md rounded-lg bg-white md:fixed md:w-[calc(20%-2px)]">
      {/* Thông tin người làm */}
      <p className="mb-3 text-gray-700">
        Người làm:{" "}
        <span className="font-semibold text-red-600">
          {user?.name || "Ẩn danh"}
        </span>
      </p>
      <div className="text-md font-semibold text-red-500 mb-3">
        Thời gian làm bài: {formatTime(timeLeft)}
      </div>

      {/* Danh sách câu hỏi */}
      <h2 className="font-bold text-lg mb-4 text-gray-500">Danh sách câu hỏi</h2>
      <div className="grid grid-cols-5 gap-2">
        {questionQuiz.map((q, idx) => {
          const answered = answers[q?._id]?.length > 0;
          return (
            <div
              key={q._id}
              className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer font-semibold transition-all duration-200
                ${
                  answered
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
              onClick={() => {
                const element = document.getElementById(`question-${idx}`);
                if (element) {
                  const top =
                    element.getBoundingClientRect().top + window.scrollY - 90;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      {/* Thống kê */}
      <div className="mt-4 text-sm text-gray-600">
        Đã trả lời:{" "}
        <span className="font-medium text-blue-600">
          {Object.keys(answers).length}
        </span>
        /{quiz.totalQuestions} câu
      </div>

      {/* Nút nộp bài */}
      <div className="mt-6">
        <button
          onClick={() => {
            if (!confirm("Bạn có chắc muốn nộp bài không?")) return;
            handleSubmitQuiz();
          }}
          className="cursor-pointer py-3 px-4 w-full rounded-xl text-white font-semibold bg-red-500 hover:bg-red-600 shadow-md transition-all duration-300"
        >
          Nộp bài
        </button>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="flex-1 p-6 mt-4 md:mt-0">
    {/* Header */}
    <div className="flex justify-between items-center mb-6 border-b pb-3">
      <h1 className="text-2xl font-bold text-yellow-600 max-w-2xl">
        {quiz.title}
      </h1>
    </div>

    {/* Danh sách câu hỏi */}
    <div className="space-y-6">
      {questionQuiz.map((q, idx) => {
        const opts = q?.options || [];
        const correctCount = opts.filter((o) => o.isCorrect).length;
        const isMultiple = correctCount > 1;

        return (
          <div
            key={q._id}
            id={`question-${idx}`}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow hover:shadow-md transition-all duration-200"
          >
            <p className="font-semibold text-lg text-gray-800 mb-4">
              Câu {idx + 1}: {q?.question}
            </p>

            <ul className="space-y-3">
              {opts.map((opt, i) => (
                <li
                  key={i}
                  className="p-2 rounded hover:bg-gray-50 transition-all duration-150"
                >
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    {isMultiple ? (
                      <input
                        type="checkbox"
                        onChange={() => handleSelectOption(q?._id, i, true)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    ) : (
                      <input
                        type="radio"
                        name={`question-${q?._id}`}
                        onChange={() => handleSelectOption(q?._id, i, false)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    )}
                    <span className="text-gray-700">
                      <span className="font-medium">{alphabet[i]}.</span>{" "}
                      {opt.text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  </div>
</div>

  );
}

export default TestQuizPage;
