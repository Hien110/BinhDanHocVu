import axios from "axios";
import userService from "./userService";

const API_URL = "http://localhost:3000/api/courses";

const courseService = {
  createCourse: async (newCourse) => {
    try {
      const token = userService.getToken();
      const response = await axios.post(`${API_URL}/create`, newCourse, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        success: true,
        message: response.data.message,
        course: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Tạo khóa học thất bại",
      };
    }
  },

  // Lấy khóa học theo người tạo
  getCoursesByInstructor: async () => {
    try {
      const response = await axios.get(`${API_URL}/instructor`, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Lỗi khi lấy khóa học theo giảng viên",
      };
    }
  },

  // Lấy khóa học theo Id
  getCourseById: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/${courseId}`);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Lỗi khi lấy khóa học theo ID",
      };
    }
  },

  // Xóa khóa học
  deleteCourse: async (courseId) => {
    try {
      const response = await axios.put(`${API_URL}/deleted/${courseId}`, {}, {
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
          error?.response?.data?.message || "Lỗi khi xóa khóa học",
      };
    }
  },

  updateCourse: async (courseId, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/update/${courseId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        message: response.data.message,
        course: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Lỗi khi cập nhật khóa học",
      };
    }
  },

  //Lấy toàn bộ khóa học
  getAllCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Lỗi khi lấy toàn bộ khóa học",
      };
    }
  },

  // Lấy 3 khóa học theo mỗi môn học
  getTop3CoursesBySubject: async () => {
    try {
      const response = await axios.get(`${API_URL}/subject/top3`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Lỗi khi lấy khóa học theo môn học",
      };
    }
  },
};

export default courseService;
