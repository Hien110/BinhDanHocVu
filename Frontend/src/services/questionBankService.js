import axios from "axios";
import userService from "./userService";

const API_URL = "http://localhost:3000/api/question-bank";

const questionBankService = {
  // lấy tất cả câu hỏi
  getAllQuestions: async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi khi lấy tất cả câu hỏi",
      };
    }
  },

  // Tạo câu hỏi
  createQuestion: async (questionData) => {
    try {
      const response = await axios.post(`${API_URL}`, questionData, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Tạo câu hỏi thành công",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi khi tạo câu hỏi",
      };
    }
  },

  // Lấy câu hỏi theo Id
  getQuestionById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Lấy câu hỏi theo Id thành công",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Lỗi khi lấy câu hỏi theo Id",
      };
    }
  },

  // Lấy câu hỏi theo Course
  getQuestionByCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/course/${courseId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Lấy câu hỏi theo Course thành công",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Lỗi khi lấy câu hỏi theo Course",
      };
    }
  },

  // Cập nhập câu hỏi
  updateQuestion: async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Cập nhật câu hỏi thành công",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi khi cập nhật câu hỏi",
      };
    }
  },

  //Xóa câu hỏi
  deleteQuestion: async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userService.getToken()}`,
          },
        }
      );
      return {
        success: true,
        message: response.data.message || "Xóa câu hỏi thành công",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi khi xóa câu hỏi",
      };
    }
  },

  // Tải lên file Excel
  uploadExcel: async (courseId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/upload-excel/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userService.getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Tải lên file Excel thành công",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi khi tải lên file Excel",
      };
    }
  },

  // Xóa tất cả câu hỏi theo khóa học
  deleteAllQuestionsByCourse: async (courseId) => {
    try {
      const response = await axios.put(`${API_URL}/course/${courseId}`, {}, {
        headers: {
          Authorization: `Bearer ${userService.getToken()}`,
        },
      });
      return {
        success: true,
        message: response.data.message || "Xóa tất cả câu hỏi theo khóa học thành công",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Lỗi khi xóa tất cả câu hỏi theo khóa học",
      };
    }
  },
};

export default questionBankService;
