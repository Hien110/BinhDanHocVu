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
};

export default classroomService;
