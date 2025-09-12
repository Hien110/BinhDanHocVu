import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import quizResultService from "../../services/quizResultService";
import { ROUTE_PATH } from "../../constants/routePath";

import {
  CheckCircle,
  XCircle,
  User,
  Book,
  FileText,
  Clock,
  Award,
} from "lucide-react";

function TestQuizResultPage() {
  const { quizResultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const { linkFrom } = location.state || {};

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await quizResultService.getQuizResultById(quizResultId);
        if (res.success) {
          setResult(res.data);
          console.log(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy kết quả quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [quizResultId]);

  if (loading) {
    return <div className="p-6 text-center min-h-screen">Đang tải kết quả...</div>;
  }

  if (!result) {
    return (
      <div className="p-6 text-center text-red-500 min-h-screen">Không tìm thấy kết quả</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-3 p-8 bg-white shadow-lg rounded-2xl border border-gray-200 min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-center text-custom-blue mb-8">
        Kết quả bài kiểm tra
      </h1>

      {/* Thông tin chung */}
      <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem
          icon={<User className="text-blue-500" />}
          label="Sinh viên"
          value={result.student?.name}
        />
        <InfoItem
          icon={<Book className="text-purple-500" />}
          label="Khóa học"
          value={result.course?.title}
        />
        <InfoItem
          icon={<FileText className="text-green-500" />}
          label="Bài kiểm tra"
          value={result.quiz?.title}
        />
        <InfoItem
          icon={<Award className="text-yellow-500" />}
          label="Điểm số"
          value={
            <span className="text-green-600 font-bold">
              {result.score?.toFixed(2)}
            </span>
          }
        />
        <InfoItem
          icon={<CheckCircle className="text-green-500" />}
          label="Số câu đúng"
          value={`${result.correctAnswers}/${result.quiz?.totalQuestions}`}
        />
        <InfoItem
          icon={<Clock className="text-gray-500" />}
          label="Thời gian nộp"
          value={new Date(result.createdAt).toLocaleString("vi-VN")}
        />
      </div>

      {/* Danh sách câu hỏi */}
      <div className="space-y-6">
        {result.answers?.map((ans, idx) => {
          const question = ans.questionBankRef;
          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <p className="font-semibold mb-3 text-lg">
                Câu {idx + 1}: {question?.question}
              </p>
              <div className="space-y-2">
                {question?.options?.map((opt, optIdx) => {
                  const isSelected = ans.selectedOptionIndex.includes(optIdx);
                  const isCorrect = opt.isCorrect;

                  let bgColor = "bg-gray-50";
                  if (isCorrect)
                    bgColor = "bg-green-100 border border-green-300";
                  else if (isSelected && !isCorrect)
                    bgColor = "bg-red-100 border border-red-300";

                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-lg flex items-center gap-2 ${bgColor}`}
                    >
                      {isCorrect && (
                        <CheckCircle className="text-green-600 w-5 h-5" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="text-red-600 w-5 h-5" />
                      )}
                      <span>{opt.text}</span>
                      {isCorrect && (
                        <span className="ml-2 text-green-700 font-semibold">
                          (Đúng)
                        </span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="ml-2 text-red-700 font-semibold">
                          (Bạn chọn)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nút quay lại */}
      <div className="mt-10 text-center">
        {linkFrom === "quizHistory" ? (
          <Link
            to={ROUTE_PATH.USER_PROFILE}
            className="px-5 py-3 bg-white border border-custom-blue text-custom-blue rounded-lg hover:bg-custom-hover-blue2 transition-colors duration-400 font-medium shadow"
          >
            ⬅ Quay lại trang cá nhân
          </Link>
        ) : linkFrom === "quizPage" ? (
          <Link
            to={ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
              ":courseId",
              result.course?._id
            ).replace(":courseName", result.course?.title.replace(/\s+/g, "-").toLowerCase())}
            className="px-5 py-3 bg-white border border-custom-blue text-custom-blue rounded-lg hover:bg-custom-hover-blue2 transition-colors duration-400 font-medium shadow"
          >
            ⬅ Quay lại bài học
          </Link>
        ) : linkFrom === "quizManager" ? (
          <Link
            to={ROUTE_PATH.LECTURER_QUIZ_RESULT_DETAIL.replace(
              ":courseId",
              result.course?._id
            ).replace(":quizId", result.quiz?._id)}
            className="px-5 py-3 bg-white border border-custom-blue text-custom-blue rounded-lg hover:bg-custom-hover-blue2 transition-colors duration-400 font-medium shadow"
          >
            ⬅ Quay lại
          </Link>
        ) : (
          <Link
            to={ROUTE_PATH.LECTURER_STUDENT_DETAIL.replace(
              ":studentId",
              result.student?._id
            )}
            className="px-5 py-3 bg-white border border-custom-blue text-custom-blue rounded-lg hover:bg-custom-hover-blue2 transition-colors duration-400 font-medium shadow"
          >
            ⬅ Quay lại
          </Link>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default TestQuizResultPage;
