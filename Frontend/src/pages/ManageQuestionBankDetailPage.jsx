import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import questionBankService from "../services/questionBankService";

import { toast } from "sonner";

import { AnimatePresence, motion } from "framer-motion";

function ManageQuestionBankDetailPage() {
  const { courseId } = useParams();

  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState([
    { label: "A", text: "", isCorrect: false },
    { label: "B", text: "", isCorrect: false },
    { label: "C", text: "", isCorrect: false },
    { label: "D", text: "", isCorrect: false },
  ]);

  const [editQuestion, setEditQuestion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [showDeleteAllQuestionsModal, setShowDeleteAllQuestionsModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  /** Lấy danh sách câu hỏi */
  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const result = await questionBankService.getQuestionByCourse(courseId);
      if (result.success) {
        setQuestionList(result.data);
      } else {
        toast.error(`Không thể tải câu hỏi: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách câu hỏi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [courseId]);

  /** Thêm đáp án mới */
  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      { label: alphabet[prev.length], text: "", isCorrect: false },
    ]);
  };

  /** Xóa đáp án trong form tạo */
  const handleRemoveOption = (index) => {
    const newOptions = options
      .filter((_, i) => i !== index)
      .map((opt, idx) => ({ ...opt, label: alphabet[idx] }));
    setOptions(newOptions);
  };

  /** Cập nhật đáp án trong form tạo */
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  /** Submit tạo câu hỏi */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) {
      return toast.error("Nội dung câu hỏi không được để trống!");
    }
    if (options.some((opt) => !opt.text.trim())) {
      return toast.error("Nội dung đáp án không được để trống!");
    }
    if (!options.some((opt) => opt.isCorrect)) {
      return toast.error("Phải chọn ít nhất một đáp án đúng!");
    }

    const payload = {
      course: courseId,
      question: newQuestion,
      options: options.map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    };

    try {
      const result = await questionBankService.createQuestion(payload);
      if (result.success) {
        setQuestionList((prev) => [...prev, result.data]);
        setNewQuestion("");
        setOptions([
          { label: "A", text: "", isCorrect: false },
          { label: "B", text: "", isCorrect: false },
          { label: "C", text: "", isCorrect: false },
          { label: "D", text: "", isCorrect: false },
        ]);
        toast.success("Câu hỏi đã được tạo thành công!");
      } else {
        toast.error(`Lỗi khi tạo câu hỏi: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi hệ thống khi tạo câu hỏi.");
    }
  };

  /** Mở modal edit */
  const handleEditQuestion = (question) => {
    const clone = JSON.parse(JSON.stringify(question));
    setEditQuestion(clone);
    setShowEditModal(true);
  };

  /** Đóng modal edit */
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditQuestion(null);
    setShowDeleteQuestionModal(false);
    setSelectedQuestion(null);
    setShowDeleteAllQuestionsModal(false);
  };

  /** Cập nhật field trong edit */
  const handleChangeField = (field, value) => {
    setEditQuestion((prev) => ({ ...prev, [field]: value }));
  };

  /** Cập nhật option trong edit */
  const handleChangeOption = (index, key, value) => {
    const updatedOptions = [...editQuestion.options];
    updatedOptions[index][key] = value;
    setEditQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  /** Thêm đáp án mới trong edit */
  const handleAddEditOption = () => {
    setEditQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", isCorrect: false }],
    }));
  };

  /** Xóa đáp án trong edit */
  const handleRemoveEditOption = (index) => {
    setEditQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== index),
    }));
  };

  /** Lưu edit */
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editQuestion.question.trim()) {
      return toast.error("Nội dung câu hỏi không được để trống!");
    }
    if (editQuestion.options.some((opt) => !opt.text.trim())) {
      return toast.error("Nội dung đáp án không được để trống!");
    }
    if (!editQuestion.options.some((opt) => opt.isCorrect)) {
      return toast.error("Phải chọn ít nhất một đáp án đúng!");
    }

    try {
      setSaving(true);
      const result = await questionBankService.updateQuestion(
        editQuestion._id,
        editQuestion
      );
      if (result.success) {
        await fetchQuestion();
        toast.success("Cập nhật câu hỏi thành công!");
        handleCloseModal();
      } else {
        toast.error(`Lỗi khi cập nhật: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi hệ thống khi cập nhật câu hỏi.");
    } finally {
      setSaving(false);
    }
  };

  /** Xóa 1 câu hỏi */
  const handleDeleteQuestion = async () => {
    try {
      const res = await questionBankService.deleteQuestion(
        selectedQuestion._id
      );
      if (res.success) {
        setQuestionList((prev) =>
          prev.filter((q) => q._id !== selectedQuestion._id)
        );
        toast.success("Xóa câu hỏi thành công!");
      } else {
        toast.error(`Xóa thất bại: ${res.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa câu hỏi.");
    } finally {
      setShowDeleteQuestionModal(false);
      fetchQuestion(); // Refresh danh sách câu hỏi
    }
  };

  /** Xóa tất cả câu hỏi */
  const handleDeleteAllQuestions = async () => {
    try {
      const res = await questionBankService.deleteAllQuestionsByCourse(
        courseId
      );
      if (res.success) {
        setQuestionList([]);
        toast.success("Đã xóa tất cả câu hỏi!");
      } else {
        toast.error(`Xóa tất cả thất bại: ${res.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa tất cả câu hỏi.");
    } finally {
      setShowDeleteAllQuestionsModal(false);
    }
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file Excel");
      return;
    }

    try {
      const res = await questionBankService.uploadExcel(courseId, file);
      if (res.success) {
        toast.success(res.message);
        setFile(null); // Reset file input
        fetchQuestion();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi tải file");
    }
  };

  const filteredQuestions = questionList.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center min-h-screen">Loading...</p>;
  }

  return (
    <div className="mx-auto">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800 border-b border-gray-300 pb-3">
        Ngân hàng câu hỏi
      </h1>
      {/* Tổng số câu hỏi */}
      <div className="mb-4 text-red-400">
        <span className="font-bold">Tổng số câu hỏi:</span> {questionList.length}{" "}
        câu hỏi
      </div>
      {/* Ô tìm kiếm */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Danh sách câu hỏi */}
      {filteredQuestions.length === 0 ? (
        <p className="text-center text-gray-500 border border-gray-200 rounded-lg py-10 bg-gray-50 shadow-sm">
          Không có câu hỏi nào trong ngân hàng.
        </p>
      ) : (
        <>
          <ul className="space-y-6">
            {filteredQuestions.map((item, index) => (
              <li
                key={item._id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-lg text-gray-800">
                    Câu hỏi {index + 1}:{" "}
                    <span className="font-normal">{item.question}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditQuestion(item)}
                      className="cursor-pointer px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Chỉnh Sửa
                    </button>
                    <button
                      onClick={() => {
                        setSelectedQuestion(item);
                        setShowDeleteQuestionModal(true);
                      }}
                      className="cursor-pointer px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      🗑 Xóa
                    </button>
                  </div>
                </div>
                <ul className="space-y-2 pl-5">
                  {item.options.map((opt, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        opt.isCorrect
                          ? "bg-green-50 text-green-700 border border-green-300"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="font-bold">{alphabet[idx]}.</span>
                      <span>{opt.text}</span>
                      {opt.isCorrect && (
                        <span className="ml-2 text-sm font-medium text-green-600">
                          Đáp án đúng
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowDeleteAllQuestionsModal(true)}
              className="cursor-pointer py-3 px-5 rounded-xl text-red-500 font-semibold bg-white border border-red-500 hover:bg-red-500 hover:text-white shadow-md transition-all duration-300"
            >
              🗑 Xóa tất cả câu hỏi
            </button>
          </div>
        </>
      )}
      {/* Tạo câu hỏi bằng excel */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-6 text-red-700 border-b border-gray-300 pb-2">
          Tạo câu hỏi bằng Excel
        </h2>
        <div>
          <input
            type="file"
            accept=".xlsx, .xls"
            className="border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-red-50 file:text-red-700
                     hover:file:bg-red-100"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Chọn file Excel chứa câu hỏi để tải lên
        </p>
        {/*  */}
        <button
          onClick={handleUpload}
          className="cursor-pointer mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
        >
          Tạo câu hỏi
        </button>

        {/* File mẫu */}
        <a
          href={`${import.meta.env.BASE_URL}TaoCauHoiMau.xlsx`}
          download
          className="text-sm text-blue-600 hover:underline mt-2 block"
        >
          Tải về file mẫu
        </a>
      </div>
      {/* Form tạo câu hỏi */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 text-red-700 border-b border-gray-300 pb-2">
          Tạo câu hỏi mới
        </h2>
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-xl shadow-lg space-y-5 border border-gray-200"
        >
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Nội dung câu hỏi
            </label>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              rows="4"
            />
          </div>

          <div className="space-y-3">
            {options.map((opt, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <span className="font-bold">{opt.label}.</span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                  className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder={`Nội dung đáp án ${opt.label}`}
                />
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) =>
                      handleOptionChange(index, "isCorrect", e.target.checked)
                    }
                    className="cursor-pointer w-4 h-4"
                  />
                  Đúng
                </label>
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="cursor-pointer bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddOption}
              className="cursor-pointer bg-white text-yellow-600 border border-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-all duration-300"
            >
              Thêm đáp án
            </button>
          </div>

          <button
            type="submit"
            className="cursor-pointer py-3 px-4 w-full rounded-xl text-white font-semibold bg-red-500 hover:bg-red-600 shadow-md transition-all duration-300"
          >
            Tạo câu hỏi
          </button>
        </form>
      </div>

      {/* Modal edit */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-[2000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-red-600">
                Chỉnh sửa câu hỏi
              </h2>
              {editQuestion && (
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Nội dung câu hỏi
                    </label>
                    <textarea
                      value={editQuestion.question}
                      onChange={(e) =>
                        handleChangeField("question", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                      rows="3"
                    />
                  </div>

                  {editQuestion.options?.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 border p-2 rounded-lg"
                    >
                      <span className="font-bold">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) =>
                          handleChangeOption(idx, "text", e.target.value)
                        }
                        className="flex-1 border border-gray-300 p-2 rounded-lg"
                      />
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) =>
                            handleChangeOption(
                              idx,
                              "isCorrect",
                              e.target.checked
                            )
                          }
                        />
                        Đúng
                      </label>
                      {editQuestion.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEditOption(idx)}
                          className="cursor-pointer bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                        >
                          ✖
                        </button>
                      )}
                    </div>
                  ))}

                  <div>
                    <button
                      type="button"
                      onClick={handleAddEditOption}
                      className="bg-white text-yellow-600 border border-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-all duration-300 cursor-pointer"
                    >
                      Thêm đáp án
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for deleting course */}
      <AnimatePresence>
        {showDeleteQuestionModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Xóa câu hỏi
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa câu hỏi này không?
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteQuestion();
                }}
              >
                {/* Buttons */}
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for deleting all questions by course */}
      <AnimatePresence>
        {showDeleteAllQuestionsModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Xóa câu hỏi
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa toàn bộ ngân hàng câu hỏi không?
              </p>
              <p className="text-sm text-red-600 mb-4 text-center">
                Tất cả câu hỏi sẽ bị xóa và không thể khôi phục.
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteAllQuestions();
                }}
              >
                {/* Buttons */}
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManageQuestionBankDetailPage;
