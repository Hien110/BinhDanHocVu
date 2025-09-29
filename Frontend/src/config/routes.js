// src/config/routes.js
import React from "react";
import { ROUTE_PATH } from "../constants/routePath";

import studentLayout from "../layouts/student-layout";
import lecturerLayout from "../layouts/lecturer-layout";
import adminLayout from "../layouts/admin-layout";
import RoleLayoutSwitcher from "../layouts/RoleLayoutSwitcher"; // <-- THÊM

// ❌ BỎ: import userService from "../services/userService";
// ❌ BỎ: const currentUser = userService.getCurrentUser();

// Authentication pages
const LoginPage = React.lazy(() => import("../pages/authenticate/LoginPage"));
const RegisterPage = React.lazy(() => import("../pages/authenticate/RegisterPage"));
const VerifyPage = React.lazy(() => import("../pages/authenticate/VerifyPage"));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword"));
const AuthCallbackPage = React.lazy(() => import("../pages/AuthCallbackPage"));

// Site pages
const HomePage = React.lazy(() => import("../pages/site/HomePage"));
const CoursePage = React.lazy(() => import("../pages/site/CoursePage"));
const TestQuizListPage = React.lazy(() => import("../pages/TestQuizListPage"));
const NewsPage = React.lazy(() => import("../pages/NewsPage"));

// user management pages
const UserProfilePage = React.lazy(() => import("../pages/student/UserProfilePage"));

// lecturer pages
const ManageStaticPage = React.lazy(() => import("../pages/lecturer/ManageStaticPage"));
const ManageStudentPage = React.lazy(() => import("../pages/ManageStudentPage"));
const ManageStudentDetailPage = React.lazy(() => import("../pages/admin/ManageStudentDetailPage"));

// Question Bank
const ManageQuestionBankPage = React.lazy(() => import("../pages/ManageQuestionBankPage"));
const ManageQuestionBankDetailPage = React.lazy(() => import("../pages/lecturer/ManageQuestionBankDetailPage"));

// Courses
const ManageCoursesListPage = React.lazy(() => import("../pages/lecturer/ManageCoursesListPage"));
const ManageCourseCreatePage = React.lazy(() => import("../pages/lecturer/ManageCourseCreatePage"));
const ManageCourseDetailPage = React.lazy(() => import("../pages/lecturer/ManageCourseDetailPage"));

// Lesson
const ManageLessonListPage = React.lazy(() => import("../pages/lecturer/ManageLessonListPage"));
const ManageLessonDetailPage = React.lazy(() => import("../pages/lecturer/ManageLessonDetailPage"));

// Quiz
const ManageQuizPage = React.lazy(() => import("../pages/ManageQuizPage"));
const ManageQuizListPage = React.lazy(() => import("../pages/lecturer/ManageQuizListPage"));
const ManageQuizCreatePage = React.lazy(() => import("../pages/lecturer/ManageQuizCreatePage"));
const ManageQuizDetailPage = React.lazy(() => import("../pages/lecturer/ManageQuizDetailPage"));

const ManageQuizResultPage = React.lazy(() => import("../pages/ManageQuizResultPage"));
const ManageQuizResultCoursePage = React.lazy(() => import("../pages/lecturer/ManageQuizResultCoursePage"));
const ManageQuizResultDetailPage = React.lazy(() => import("../pages/lecturer/ManageQuizResultDetailPage"));

const ManageNewsPage = React.lazy(() => import("../pages/ManageNewsPage"));

// Classroom
const ManageStudentsInCoursePage = React.lazy(() => import("../pages/lecturer/ManageStudentInCoursePage"));

// Student pages
const CourseDetailPage = React.lazy(() => import("../pages/student/CourseDetailPage"));
const LessonDetailPage = React.lazy(() => import("../pages/student/LessonDetailPage"));
const TestQuizPage = React.lazy(() => import("../pages/student/TestQuizPage"));
const TestQuizResultPage = React.lazy(() => import("../pages/student/TestQuizResultPage"));
const MyCoursePage = React.lazy(() => import("../pages/student/MyCoursePage"));

// Admin pages
const AdminStatisticsPage = React.lazy(() => import("../pages/admin/AdminStatisticsPage"));
const AdminStudentManagementPage = React.lazy(() => import("../pages/admin/AdminManageStudentPage"));
const AdminNewsManagementPage = React.lazy(() => import("../pages/admin/AdminManageNewsPage"));
const AdminSettingPage = React.lazy(() => import("../pages/admin/AdminSettingPage"));

//Quản lí giảng viên
const AdminLecturerManagementPage = React.lazy(() => import("../pages/admin/AdminManageLecturerPage"));
const AdminManageLecturerDetail = React.lazy(() => import("../pages/admin/AdminManageLecturerDetail"));

// Binh dan so
const BinhDanSoPage = React.lazy(() => import("../pages/site/BinhDanSoPage"));

const AppRoutes = [
  // Authentication routes
  { path: ROUTE_PATH.LOGIN, page: LoginPage },
  { path: ROUTE_PATH.REGISTER, page: RegisterPage },
  { path: ROUTE_PATH.VERIFY, page: VerifyPage },
  { path: ROUTE_PATH.FORGOT_PASSWORD, page: ForgotPassword },
  { path: ROUTE_PATH.AUTH_CALLBACK, page: AuthCallbackPage },

  // Site routes
  { path: ROUTE_PATH.HOME, page: HomePage, layout: studentLayout },
  { path: ROUTE_PATH.COURSE, page: CoursePage, layout: studentLayout },
  { path: ROUTE_PATH.TEST_QUIZ_LIST, page: TestQuizListPage, layout: studentLayout },
  { path: ROUTE_PATH.NEWS, page: NewsPage, layout: studentLayout },

  // User management routes
  { path: ROUTE_PATH.USER_PROFILE, page: UserProfilePage, layout: studentLayout },
  { path: ROUTE_PATH.LECTURER_STUDENT_DETAIL, page: ManageStudentDetailPage, layout: RoleLayoutSwitcher },

  // Lecturer routes
  { path: ROUTE_PATH.LECTURER_STATISTICS, page: ManageStaticPage, layout: lecturerLayout },
  { path: ROUTE_PATH.LECTURER_STUDENTS, page: ManageStudentPage, layout: lecturerLayout },

  // Question Bank (layout động theo role)
  { path: ROUTE_PATH.LECTURER_QUESTION_BANK, page: ManageQuestionBankPage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_QUESTION_BANK_DETAIL, page: ManageQuestionBankDetailPage, layout: RoleLayoutSwitcher },

  // Courses (layout động theo role)
  { path: ROUTE_PATH.LECTURER_COURSES, page: ManageCoursesListPage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_CREATE_COURSE, page: ManageCourseCreatePage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_COURSE_DETAIL, page: ManageCourseDetailPage, layout: RoleLayoutSwitcher },

  // Lesson (layout động theo role)
  { path: ROUTE_PATH.LECTURER_LESSON_LIST, page: ManageLessonListPage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_LESSON_DETAIL, page: ManageLessonDetailPage, layout: RoleLayoutSwitcher },

  // Quiz (layout động theo role)
  { path: ROUTE_PATH.LECTURER_QUIZ, page: ManageQuizPage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_QUIZ_LIST, page: ManageQuizListPage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_QUIZ_CREATE, page: ManageQuizCreatePage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_QUIZ_DETAIL, page: ManageQuizDetailPage, layout: RoleLayoutSwitcher },

  { path: ROUTE_PATH.LECTURER_QUIZ_RESULT, page: ManageQuizResultPage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_QUIZ_RESULT_LIST, page: ManageQuizResultCoursePage, layout: RoleLayoutSwitcher },
  { path: ROUTE_PATH.LECTURER_QUIZ_RESULT_DETAIL, page: ManageQuizResultDetailPage, layout: RoleLayoutSwitcher },

  { path: ROUTE_PATH.LECTURER_NEWS, page: ManageNewsPage, layout: lecturerLayout },

  // Classroom (layout động theo role)
  { path: ROUTE_PATH.LECTURER_CLASSROOMS, page: ManageStudentsInCoursePage, layout: RoleLayoutSwitcher },

  // Student routes
  { path: ROUTE_PATH.STUDENT_COURSE_DETAIL, page: CourseDetailPage, layout: studentLayout },
  { path: ROUTE_PATH.STUDENT_LESSON_DETAIL, page: LessonDetailPage, layout: studentLayout },
  { path: ROUTE_PATH.STUDENT_QUIZ_TEST, page: TestQuizPage },
  { path: ROUTE_PATH.STUDENT_QUIZ_RESULT, page: TestQuizResultPage, layout: studentLayout },
  { path: ROUTE_PATH.MY_COURSES, page: MyCoursePage, layout: studentLayout },

  // Admin routes
  { path: ROUTE_PATH.ADMIN_STATISTICS, page: AdminStatisticsPage, layout: adminLayout },
  { path: ROUTE_PATH.ADMIN_STUDENT_MANAGEMENT, page: AdminStudentManagementPage, layout: adminLayout },
  { path: ROUTE_PATH.ADMIN_NEWS_MANAGEMENT, page: AdminNewsManagementPage, layout: adminLayout },
  { path: ROUTE_PATH.ADMIN_SETTINGS, page: AdminSettingPage, layout: adminLayout },
  
  //Quản lí giảng viên
  { path: ROUTE_PATH.ADMIN_LECTURER_MANAGEMENT, page: AdminLecturerManagementPage, layout: adminLayout },
  { path: ROUTE_PATH.ADMIN_LECTURER_DETAIL, page: AdminManageLecturerDetail, layout: adminLayout },
  
  // Binh dan so
  { path: ROUTE_PATH.BINDANSO, page: BinhDanSoPage, layout: studentLayout },
];

export default AppRoutes;
