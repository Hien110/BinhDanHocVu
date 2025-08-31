import axios from "axios";

import userService from "./userService";

const API_URL = "http://localhost:3000/api/quizzes";

const QuizService = {

  // Lấy danh sách quiz theo khóa học
  getQuizzesByCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/${courseId}/quizzes`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      throw error;
    }
  },

  // Tạo bài kiểm tra
  createQuiz: async (courseId, newQuiz) => {

    try {
      const response = await axios.post(
        `${API_URL}/${courseId}/quizzes`,
        newQuiz,
        {
          headers: {
            Authorization: `Bearer ${userService.getToken()}`,
          },
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi tạo quiz",
      };
    }
  },

  //Xóa bài kiểm tra
  deleteQuiz: async (courseId, quizId) => {
    try {
      const response = await axios.put(
        `${API_URL}/${courseId}/quizzes/${quizId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userService.getToken()}`,
          },
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi xóa quiz",
      };
    }
  },

  // Lấy bài ktra theo Id
  getQuizById: async (quizId) => {
    try {
      const response = await axios.get(`${API_URL}/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Lấy bài kiểm tra thành công",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi khi lấy bài kiểm tra theo Id",
      };
    }
  },

  //Câp nhập quiz
  updateQuiz: async (quizId, updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/quizzes/${quizId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${userService.getToken()}`,
          },
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Cập nhật bài kiểm tra thành công",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi khi cập nhật bài kiểm tra",
      };
    }
  },

  // Lấy tất cả các quiz
  getAllQuizzes: async () => {
    try {
      const response = await axios.get(`${API_URL}/all-quiz`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Lấy tất cả bài kiểm tra thành công",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi khi lấy tất cả bài kiểm tra",
      };
    }
  },
};

export default QuizService;
