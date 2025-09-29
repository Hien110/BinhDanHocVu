import React, { useEffect, useState } from "react";

import courseService from "../../services/courseService";
import lessonService from "../../services/lessonService";
import QuizService from "../../services/quizService";
import quizResultService from "../../services/quizResultService";
import classRoomService from "../../services/classRoomService";

import { Link, useParams, useNavigate } from "react-router-dom";
import CourseDetailCard from "../../components/CourseDetailCard";

import { ROUTE_PATH } from "../../constants/routePath";
import userService from "../../services/userService";
import { toast } from "sonner";

function CourseDetailPage() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [checkJoinCourse, setCheckJoinCourse] = useState(false);

  const [activeTab, setActiveTab] = useState("gioithieu");

  const user = userService.getCurrentUser();

  const navigate = useNavigate();
  useEffect(() => {
    // Load course chi tiết
    const fetchCourse = async () => {
      const res = await courseService.getCourseById(courseId);
      if (res.success) {
        setCourse(res.data);
        // Tăng số lượt xem khóa học
        await courseService.incrementCourseViews(courseId);
      }
    };

    const fetchLessons = async () => {
      const res = await lessonService.getLessonsByCourse(courseId);
      if (res.success) setLessons(res.data);
    };

    const fetchQuizzes = async () => {
      const res = await QuizService.getQuizzesByCourse(courseId);
      if (res.success) setQuizzes(res.data);
    };

    const checkRegisterCourse = async () => {
      if (!user) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        navigate(ROUTE_PATH.LOGIN);
        return;
      }

      const res = await classRoomService.checkRegistered(courseId);
      if (res.success) {
        setCheckJoinCourse(res.isRegistered);
      } else {
        toast.error(res.message || "Lỗi khi kiểm tra đăng ký khóa học");
      }
    };

    fetchCourse();
    fetchLessons();
    fetchQuizzes();
    checkRegisterCourse();
  }, [courseId]);

  const handleViewLesson = (lessonId) => {
    // Navigate to the lesson detail page
    window.location.href = ROUTE_PATH.STUDENT_LESSON_DETAIL.replace(
      ":courseId",
      courseId
    )
      .replace(":lessonId", lessonId)
      .replace(":courseName", course.title.replace(/\s+/g, "-").toLowerCase());
  };

  //xử lí vào làm bài
  const handleQuizTest = async (quizId) => {
    if (!user?._id) {
      toast.error("Không tìm thấy thông tin người dùng");
      navigate(ROUTE_PATH.LOGIN);
      return;
    }

    try {
      const [existingQuizResult, quizTest] = await Promise.all([
        quizResultService.getQuizResultsByUserIdAndQuizId(user._id, quizId),
        QuizService.getQuizById(quizId),
      ]);

      if (user.role !== "student") {
        toast.error("Chỉ có học sinh mới có thể làm bài kiểm tra.");
        return;
      }

      if (!existingQuizResult?.success || !quizTest?.success) {
        toast.error("Không thể tải dữ liệu bài quiz");
        return;
      }

      if (existingQuizResult.data?.length >= quizTest.data?.attempts) {
        toast.error("Bạn đã hết số lượt kiểm tra bài này.");
        return;
      }


      window.location.href = ROUTE_PATH.STUDENT_QUIZ_TEST.replace(
        ":quizId",
        quizId
      ).replace(
        ":quizName",
        quizTest.data.title.replace(/\s+/g, "-").toLowerCase()
      );
    } catch (error) {
      toast.error("Lỗi khi kiểm tra bài quiz");
      console.error(error);
    }
  };

  // Hàm join khóa học
  const handleJoinCourse = async (e) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tham gia khóa học");
      navigate(ROUTE_PATH.LOGIN);
      return;
    }
    let courseCode = "";
    if (course.subject === "BinhDanSo") {
      courseCode = course.code;
    } else {
      courseCode = e.target.courseCode.value.trim();
    }
    if (!courseCode) {
      toast.error("Vui lòng nhập mã khóa học");
      return;
    }
    if (courseCode !== course.code) {
      toast.error("Mã khóa học không đúng");
      return;
    }

    const res = await classRoomService.joinClassRoom(courseId);
    if (res.success) {
      toast.success("Tham gia khóa học thành công");
      setCheckJoinCourse(true);
      // Reload lại trang để hiển thị nội dung khóa học
      // window.location.reload();
    } else {
      toast.error(res.message || "Tham gia khóa học thất bại");
    }
  };

  if (!course) {
    return <div>Đang tải khóa học...</div>;
  }

  return (
    <div className="min-h-screen pt-6 px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row gap-6">
      {/* Nội dung chính */}
      {checkJoinCourse === false && user.role !== "admin" && course.type === "learning" ? (
        <div className="w-full lg:w-3/4 lg:border-r lg:pr-8 border-gray-100">
          {/* Header + Thông tin khóa học */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 mb-6">
            <div className="flex flex-col xl:flex-row gap-6 border-b border-gray-100 pb-6 mb-6">
              {/* Thumbnail */}
              <div className="w-full xl:w-1/3">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="rounded-2xl w-full h-56 object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-400">
                    Không có ảnh
                  </div>
                )}
              </div>

              {/* Title + Meta */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 2v3M8 2v3M3 9h18M4 5h16a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {course?.createdAt
                    ? new Date(course.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>

                {/* Form tham gia */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleJoinCourse(e);
                  }}
                  className="mt-4 flex gap-2"
                >
                    <input
                      type="text"
                      name="courseCode"
                      placeholder="Nhập mã khóa học"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-2 
             focus:outline-none focus:ring-2 focus:ring-custom-blue/30 
             focus:border-custom-blue"
                    />

                  <button
                    type="submit"
                    className="cursor-pointer rounded-xl bg-custom-blue hover:bg-custom-hover-blue text-white px-5 py-2 font-medium hover:shadow-md transition duration-400"
                  >
                    Tham gia 
                  </button>
                </form>
              </div>
            </div>

            {/* Tabs: Giới thiệu / Nội dung */}
            <div>
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 font-medium cursor-pointer ${
                    activeTab === "gioithieu"
                      ? "text-custom-blue border-b-2 border-custom-blue"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("gioithieu")}
                >
                  Giới thiệu
                </button>
                <button
                  className={`px-4 py-2 font-medium cursor-pointer ${
                    activeTab === "noidung"
                      ? "text-custom-blue border-b-2 border-custom-blue"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("noidung")}
                >
                  Nội dung khóa học
                </button>
              </div>

              {activeTab === "gioithieu" && (
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: course.description || "<p>Không có mô tả</p>",
                  }}
                />
              )}

              {activeTab === "noidung" && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-700">
                    Tổng số bài học: {lessons.length} bài
                  </div>
                  {lessons.map((lesson) => (
                    <div key={lesson._id} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-custom-blue rounded-full"></span>
                      <span className="text-gray-700">{lesson.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-3/4 border-gray-300 lg:border-r lg:pr-6">
          <div className="bg-white">
            {/* Thông tin khóa học */}
            <div className="pb-6 mb-10 border-b border-gray-300">
              <CourseDetailCard course={course} />
            </div>
          </div>

          {/* Danh sách bài học */}
          <section className="mb-12 border-b border-gray-300 pb-6">
            <h2 className="text-xl sm:text-2xl font-semibold  mb-6 border-b border-gray-300 pb-2">
              Danh sách bài học
            </h2>

            {lessons.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có bài học nào</p>
            ) : (
              <ul className="space-y-4 sm:space-y-6">
                {lessons.map((lesson, index) => (
                  <li
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white hover:bg-gray-50"
                  >
                    <div className="">
                      <h3 className="text-lg">{lesson.title}</h3>
                    </div>
                    <div>
                      <button
                        onClick={() => handleViewLesson(lesson._id)}
                        className="cursor-pointer text-custom-blue border border-custom-blue px-4 py-2 text-sm rounded-lg hover:bg-custom-hover-blue2 font-medium transition duration-300"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Danh sách quiz */}
          <section className="mb-12 border-b border-gray-300 pb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 border-b border-gray-300 pb-2">
              Danh sách bài kiểm tra
            </h2>

            {quizzes.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có bài kiểm tra nào</p>
            ) : (
              <ul className="space-y-4 sm:space-y-6">
                {quizzes.map((quiz, index) => (
                  <li
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-row sm:flex-row sm:justify-between sm:items-center gap-4 bg-white hover:bg-gray-50"
                  >
                    <div className="">
                      <h3 className="text-lg max-w-md">{quiz.title}</h3>
                    </div>

                    <div className="text-gray-600">
                      <p className="text-gray-600">
                        <span className="font-medium">Số câu hỏi:</span>{" "}
                        {quiz.totalQuestions}
                      </p>
                      <p>
                        <span className="font-medium">Thời gian:</span>{" "}
                        {quiz.timeLimit} phút
                      </p>
                      <p>
                        <span className="font-medium">Số lần làm:</span>{" "}
                        {quiz.attempts}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => handleQuizTest(quiz._id)}
                        className="cursor-pointer text-custom-blue border border-custom-blue px-4 py-2 text-sm rounded-lg hover:bg-custom-hover-blue2 font-medium transition duration-300"
                      >
                        Làm bài ngay
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* Sidebar các môn học khác */}
      {/* <div className="w-full lg:w-1/4 lg:pl-6 mb-10">
        <h2 className="text-lg sm:text-xl text-custom-blue font-semibold mb-4">
          Các môn học khác
        </h2>
        <ul className="space-y-4 pr-1">
          {getAllCourses
            .filter((item) => item._id !== courseId)
            .map((item) => (
              <li
                key={item._id}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
              >
                <Link
                  to={`${ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
                    ":courseId",
                    item._id
                  ).replace(
                    ":courseName",
                    item.title.replace(/\s+/g, "-").toLowerCase()
                  )}`}
                  className="block p-4"
                >
                  <img
                    src={item.thumbnail || "https://via.placeholder.com/150"}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-custom-blue mb-1 cursor-pointer">
                    {item.title}
                  </h3>
                </Link>
              </li>
            ))}
        </ul>
      </div> */}

      {/* Thông tin giáo viên */}
      <div className="w-full lg:w-1/4 lg:pl-6 mb-10">
        <h2 className="text-lg sm:text-xl text-custom-blue font-semibold mb-6 text-center">
          Thông tin giáo viên
        </h2>
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            {course.instructor.avatar ? (
              <img
                src={course.instructor.avatar}
                alt={course.instructor.fullName}
                className="w-full h-full object-cover rounded-full border-4 border-custom-blue transition-all duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full"></div>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-custom-blue mb-2 text-center">
            {course.instructor.role === "admin"
              ? "Quản trị viên"
              : course.instructor.fullName || course.instructor.email}
          </h3>
          {/* bio */}
          {course.instructor.bio && (
            <p className="text-gray-600 mb-2 text-center line-clamp-3">
              {course.instructor.bio}
            </p>
          )}
          {/* Nơi làm việc */}
          {course.instructor.workplace && (
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Nơi làm việc:</span>{" "}
              {course.instructor.workplace}
            </p>
          )}
          {course.instructor.role !== "admin" && (
            <div className="flex space-x-2">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {course.instructor.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
