import axios from "axios";
import userService from "./userService";

const API_URL = "http://localhost:3000/api/classrooms";

const classroomService = {
  // Tham gia lớp học
  joinClassRoom: async (courseId) => {
    try {
      const response = await axios.post(`${API_URL}/join`, { courseId }, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    } catch (error) {
      console.error("Error joining classroom:", error);
      throw error;
    }
  },
  // Check đăng ký khóa học
  checkRegistered: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/check/${courseId}`, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      console.log(response.data);
      
      return {
        success: true,
        isRegistered: response.data.registered,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        isRegistered: false,
        message: error?.response?.data?.message || "Lỗi khi kiểm tra đăng ký",
      };
    }
  },

  // Lấy danh sách lớp học của người dùng
  getUserClassRooms: async () => {
    try {
      const response = await axios.get(`${API_URL}/personal-classrooms`, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching user classrooms:", error);
      throw error;
    }
  },

  // Rời khỏi lớp học
  leaveClassRoom: async (classRoomId) => {
    try {
      const response = await axios.delete(`${API_URL}/leave/${classRoomId}`, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error leaving classroom:", error);
      throw error;
    }
  },

  // Lấy danh sách học sinh trong một khóa học (dành cho giảng viên)
  getStudentsInCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}/students`, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching students in course:", error);
      throw error;
    }
  },

};

export default classroomService;
