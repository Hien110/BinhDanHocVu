export const  ROUTE_PATH = {

    //site routes
    HOME: "/",
    COURSE: "/khoa-hoc/giang-day",
    TEST_QUIZ_LIST: "/test-quiz-list",
    NEWS: "/news",

    // Authentication routes
    VERIFY: "/verify",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    AUTH_CALLBACK: "/signin/callback",

    // User management routes
    USER_PROFILE: "/ca-nhan/ho-so",


    LECTURER_COURSES: "/giang-vien/khoa-hoc",
    LECTURER_CREATE_COURSE: "/giang-vien/khoa-hoc/tao-khoa-hoc",
    LECTURER_COURSE_DETAIL: "/giang-vien/khoa-hoc/:courseId",

    LECTURER_LESSON_LIST: "/giang-vien/khoa-hoc/:courseId/lessons",

    LECTURER_LESSON_DETAIL: "/giang-vien/khoa-hoc/:courseId/lessons/:lessonId",

    LECTURER_STUDENTS: "/giang-vien/khoa-hoc/:courseId/sinh-vien",
    LECTURER_STUDENT_DETAIL: "/quan-li/hoc-sinh/:studentId",

    LECTURER_QUESTION_BANK: "/giang-vien/question-bank",
    LECTURER_QUESTION_BANK_DETAIL: "/giang-vien/khoa-hoc/:courseName/ngan-hang-cau-hoi/:courseId",

    // bài kiểm tra
    LECTURER_QUIZ: "/giang-vien/bai-kiem-tra",
    LECTURER_QUIZ_LIST: "/giang-vien/khoa-hoc/:courseName/bai-kiem-tra/:courseId/danh-sach-bai-kiem-tra",
    LECTURER_QUIZ_CREATE: "/giang-vien/khoa-hoc/:courseName/bai-kiem-tra/:courseId/tao-bai-kiem-tra",
    LECTURER_QUIZ_DETAIL: "/giang-vien/khoa-hoc/:courseName/bai-kiem-tra/:courseId/:quizId",

    // Kết quả bài kiểm tra
    LECTURER_QUIZ_RESULT: "/giang-vien/result-bai-kiem-tra",
    LECTURER_QUIZ_RESULT_LIST: "/giang-vien/khoa-hoc/:courseName/ket-qua-bai-kiem-tra/:courseId/danh-sach",
    LECTURER_QUIZ_RESULT_DETAIL: "/giang-vien/khoa-hoc/:courseName/result-bai-kiem-tra/:courseId/:quizId",

    LECTURER_CLASSROOMS: "/giang-vien/khoa-hoc/:courseId/:courseName/lop-hoc",

    LECTURER_NEWS: "/lecturer/news",

    // Thống kế của giảng viên
    LECTURER_STATISTICS: "/giang-vien/thong-ke",

    // Student routes
    // STUDENT_COURSES: "/student/courses",
    STUDENT_COURSE_DETAIL: "/hoc-sinh/khoa-hoc/:courseId/:courseName",

    STUDENT_LESSON_DETAIL: "/hoc-sinh/khoa-hoc/:courseId/:courseName/lessons/:lessonId",

    STUDENT_QUIZ_TEST: "/hoc-sinh/kiem-tra/:quizId/:quizName",
    STUDENT_QUIZ_RESULT: "/hoc-sinh/kiem-tra/:quizResultId/ket-qua-kiem-tra",

    MY_COURSES: "/khoa-hoc-cua-toi",

    // Admin routes
    ADMIN_STATISTICS: "/quan-li/thong-ke",
    ADMIN_STUDENT_MANAGEMENT: "/quan-li/hoc-sinh",
    ADMIN_NEWS_MANAGEMENT: "/quan-li/tin-tuc",
    ADMIN_SETTINGS: "/quan-li/cai-dat",
    
    //Quản lí giảng viên
    ADMIN_LECTURER_MANAGEMENT: "/quan-li/giang-vien",
    ADMIN_LECTURER_DETAIL: "/quan-li/giang-vien/:lecturerId",

    // Binh dan so
    BINDANSO: "/khoa-hoc/binh-dan-so",
}
