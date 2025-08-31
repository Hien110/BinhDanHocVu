/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { convertYouTubeUrlToEmbed } from "../utils/youtube";

import { motion, AnimatePresence } from "framer-motion";

import MyEditor from "./MyEditor";

import lessonService from "../services/lessonService";
import userService from "../services/userService";

import {
  uploadMultipleFilesToCloudinary,
  uploadMultipleImagesToCloudinary,
} from "../services/uploadCloudinary";

import { toast } from "sonner";

function LessonDetailCard({ lesson }) {
  const user = userService.getCurrentUser();

  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [editLesson, setEditLesson] = useState({
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.videoUrl,
    imageUrls: lesson.imageUrls,
    fileUrls: lesson.fileUrls,
  });

  const [lessonImages, setLessonImages] = useState([]);
  const [lessonFiles, setLessonFiles] = useState([]);

  const lessonImagesRef = useRef(null);
  const lessonFilesRef = useRef(null);
  const closeModals = () => {
    setEditLesson({
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.videoUrl,
    imageUrls: lesson.imageUrls,
    fileUrls: lesson.fileUrls,
  });
    setShowEditModal(false);
  };

  const handleEditLesson = async () => {
    setLoadingLesson(true);

    try {
      // Upload ảnh nội dung
      const imageUrls = await uploadMultipleImagesToCloudinary(lessonImages);

      // Upload file PDF/Word
      const fileUrls = await uploadMultipleFilesToCloudinary(lessonFiles);

      // ghép URL mới và URL cũ với nhau thành 1 mảng
      const combinedImageUrls = [...editLesson.imageUrls, ...imageUrls];
      const combinedFileUrls = [...editLesson.fileUrls, ...fileUrls];

      const updatedLesson = {
        ...editLesson,
        imageUrls: combinedImageUrls,
        fileUrls: combinedFileUrls,
      };

      const res = await lessonService.updateLesson(lesson._id, updatedLesson);

      if (res.success) {
        toast.success("Cập nhật bài học thành công");
        setShowEditModal(false);
        // Cập nhật lại bài học trong state
        setEditLesson({
          title: updatedLesson.title,
          content: updatedLesson.content,
          videoUrl: updatedLesson.videoUrl,
          imageUrls: updatedLesson.imageUrls,
          fileUrls: updatedLesson.fileUrls,
        });
        if (lessonImagesRef.current) lessonImagesRef.current.value = "";
        if (lessonFilesRef.current) lessonFilesRef.current.value = "";
      } else {
        toast.error("Cập nhật bài học thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật bài học");
      console.error(error);
    } finally {
      setLoadingLesson(false);
      setLessonImages([]);
      setLessonFiles([]);
    }
  };

  // xử lí từng ảnh
  const handleRemoveImage = (index) => {
    const newImageUrls = [...editLesson.imageUrls];
    newImageUrls.splice(index, 1);
    setEditLesson((prev) => ({ ...prev, imageUrls: newImageUrls }));
  };

  // xử lí xóa file
  const handleRemoveFile = (index) => {
    const newFileUrls = [...editLesson.fileUrls];
    newFileUrls.splice(index, 1);
    setEditLesson((prev) => ({ ...prev, fileUrls: newFileUrls }));
  };

  if (!editLesson){
    return (
        <div>Loading...</div>
    );
  }
  return (
    <div className="bg-white rounded-xl p-6 max-w-full mx-auto ">
      {/* Tên khoá học */}
      <h2 className="text-3xl font-bold text-red-600 mb-6 border-b pb-2">
        {lesson.course.title}
      </h2>

      {/* Tiêu đề bài học */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold mb-3 text-yellow-600">
          {editLesson.title}
        </h3>
        {user.role === "lecturer" && (
          <button
            onClick={() => setShowEditModal(true)}
            className="cursor-pointer text-red-600 border border-red-600 px-4 py-2 rounded-lg text-sm transition duration-300 hover:bg-red-100 font-medium"
          >
            Chỉnh sửa bài học
          </button>
        )}
      </div>

      {/* Hình ảnh bài học */}
      {lesson.imageUrls?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Hình ảnh bài học
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {editLesson.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Hình ảnh bài học ${index + 1}`}
                className="w-full h-[300px] rounded-lg shadow hover:scale-105 transform transition duration-300"
              />
            ))}
          </div>
        </div>
      )}

      {/* Nội dung */}
      <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
        Nội dung bài học
      </h4>
      <div
        className="prose prose-sm text-gray-700 mb-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: editLesson.content }}
      />

      {/* Video bài học */}

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Video bài học
        </h4>
      </div>
      {editLesson.videoUrl && (
        <div className="mb-6 w-full h-100 rounded-lg overflow-hidden shadow-md">
          <iframe
            src={convertYouTubeUrlToEmbed(editLesson.videoUrl)}
            title="YouTube video player"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Tài liệu đính kèm */}
      {editLesson.fileUrls?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            📄 Tài liệu đính kèm
          </h4>
          <ul className="space-y-2">
            {editLesson.fileUrls.map((fileUrl, index) => (
              <li
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="text-gray-600 font-medium">
                  Tài liệu {index + 1}:
                </span>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Xem / Tải xuống
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Chỉnh sửa môn học
              </h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditLesson();
                }}
              >
                {/* Form fields for editing course */}
                <div>
                  <label
                    htmlFor="lessonTitle"
                    className="block mb-2 text-yellow-600 font-semibold text-gray-700"
                  >
                    Tiêu đề bài học
                  </label>
                  <input
                    id="lessonTitle"
                    type="text"
                    defaultValue={editLesson.title}
                    onChange={(e) =>
                      setEditLesson({ ...editLesson, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    placeholder="Nhập tiêu đề bài học"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lessonContent"
                    className="block mb-2 text-yellow-600 font-semibold text-gray-700"
                  >
                    Nội dung bài học
                  </label>
                  <MyEditor
                    content={editLesson.content}
                    onChangeContent={(newContent) =>
                      setEditLesson({ ...editLesson, content: newContent })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="lessonVideoUrl"
                    className="block mb-2 font-semibold text-gray-700"
                  >
                    URL video youtube (nếu có)
                  </label>
                  <input
                    id="lessonVideoUrl"
                    type="url"
                    defaultValue={editLesson.videoUrl}
                    onChange={(e) =>
                      setEditLesson({ ...editLesson, videoUrl: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    placeholder="Nhập URL video bài học"
                  />
                </div>

                {/* Upload ảnh đại diện */}
                <div>
                  <label
                    htmlFor="lessonImages"
                    className="block mb-2 font-semibold text-gray-700"
                  >
                    Ảnh nội dung bài học (jpg, png) — có thể chọn nhiều ảnh
                  </label>
                  <input
                    id="lessonImages"
                    type="file"
                    accept="image/*"
                    multiple
                    ref={lessonImagesRef}
                    onChange={(e) =>
                      setLessonImages(Array.from(e.target.files))
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                  {/* Hiển thị ảnh cũ cùng với dấu X trên từng ảnh để có thể xóa đi */}
                  {editLesson.imageUrls && editLesson.imageUrls.length > 0 && (
                    <div className="mt-2">
                      {editLesson.imageUrls.map((url, index) => (
                        <div key={index} className="relative inline-block mr-2">
                          <img
                            src={url}
                            alt={`Lesson Image ${index + 1}`}
                            className="w-25 h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="cursor-pointer absolute -top-2 -right-2 bg-red-400 w-5 h-5 text-white rounded-full"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upload file PDF hoặc Word */}
                <div>
                  <label
                    htmlFor="lessonFile"
                    className="block mb-2 font-semibold text-gray-700"
                  >
                    File tài liệu (PDF, Word)
                  </label>
                  <input
                    id="lessonFile"
                    type="file"
                    accept=".pdf, .doc, .docx"
                    multiple
                    ref={lessonFilesRef}
                    onChange={(e) => setLessonFiles(Array.from(e.target.files))}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                  {/* Hiển thị file cũ cùng với dấu X trên từng file để có thể xóa đi */}
                  {editLesson.fileUrls && editLesson.fileUrls.length > 0 && (
                    <div className="mt-5">
                      {editLesson.fileUrls.map((url, index) => (
                        <div key={index} className="relative inline-block mr-2">
                          <span className="text-sm pr-6 pt-6 h-6">{`Tài liệu số ${
                            index + 1
                          }`}</span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="cursor-pointer absolute -top-3 right-0 bg-red-400 w-5 h-5 text-white rounded-full"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => closeModals()}
                    className="cursor-pointer w-full py-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400 transition-colors duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loadingLesson}
                    className="cursor-pointer w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loadingLesson ? "Đang thay đổi..." : "Lưu bài học"}
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

export default LessonDetailCard;
