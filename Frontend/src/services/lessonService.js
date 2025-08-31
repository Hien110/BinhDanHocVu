import axios from "axios";

import userService from "./userService";

const API_URL = "http://localhost:3000/api/lessons";

const lessonService = {
  // Tạo bài học
  createLesson: async (newLesson) => {
    try {
      const response = await axios.post(
        `${API_URL}/${newLesson.course}/lessons`,
        newLesson
      , {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Lỗi khi tạo bài học:", error);
      return { success: false, message: "Tạo bài học thất bại" };
    }
  },

  // Lấy bài học theo môn
  getLessonsByCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/${courseId}/lessons`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài học:", error);
      return { success: false, message: "Lấy danh sách bài học thất bại" };
    }
  },

  // Lấy bài học theo Id
  getLessonById: async (lessonId) => {

    try {
      const response = await axios.get(`${API_URL}/${lessonId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Lỗi khi lấy bài học:", error);
      return { success: false, message: "Lấy bài học thất bại" };
    }
  },

  // Xóa bài học
  deleteLesson: async (lessonId) => {
    try {
      console.log(userService.getToken());
      
      const response = await axios.put(`${API_URL}/deleted/${lessonId}`, {}, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Lỗi khi xóa bài học",
      };
    }
  },

  //Cập nhập bài học
  updateLesson: async (lessonId, updatedLesson) => {
    try {
      const response = await axios.put(`${API_URL}/update/${lessonId}`, updatedLesson, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật bài học:", error);
      return { success: false, message: "Cập nhật bài học thất bại" };
    }
  },

  // Lấy tất cả bài học
  getAllLessons: async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Lỗi khi lấy tất cả bài học:", error);
      return { success: false, message: "Lấy tất cả bài học thất bại" };
    }
  }
};

export default lessonService;
