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

    LECTURER_COURSES: "/lecturer/courses",
    LECTURER_CREATE_COURSE: "/lecturer/courses/create",
    LECTURER_COURSE_DETAIL: "/lecturer/courses/:courseId",

    LECTURER_LESSON_DETAIL: "/lecturer/courses/:courseId/lessons/:lessonId",

    LECTURER_STUDENTS: "/lecturer/students",
    LECTURER_STUDENT_DETAIL: "/lecturer/students/:studentId",

    LECTURER_QUESTION_BANK: "/lecturer/question-bank",
    LECTURER_QUESTION_BANK_DETAIL: "/lecturer/question-bank/:courseId",

    LECTURER_QUIZ: "/lecturer/quiz",
    LECTURER_QUIZ_LIST: "/lecturer/quiz/:courseId/list",
    LECTURER_QUIZ_CREATE: "/lecturer/quiz/:courseId/create",
    LECTURER_QUIZ_DETAIL: "/lecturer/quiz/:courseId/:quizId",

    LECTURER_QUIZ_RESULT: "/lecturer/result-quiz",
    LECTURER_QUIZ_RESULT_LIST: "/lecturer/result-quiz/:courseId/list",
    LECTURER_QUIZ_RESULT_DETAIL: "/lecturer/result-quiz/:courseId/:quizId",

    LECTURER_NEWS: "/lecturer/news",

    // Student routes
    // STUDENT_COURSES: "/student/courses",
    STUDENT_COURSE_DETAIL: "/student/courses/:courseId",

    STUDENT_LESSON_DETAIL: "/student/courses/:courseId/lessons/:lessonId",

    STUDENT_QUIZ_TEST: "/student/quiz/:quizId/test",
    STUDENT_QUIZ_RESULT: "/student/quiz/:quizResultId/result"
}
