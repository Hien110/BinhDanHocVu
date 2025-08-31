import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { ROUTE_PATH } from "../constants/routePath";

import userService from "../services/userService";

export default function QuizHistoryCard({ history }) {
  const [progress, setProgress] = useState(0);

  const user = userService.getCurrentUser();

  const score = history.score || 0;
  const percent = (score / 10) * 100;

  // Xác định màu theo điểm
  const getProgressColor = () => {
    if (score < 4) return "bg-red-400";
    if (score < 8) return "bg-orange-400";
    return "bg-green-400";
  };

  const getTextColor = () => {
    if (score < 4) return "text-red-400";
    if (score < 8) return "text-orange-400";
    return "text-green-400";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percent);
    }, 200); // delay để tạo hiệu ứng
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="flex justify-between items-center border border-gray-200 rounded-xl p-5 shadow-sm bg-white hover:shadow-lg transition-all duration-200 mb-4">
      {/* Thông tin bên trái */}
      <div className="flex-1 pr-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {history.quiz?.title}
        </h3>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <SchoolIcon fontSize="small" /> Môn học:{" "}
          <span className="font-medium">{history.course?.title}</span>
        </p>
        <p className="mt-2 text-sm flex items-center gap-1">
          <CheckCircleIcon fontSize="small" className="text-gray-500" />{" "}
          <span className="font-semibold text-gray-500">Điểm:</span>{" "}
          <span className={`font-bold ${getTextColor()}`}>{score}/10</span>
        </p>

        {/* Thanh progress */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
          <div
            className={`${getProgressColor()} h-2 rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="mt-1 pt-2 text-xs text-gray-500 flex items-center gap-1">
          <CalendarTodayIcon fontSize="small" /> Ngày hoàn thành:{" "}
          {new Date(history.createdAt).toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Nút xem chi tiết */}
      {user.role === "student" ? (
        <Link
          //truyền thêm một state
          to={ROUTE_PATH.STUDENT_QUIZ_RESULT.replace(
            ":quizResultId",
            history?._id
          )}
          state={{ linkFrom: "quizHistory" }}
          className="flex items-center text-sm gap-2 px-2 py-2 border border-yellow-500 text-yellow-600 rounded-lg font-medium hover:bg-yellow-100 transition-colors duration-300"
        >
          Xem chi tiết
          <ArrowForwardIcon fontSize="small" />
        </Link>
      ) : (
        <Link
          //truyền thêm một state
          to={ROUTE_PATH.STUDENT_QUIZ_RESULT.replace(
            ":quizResultId",
            history?._id
          )}
          state={{ linkFrom: "quizHistoryLecture" }}
          className="flex items-center text-sm gap-2 px-2 py-2 border border-yellow-500 text-yellow-600 rounded-lg font-medium hover:bg-yellow-100 transition-colors duration-300"
        >
          Xem chi tiết
          <ArrowForwardIcon fontSize="small" />
        </Link>
      )}
    </div>
  );
}
