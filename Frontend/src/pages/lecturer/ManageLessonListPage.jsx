import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import lessonService from "../../services/lessonService";
import courseService from "../../services/courseService";

import { ROUTE_PATH } from "../../constants/routePath";
import { toast } from "sonner";

/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
// import MyEditor from "../../components/MyEditor"; // không dùng nữa trong form mới

import {
  Type as TypeIcon,
  Image as ImageIcon,
  PlayCircle,
  Trash2,
  MoveUp,
  MoveDown,
} from "lucide-react";

import {
  uploadMultipleFilesToCloudinary,
  uploadMultipleImagesToCloudinary,
  uploadToCloudinary,
} from "../../services/uploadCloudinary";

import { Button } from "@mui/material";

function ManageLessonListPage() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState({});
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false); // dùng cho tạo bài học

  const fileInputRef = useRef(null);
  // ---------- Fetch ----------
  const fetchLessons = async () => {
    const res = await lessonService.getLessonsByCourse(courseId);
    if (res?.success) setLessons(res.data || []);
  };

  const fetchCourse = async () => {
    const res = await courseService.getCourseById(courseId);
    if (res?.success) setCourse(res.data || {});
  };

  useEffect(() => {
    fetchLessons();
    fetchCourse();
  }, [courseId]);

  const handleViewLesson = (lessonId) => {
    window.location.href = `${ROUTE_PATH.LECTURER_LESSON_DETAIL.replace(
      ":courseId",
      courseId
    ).replace(":lessonId", lessonId)}`;
  };

  // ---------- Delete ----------
  const handleDeleteLesson = async (lessonId) => {
    const res = await lessonService.deleteLesson(lessonId);
    if (res?.success) {
      toast.success("Xóa bài học thành công");
      fetchLessons();
      setShowDeleteLessonModal(false);
    } else {
      toast.error("Xóa bài học thất bại");
    }
  };

  const closeModals = () => {
    setShowDeleteLessonModal(false);
    setSelectedLesson(null);
  };

  // =============== FORM TẠO BÀI HỌC MỚI (BLOCK) ============

  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]); // {id,type,value,order,file?,preview?}
  const [files, setFiles] = useState([]); // PDF/Word

  const newId = () => Math.random().toString(36).slice(2);

  function parseYouTubeId(url = "") {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        if (u.pathname === "/watch") return u.searchParams.get("v") || "";
        if (u.pathname.startsWith("/embed/"))
          return u.pathname.split("/")[2] || "";
        if (u.pathname.startsWith("/shorts/"))
          return u.pathname.split("/")[2] || "";
      }
      if (u.hostname === "youtu.be") return u.pathname.substring(1);
    } catch (error) {
      console.error("Failed to parse YouTube ID:", error);
    }
    return "";
  }
  const toYouTubeEmbed = (url) => {
    const id = parseYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : "";
  };

  const addBlock = (type) => {
    const nextOrder = contentBlocks.length;
    setContentBlocks((prev) => [
      ...prev,
      {
        id: newId(),
        type,
        value: "",
        order: nextOrder,
        file: null,
        preview: "",
      },
    ]);
  };

  const updateBlock = (id, patch) => {
    setContentBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  };

  const removeBlock = (id) => {
    setContentBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      return filtered.map((b, idx) => ({ ...b, order: idx }));
    });
  };

  const moveBlock = (id, dir) => {
    setContentBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const swapWith = dir === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[swapWith]] = [copy[swapWith], copy[idx]];
      return copy.map((b, i) => ({ ...b, order: i }));
    });
  };

  const onPickImage = (id, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    updateBlock(id, { file, preview });
  };

  const onPickFiles = (fileList) => {
    if (!fileList?.length) return;
    setFiles(Array.from(fileList));
  };

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!contentBlocks.length) return false;
    return contentBlocks.every((b) => {
      if (b.type === "text") return (b.value || "").trim().length > 0;
      if (b.type === "video") return parseYouTubeId(b.value || "") !== "";
      if (b.type === "image") return !!(b.value || b.file);
      return false;
    });
  }, [title, contentBlocks]);

  const handleCreateLesson = async (e) => {
    e.preventDefault();

    if (!contentBlocks.length) {
      toast.error("Vui lòng thêm ít nhất một nội dung");
      return;
    }

    try {
      setLoadingLesson(true);

      // 1) Gom các block ảnh cần upload (có file)
      const imageBlocksToUpload = [];
      contentBlocks.forEach((b, idx) => {
        if (b.type === "image" && b.file instanceof File) {
          imageBlocksToUpload.push({ idx, file: b.file });
        }
      });

      // 2) Upload ảnh theo lô (giữ đúng thứ tự block)
      let uploadedImageUrls = [];
      if (imageBlocksToUpload.length > 0) {
        // nếu muốn tối ưu cho 1 ảnh có thể dùng uploadToCloudinary,
        // nhưng dùng batch cho đơn giản & đồng nhất
        const filesToUpload = imageBlocksToUpload.map((x) => x.file);
        uploadedImageUrls = await uploadMultipleImagesToCloudinary(
          filesToUpload
        ); // ← mong đợi string[]
        // Nếu hàm của bạn trả object { urls: [...] }, đổi thành:
        // const { urls } = await uploadMultipleImagesToCloudinary(filesToUpload);
        // uploadedImageUrls = urls;
      }

      // 3) Gán URL ảnh đã upload vào đúng block tương ứng
      const blocksWithResolvedImages = contentBlocks.map((b) => ({ ...b })); // shallow copy
      imageBlocksToUpload.forEach((item, i) => {
        const url = uploadedImageUrls[i];
        blocksWithResolvedImages[item.idx].value = url || ""; // set giá trị cuối cùng
        blocksWithResolvedImages[item.idx].file = null; // clear file
        if (blocksWithResolvedImages[item.idx].preview) {
          URL.revokeObjectURL(blocksWithResolvedImages[item.idx].preview); // tránh leak bộ nhớ
          blocksWithResolvedImages[item.idx].preview = "";
        }
      });

      // 4) Chuẩn hoá content theo schema [{ type, value, order }]
      const processedBlocks = blocksWithResolvedImages.map(
        ({ type, value, order }) => ({
          type,
          value: (typeof value === "string" ? value.trim() : value) || "",
          order,
        })
      );

      // 5) Upload file tài liệu (PDF/Word) nếu có
      let fileUrls = [];
      if (files && files.length) {
        // files là mảng File từ state
        fileUrls = await uploadMultipleFilesToCloudinary(files); // ← mong đợi string[]
        // Nếu hàm của bạn trả object { urls: [...] }, đổi thành:
        // const { urls } = await uploadMultipleFilesToCloudinary(files);
        // fileUrls = urls;
      }

      // 6) Tạo payload & gọi API tạo bài học
      const payload = {
        course: courseId,
        title: title.trim(),
        content: processedBlocks,
        fileUrls,
      };

      const res = await lessonService.createLesson(payload);
      if (res?.success) {
        toast.success("Tạo bài học thành công");
        // Reset form + refresh list
        setTitle("");
        setContentBlocks([]);
        setFiles([]);
        fetchLessons();
        //set file thành tệp rỗng
        fileInputRef.current.value = "";
      } else {
        toast.error(res?.message || "Tạo bài học thất bại");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo bài học");
    } finally {
      setLoadingLesson(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        {course?.title}
      </h1>

      {/* -------- Course header & list -------- */}
      <section className="mb-12 border-b border-gray-300 pb-6">
        <h2 className="text-2xl font-semibold text-custom-blue mb-6 border-b border-gray-300 pb-2">
          Danh sách bài học
        </h2>

        <div className="mb-4 text-blue-400">
          <span className="font-bold">Tổng số bài học:</span> {lessons.length}{" "}
          bài học
        </div>

        {lessons.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có bài học nào</p>
        ) : (
          <ul className="space-y-6">
            {lessons.map((lesson, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-between items-center bg-white hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2 ">
                    {lesson.title}
                  </h3>
                  <div className="text-gray-600 line-clamp-1 w-96">
                    {/* Tùy backend mà lesson.content là HTML hay mảng.
                        Nếu là mảng [{type,value}] thì bạn có thể render tóm tắt thay vì dangerouslySetInnerHTML */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: lesson.content[0].value,
                      }}
                    />
                  </div>
                </div>
                <div className="">
                  <button
                    onClick={() => handleViewLesson(lesson._id)}
                    className="cursor-pointer text-custom-orange border border-custom-orange px-3 py-1 text-sm rounded-lg hover:bg-custom-hover-orange2 font-medium transition duration-300"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteLessonModal(true);
                      setSelectedLesson(lesson);
                    }}
                    className="cursor-pointer text-red-600 border border-red-600 px-3 py-1 text-sm rounded-lg hover:bg-red-100 font-medium transition duration-300 ml-3"
                  >
                    Xóa bài học
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* -------- Form tạo bài học mới (block-based) -------- */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-custom-blue border-b border-gray-300 pb-2">
          Tạo bài học mới
        </h2>

        <form className="space-y-6 max-w-full" onSubmit={handleCreateLesson}>
          {/* Title */}
          <div>
            <label htmlFor="lessonTitle" className="block mb-2 font-semibold">
              Tiêu đề bài học
            </label>
            <input
              id="lessonTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-blue transition"
              placeholder="Nhập tiêu đề bài học"
              required
            />
          </div>

          {/* Danh sách block */}
          <div className="space-y-4">
            {contentBlocks
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((b, idx) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white"
                >
                  {/* Header */}
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
                        {b.type === "text" && "VĂN BẢN"}
                        {b.type === "image" && "HÌNH ẢNH"}
                        {b.type === "video" && "VIDEO"}
                      </span>
                      <span className="text-sm text-gray-500">
                        Thứ tự: {b.order + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveBlock(b.id, "up")}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                        disabled={idx === 0}
                        title="Di chuyển lên"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(b.id, "down")}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                        disabled={idx === contentBlocks.length - 1}
                        title="Di chuyển xuống"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(b.id)}
                        className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Xóa block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
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
                        required
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-blue transition"
                        placeholder="Nhập đoạn văn bản..."
                      />
                    </div>
                  )}

                  {b.type === "image" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-2 font-semibold">
                          Chọn ảnh (jpg, png)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          required={!b.value}
                          onChange={(e) =>
                            onPickImage(b.id, e.target.files?.[0])
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
                          required={!(b.file instanceof File)}
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
                          required
                          value={b.value}
                          onChange={(e) =>
                            updateBlock(b.id, { value: e.target.value })
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-blue transition"
                        />
                      </div>
                      {parseYouTubeId(b.value) ? (
                        <div className="aspect-video w-full rounded-lg overflow-hidden border">
                          <iframe
                            className="w-full h-full"
                            src={toYouTubeEmbed(b.value)}
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
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-sm transition hover:bg-custom-hover-blue2"
              title="Thêm đoạn văn bản"
            >
              <TypeIcon className="w-4 h-4" />
              Văn bản
            </button>
            <button
              type="button"
              onClick={() => addBlock("image")}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-sm transition hover:bg-custom-hover-blue2"
              title="Thêm hình ảnh"
            >
              <ImageIcon className="w-4 h-4" />
              Hình ảnh
            </button>
            <button
              type="button"
              onClick={() => addBlock("video")}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-sm transition hover:bg-custom-hover-blue2"
              title="Thêm video (YouTube URL)"
            >
              <PlayCircle className="w-4 h-4" />
              Video
            </button>
          </div>
          {/* Lesson-level files */}
          <div>
            <label htmlFor="lessonFile" className="block mb-2 font-semibold">
              File tài liệu (PDF, Word)
            </label>
            <input
              id="lessonFile"
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={(e) => onPickFiles(e.target.files)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-custom-blue transition"
            />
            {files.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Đã chọn: {files.map((f) => f.name).join(", ")}
              </p>
            )}
          </div>
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
            {loadingLesson ? "Đang tạo bài học..." : "Tạo bài học"}
          </Button>
        </form>
      </section>

      {/* -------- Modal delete giữ nguyên -------- */}
      <AnimatePresence>
        {showDeleteLessonModal && (
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
                Xóa bài học
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa bài học{" "}
                <span className="font-semibold text-red-500">
                  {selectedLesson?.title}
                </span>{" "}
                không?
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteLesson(selectedLesson?._id);
                }}
              >
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModals}
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

export default ManageLessonListPage;
