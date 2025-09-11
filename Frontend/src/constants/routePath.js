export const  ROUTE_PATH = {

    //site routes
    HOME: "/",
    COURSE: "/course",
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
    USER_PROFILE: "/user/profile",

    // Lecturer routes
    LECTURER_STATISTICS: "/lecturer/statistics",

    LECTURER_COURSES: "/giang-vien/khoa-hoc",
    LECTURER_CREATE_COURSE: "/giang-vien/khoa-hoc/tao-khoa-hoc",
    LECTURER_COURSE_DETAIL: "/giang-vien/khoa-hoc/:courseId",

    LECTURER_LESSON_LIST: "/giang-vien/khoa-hoc/:courseId/lessons",

    LECTURER_LESSON_DETAIL: "/giang-vien/khoa-hoc/:courseId/lessons/:lessonId",

    LECTURER_STUDENTS: "/giang-vien/khoa-hoc/:courseId/sinh-vien",
    LECTURER_STUDENT_DETAIL: "/giang-vien/khoa-hoc/:courseId/sinh-vien/:studentId",

    LECTURER_QUESTION_BANK: "/giang-vien/question-bank",
    LECTURER_QUESTION_BANK_DETAIL: "/giang-vien/khoa-hoc/:courseName/ngan-hang-cau-hoi/:courseId",

    LECTURER_QUIZ: "/giang-vien/bai-kiem-tra",
    LECTURER_QUIZ_LIST: "/giang-vien/khoa-hoc/:courseName/bai-kiem-tra/:courseId/danh-sach-bai-kiem-tra",
    LECTURER_QUIZ_CREATE: "/giang-vien/khoa-hoc/:courseName/bai-kiem-tra/:courseId/tao-bai-kiem-tra",
    LECTURER_QUIZ_DETAIL: "/giang-vien/khoa-hoc/:courseName/bai-kiem-tra/:courseId/:quizId",

    LECTURER_QUIZ_RESULT: "/giang-vien/result-bai-kiem-tra",
    LECTURER_QUIZ_RESULT_LIST: "/giang-vien/result-bai-kiem-tra/:courseId/danh-sach",
    LECTURER_QUIZ_RESULT_DETAIL: "/giang-vien/result-bai-kiem-tra/:courseId/:quizId",

    LECTURER_NEWS: "/lecturer/news",

    // Student routes
    // STUDENT_COURSES: "/student/courses",
    STUDENT_COURSE_DETAIL: "/hoc-sinh/khoa-hoc/:courseId/:courseName",

    STUDENT_LESSON_DETAIL: "/student/courses/:courseId/lessons/:lessonId",

    STUDENT_QUIZ_TEST: "/student/quiz/:quizId/test",
    STUDENT_QUIZ_RESULT: "/student/quiz/:quizResultId/result",

    // Admin routes
    ADMIN_STATISTICS: "/quan-li/thong-ke",
    ADMIN_LECTURER_MANAGEMENT: "/quan-li/giang-vien",
    ADMIN_STUDENT_MANAGEMENT: "/quan-li/hoc-sinh",
    ADMIN_NEWS_MANAGEMENT: "/quan-li/tin-tuc",
    ADMIN_SETTINGS: "/quan-li/cai-dat"

}
