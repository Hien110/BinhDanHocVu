/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { convertYouTubeUrlToEmbed } from "../utils/youtube";
import lessonService from "../services/lessonService";
import userService from "../services/userService";

import {
  uploadMultipleFilesToCloudinary,
  uploadMultipleImagesToCloudinary,
} from "../services/uploadCloudinary";

import { Button } from "@mui/material";
/**
 * Chuẩn hoá lesson -> mảng block [{id?, type, value, order, ...}]
 * - Nếu đã là schema mới (content là array): sort theo order và trả về.
 * - Nếu là dữ liệu cũ: convert từ content(HTML)/imageUrls/videoUrl -> blocks.
 */
function normalizeBlocksFromLesson(lesson) {
  const raw = lesson?.content;

  // Case 1: Schema mới
  if (Array.isArray(raw)) {
    return raw
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((b, i) => ({
        id: b.id || Math.random().toString(36).slice(2),
        type: b.type,
        value: b.value ?? "",
        order: i,
        file: null,
        preview: "",
      }));
  }

  // Case 2: Dữ liệu cũ
  const blocks = [];
  let idx = 0;

  // content (HTML) -> text block
  if (lesson?.content && typeof lesson.content === "string") {
    blocks.push({
      id: Math.random().toString(36).slice(2),
      type: "text",
      value: lesson.content,
      order: idx++,
      file: null,
      preview: "",
    });
  }

  // imageUrls[] -> nhiều image blocks
  if (Array.isArray(lesson?.imageUrls) && lesson.imageUrls.length) {
    lesson.imageUrls.forEach((url) => {
      blocks.push({
        id: Math.random().toString(36).slice(2),
        type: "image",
        value: url,
        order: idx++,
        file: null,
        preview: "",
      });
    });
  }

  // videoUrl -> video block
  if (lesson?.videoUrl) {
    blocks.push({
      id: Math.random().toString(36).slice(2),
      type: "video",
      value: lesson.videoUrl,
      order: idx++,
      file: null,
      preview: "",
    });
  }

  return blocks;
}

function LessonDetailCard({ lesson }) {
  const user = userService.getCurrentUser();

  // ---------- View state ----------
  const [displayTitle, setDisplayTitle] = useState(lesson.title);
  const [displayBlocks, setDisplayBlocks] = useState(() =>
    normalizeBlocksFromLesson(lesson)
  );
  const [displayFileUrls, setDisplayFileUrls] = useState(lesson.fileUrls ?? []);

  // ---------- Edit modal ----------
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);

  // State trong modal chỉnh sửa
  const [editTitle, setEditTitle] = useState(lesson.title);
  const [editBlocks, setEditBlocks] = useState(() =>
    normalizeBlocksFromLesson(lesson)
  );
  const [editFileUrls, setEditFileUrls] = useState(lesson.fileUrls ?? []);

  // File đính kèm mới (PDF/Word)
  const [pendingFiles, setPendingFiles] = useState([]);
  const lessonFilesRef = useRef(null);

  // Re-sync khi lesson prop thay đổi (nếu parent re-fetch)
  useEffect(() => {
    setDisplayTitle(lesson.title);
    setDisplayBlocks(normalizeBlocksFromLesson(lesson));
    setDisplayFileUrls(lesson.fileUrls ?? []);

    // nếu đang mở modal, cũng sync trước
    setEditTitle(lesson.title);
    setEditBlocks(normalizeBlocksFromLesson(lesson));
    setEditFileUrls(lesson.fileUrls ?? []);
  }, [lesson]);

  // ---------- Helpers ----------
  const newId = () => Math.random().toString(36).slice(2);

  const addBlock = (type) => {
    setEditBlocks((prev) => [
      ...prev,
      {
        id: newId(),
        type,
        value: "",
        order: prev.length,
        file: null,
        preview: "",
      },
    ]);
  };

  const updateBlock = (id, patch) => {
    setEditBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  };

  const removeBlock = (id) => {
    setEditBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      return filtered.map((b, i) => ({ ...b, order: i }));
    });
  };

  const moveBlock = (id, dir) => {
    setEditBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const to = dir === "up" ? idx - 1 : idx + 1;
      if (to < 0 || to >= prev.length) return prev;
      const clone = [...prev];
      [clone[idx], clone[to]] = [clone[to], clone[idx]];
      return clone.map((b, i) => ({ ...b, order: i }));
    });
  };

  // Nhận FileList nhiều ảnh -> tách thành nhiều block image
  const onPickImagesForBlock = (id, fileList) => {
    if (!fileList || fileList.length === 0) return;
    setEditBlocks((prev) => {
      const blocks = [...prev];
      const idx = blocks.findIndex((x) => x.id === id);
      if (idx === -1) return prev;

      const files = Array.from(fileList);
      const [first, ...rest] = files;

      // Ảnh đầu tiên: gắn vào block hiện tại
      const firstPreview = URL.createObjectURL(first);
      blocks[idx] = {
        ...blocks[idx],
        type: "image",
        file: first,
        preview: firstPreview,
        value: "", // sẽ set URL thật sau upload
      };

      // Các ảnh còn lại: chèn block mới ngay sau
      const newBlocks = rest.map((f) => ({
        id: newId(),
        type: "image",
        value: "",
        order: 0, // tạm
        file: f,
        preview: URL.createObjectURL(f),
      }));

      blocks.splice(idx + 1, 0, ...newBlocks);
      return blocks.map((b, i) => ({ ...b, order: i }));
    });
  };

  const handleRemoveFileUrl = (index) => {
    setEditFileUrls((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  // ---------- Save / Update ----------
  const handleEditLesson = async () => {
    setLoadingLesson(true);
    try {
      // 1) Upload ảnh mới (chỉ block có file)
      const imageFiles = editBlocks
        .filter((b) => b.type === "image" && b.file instanceof File)
        .map((b) => b.file);

      let uploadedImageUrls = [];
      if (imageFiles.length) {
        uploadedImageUrls = await uploadMultipleImagesToCloudinary(imageFiles);
        // Nếu hàm trả { urls }:
        // const { urls } = await uploadMultipleImagesToCloudinary(imageFiles);
        // uploadedImageUrls = urls;
      }

      // 2) Gán URL đã upload vào block theo thứ tự
      let imgIdx = 0;
      const finalizedBlocks = editBlocks.map((b) => {
        if (b.type === "image") {
          let valueUrl = b.value?.trim();
          if (!valueUrl && b.file) {
            valueUrl = uploadedImageUrls[imgIdx++] || "";
          }
          // cleanup blob preview
          if (b.preview) URL.revokeObjectURL(b.preview);
          return { type: "image", value: valueUrl, order: b.order };
        }
        // text/video
        return {
          type: b.type,
          value: (b.value ?? "").toString().trim(),
          order: b.order,
        };
      });

      // 3) Upload file đính kèm mới
      let newFileUrls = [];
      if (pendingFiles.length) {
        newFileUrls = await uploadMultipleFilesToCloudinary(pendingFiles);
        // Nếu trả { urls }:
        // const { urls } = await uploadMultipleFilesToCloudinary(pendingFiles);
        // newFileUrls = urls;
      }

      const payload = {
        title: editTitle.trim(),
        content: finalizedBlocks
          .filter((b) => {
            if (b.type === "text") return b.value;
            if (b.type === "image") return !!b.value;
            if (b.type === "video") return !!b.value;
            return false;
          })
          .sort((a, b) => a.order - b.order)
          .map((b, i) => ({ ...b, order: i })), // re-index
        fileUrls: [...editFileUrls, ...newFileUrls],
      };

      const res = await lessonService.updateLesson(lesson._id, payload);
      if (res?.success) {
        toast.success("Cập nhật bài học thành công");

        // Cập nhật lại view state
        setDisplayTitle(payload.title);
        setDisplayBlocks(
          payload.content.map((b, i) => ({
            id: newId(),
            type: b.type,
            value: b.value,
            order: i,
            file: null,
            preview: "",
          }))
        );
        setDisplayFileUrls(payload.fileUrls);

        // Dọn modal state
        setShowEditModal(false);
        setPendingFiles([]);
        if (lessonFilesRef.current) lessonFilesRef.current.value = "";
      } else {
        toast.error(res?.message || "Cập nhật bài học thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật bài học");
    } finally {
      setLoadingLesson(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="bg-white rounded-xl">
      {/* Tên khoá học */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        {lesson.course?.title}
      </h1>

      {/* Tiêu đề + nút chỉnh sửa */}
      <div className="w-full">
        <h2 className="text-2xl font-semibold text-custom-blue mb-6 border-b border-gray-300 pb-2">
          {displayTitle}
        </h2>
      </div>
      {user?.role === "lecturer" || user?.role === "admin" && (
        <button
          onClick={() => setShowEditModal(true)}
          className="cursor-pointer text-custom-orange border border-custom-orange px-4 py-2 rounded-lg text-sm transition duration-300 hover:bg-custom-hover-orange2 font-medium"
        >
          Chỉnh sửa bài học
        </button>
      )}

      {/* Nội dung theo block */}
      <div className="mt-4 space-y-6">
        {displayBlocks.map((b, i) => {
          if (b.type === "text") {
            return (
              <div key={b.id || i} className="prose max-w-none">
                {/* Nếu b.value là HTML: render dangerously; nếu chỉ là plain text: vẫn hiển thị ok */}
                <div
                  className="text-gray-800 whitespace-pre-wrap leading-7"
                  dangerouslySetInnerHTML={{ __html: b.value }}
                />
              </div>
            );
          }
          if (b.type === "image") {
            return (
              <div key={b.id || i} className=" overflow-hidden">
                <img
                  src={b.value}
                  alt={`lesson-img-${i + 1}`}
                  className="w-full max-h-[460px] object-contain "
                />
              </div>
            );
          }
          if (b.type === "video") {
            return (
              <div key={b.id || i}>
                <div className="w-full overflow-hidden flex justify-center">
                  <iframe
                    src={convertYouTubeUrlToEmbed(b.value)}
                    title={`lesson-video-${i + 1}`}
                    className="w-[800px] h-[450px] max-w-full max-h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Tài liệu đính kèm */}
      {displayFileUrls?.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            📄 Tài liệu đính kèm
          </h4>
          <ul className="space-y-2">
            {displayFileUrls.map((fileUrl, index) => (
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

      {/* =================== Edit Modal =================== */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-[1200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-custom-blue mb-4">
                Chỉnh sửa bài học
              </h2>

              {/* FORM */}
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditLesson();
                }}
              >
                {/* Title */}
                <div>
                  <label
                    htmlFor="lessonTitle"
                    className="block mb-2 font-semibold"
                  >
                    Tiêu đề bài học
                  </label>
                  <input
                    id="lessonTitle"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    placeholder="Nhập tiêu đề bài học"
                    required
                  />
                </div>

                {/* Danh sách block để sửa */}
                <div className="space-y-4">
                  {editBlocks
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((b, idx) => (
                      <div
                        key={b.id}
                        className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white"
                      >
                        {/* Header block */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                b.type === "text"
                                  ? "bg-blue-50 text-custom-blue"
                                  : b.type === "image"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-purple-50 text-purple-600"
                              }`}
                            >
                              {b.type === "text"
                                ? "Văn bản"
                                : b.type === "image"
                                ? "Hình ảnh"
                                : "Video"}
                            </span>
                            <span className="text-sm text-gray-500">
                              Thứ tự: {b.order + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveBlock(b.id, "up")}
                              className="cursor-pointer px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                              disabled={idx === 0}
                              title="Di chuyển lên"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveBlock(b.id, "down")}
                              className="cursor-pointer px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                              disabled={idx === editBlocks.length - 1}
                              title="Di chuyển xuống"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBlock(b.id)}
                              className="cursor-pointer px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                              title="Xoá block"
                            >
                              Xoá
                            </button>
                          </div>
                        </div>

                        {/* Body block */}
                        {b.type === "text" && (
                          <div>
                            <label className="block mb-2 font-semibold">
                              Nội dung văn bản
                            </label>
                            <textarea
                              rows={5}
                              value={b.value}
                              onChange={(e) =>
                                updateBlock(b.id, { value: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-blue transition"
                              placeholder="Nhập văn bản (có thể dán HTML tinh gọn)..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Gợi ý: dùng đoạn văn ngắn, xuống dòng hợp lý để dễ
                              đọc.
                            </p>
                          </div>
                        )}

                        {b.type === "image" && (
                          <div className="space-y-3">
                            <div>
                              <label className="block mb-2 font-semibold">
                                Chọn ảnh (jpg, png) — có thể chọn nhiều ảnh
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                  onPickImagesForBlock(b.id, e.target.files)
                                }
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-custom-blue transition"
                              />
                            </div>
                            {(b.preview || b.value) && (
                              <div className="rounded-lg overflow-hidden border">
                                <img
                                  src={b.preview || b.value}
                                  alt="preview"
                                  className="w-full max-h-80 object-contain bg-gray-50"
                                />
                              </div>
                            )}
                            <div>
                              <label className="block mb-2 font-semibold">
                                Hoặc dán URL ảnh
                              </label>
                              <input
                                type="url"
                                value={b.value}
                                onChange={(e) =>
                                  updateBlock(b.id, { value: e.target.value })
                                }
                                placeholder="https://.../image.jpg"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-blue transition"
                              />
                            </div>
                          </div>
                        )}

                        {b.type === "video" && (
                          <div className="space-y-3">
                            <div>
                              <label className="block mb-2 font-semibold">
                                URL video YouTube
                              </label>
                              <input
                                type="url"
                                value={b.value}
                                onChange={(e) =>
                                  updateBlock(b.id, { value: e.target.value })
                                }
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-blue transition"
                              />
                            </div>
                            {b.value ? (
                              <div className="aspect-video w-full rounded-lg overflow-hidden border">
                                <iframe
                                  className="w-full h-full"
                                  src={convertYouTubeUrlToEmbed(b.value)}
                                  title="YouTube video"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nhập link YouTube hợp lệ để preview.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Toolbar thêm block */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold">Thêm nội dung:</span>
                  <button
                    type="button"
                    onClick={() => addBlock("text")}
                    className="px-4 py-2 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-sm transition hover:bg-custom-hover-blue2"
                    title="Thêm đoạn văn bản"
                  >
                    Văn bản
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("image")}
                    className="px-4 py-2 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-sm transition hover:bg-custom-hover-blue2"
                    title="Thêm hình ảnh"
                  >
                    Hình ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("video")}
                    className="px-4 py-2 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-sm transition hover:bg-custom-hover-blue2"
                    title="Thêm video"
                  >
                    Video
                  </button>
                </div>

                {/* File đính kèm */}
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
                    accept=".pdf,.doc,.docx"
                    multiple
                    ref={lessonFilesRef}
                    onChange={(e) =>
                      setPendingFiles(Array.from(e.target.files))
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                  {/* Files hiện có + nút xoá */}
                  {editFileUrls?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {editFileUrls.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-[80%]"
                          >
                            Tài liệu {index + 1}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveFileUrl(index)}
                            className="cursor-pointer px-2 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50"
                          >
                            Xoá
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="contained"
                    disableElevation
                    fullWidth
                    disabled={loadingLesson}
                    onClick={() => setShowEditModal(false)}
                    sx={{
                      py: "8px",
                      px: "16px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      borderRadius: "6px",
                      textTransform: "none",
                      color: "white",
                      bgcolor: "grey.600",
                      transition:
                        "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: "grey.700",
                      },
                      "&.Mui-disabled": {
                        color: "white",
                        bgcolor: "grey.400",
                        cursor: "not-allowed",
                        opacity: 1,
                      },
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    loading={loadingLesson} // 👈 Thêm prop này
                    disableElevation
                    fullWidth
                    disabled={loadingLesson} // 👈 tránh user bấm khi đang loading
                    sx={{
                      py: "8px",
                      px: "16px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      borderRadius: "6px",
                      textTransform: "none",
                      color: "white",
                      bgcolor: !loadingLesson ? "#4A90E2" : "grey.400",
                      transition:
                        "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: !loadingLesson ? "#357ABD" : "grey.400",
                      },
                      "&.Mui-disabled": {
                        color: "white",
                        bgcolor: "grey.400",
                        cursor: "not-allowed",
                        opacity: 1,
                      },
                    }}
                  >
                    {loadingLesson
                      ? "Đang chỉnh sửa bài học..."
                      : "Chỉnh sửa bài học"}
                  </Button>
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
