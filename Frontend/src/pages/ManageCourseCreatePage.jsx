import React, { useState } from "react";

import { toast } from "sonner";

import courseService from "../services/courseService"; // service gọi API tạo khóa học
import { uploadToCloudinary } from "../services/uploadCloudinary";

import { ROUTE_PATH } from "../constants/routePath"; // import đường dẫn

import MyEditor from "../components/MyEditor";

function ManageCourseCreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (value) => {
    setDescription(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setThumbnail(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // cần để cho phép drop
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề khóa học");
      return;
    }
    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả khóa học");
      return;
    }

    if (!thumbnail) {
      toast.error("Vui lòng chọn ảnh đại diện khóa học");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      if (thumbnail) {
        imageUrl = await uploadToCloudinary(thumbnail);
      }

      const res = await courseService.createCourse({
        title,
        description,
        thumbnail: imageUrl,
        // instructor sẽ lấy từ backend qua token, không cần gửi
      });

      if (res.success) {
        toast.success(res.message || "Tạo khóa học thành công");
        setTitle("");
        setDescription("");
        setThumbnail(null);
        setPreviewImage("");
      } else {
        toast.error(res.message || "Tạo khóa học thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo khóa học");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tạo môn học</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tiêu đề */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-sm"
            placeholder="Nhập tiêu đề khóa học"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <MyEditor
            content={description}
            onChangeContent={handleEditorChange}
          />
        </div>
        {/* Ảnh đại diện */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Ảnh đại diện <span className="text-red-500">*</span>
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-red-400 transition"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-red-600 hover:underline"
            >
              Chọn hoặc kéo-thả ảnh vào đây
            </label>

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-4 w-48 h-32 object-cover rounded-xl border shadow-sm mx-auto"
              />
            )}
          </div>
        </div>

        {/* Nút tạo */}
        <div className="flex space-x-4">
          <button
            type="button"
            className="w-full py-3 rounded-xl text-white font-semibold bg-gray-600 transition-colors duration-500 ease-in-out hover:bg-gray-500 cursor-pointer shadow-md"
            onClick={() => (window.location.href = ROUTE_PATH.LECTURER_COURSES)}
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-red-500 to-red-400 transition-colors duration-500 cursor-pointer ease-in-out hover:from-red-700 hover:to-red-600 shadow-md disabled:opacity-50"
          >
            {loading ? "Đang tạo..." : "Tạo môn học"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManageCourseCreatePage;
