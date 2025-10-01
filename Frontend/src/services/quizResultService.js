import axios from "axios";
import userService from "./userService";

const API_URL = 'https://binhdansobe-fpf2dghjbugaaqbk.southeastasia-01.azurewebsites.net/api/quiz-results';

const quizResultService = {
    // Tạo kết quả quiz
    createQuizResult: async (quizResult) => {
        try {
            const response = await axios.post(API_URL, quizResult, {
                headers: {
                    Authorization: `Bearer ${userService.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Nộp bài thành công'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response.data.message || 'Lỗi nộp bài',
                error: error.response.data.error || error.message
            };
        }
    },

    // Lấy kết quả quiz theo userId và quizId
    getQuizResultsByUserIdAndQuizId: async (userId, quizId) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${userService.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Lấy kết quả quiz thành công'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response.data.message || 'Lỗi khi lấy kết quả quiz',
                error: error.response.data.error || error.message
            };
        }
    },

    // Lấy kết quả quiz theo khóa học
    getQuizResultsByCourse: async (courseId) => {
        try {
            const response = await axios.get(`${API_URL}/course/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${userService.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Lấy kết quả quiz theo khóa học thành công'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response.data.message || 'Lỗi khi lấy kết quả quiz theo khóa học',
                error: error.response.data.error || error.message
            };
        }
    },

    // Lấy kết quả quiz theo Id
    getQuizResultById: async (quizResultId) => {
        try {
            const response = await axios.get(`${API_URL}/quizReult/${quizResultId}`, {
                headers: {
                    Authorization: `Bearer ${userService.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Lấy kết quả quiz theo Id thành công'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response.data.message || 'Lỗi khi lấy kết quả quiz theo Id',
                error: error.response.data.error || error.message
            };
        }
    },

    //Lấy kết quả theo userId
    getQuizResultsByUserId: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/getAllResult/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userService.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Lấy kết quả quiz theo userId thành công'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response.data.message || 'Lỗi khi lấy kết quả quiz theo userId',
                error: error.response.data.error || error.message
            };
        }
    },

    // Lấy kết quả quiz theo quizId
    getQuizResultsByQuizId: async (quizId) => {
        try {
            const response = await axios.get(`${API_URL}/quiz/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${userService.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Lấy kết quả quiz theo quizId thành công'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response.data.message || 'Lỗi khi lấy kết quả quiz theo quizId',
                error: error.response.data.error || error.message
            };
        }
    },

    // Lấy tất cả kết quả quiz
    getAllQuizResults: async () => {
        try {
            const response = await axios.get(`${API_URL}/`, {
                headers: {
                    Authorization: `Bearer ${userService.getToken()}`
                }
            });
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Lấy tất cả kết quả quiz thành công'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response.data.message || 'Lỗi khi lấy tất cả kết quả quiz',
                error: error.response.data.error || error.message
            };
        }
    }
};

export default quizResultService;
