import React, { useState } from "react";

import { toast } from "sonner";

import courseService from "../../services/courseService"; // service gọi API tạo khóa học
import { uploadToCloudinary } from "../../services/uploadCloudinary";

import { ROUTE_PATH } from "../../constants/routePath"; // import đường dẫn

import MyEditor from "../../components/MyEditor";

import { Button } from "@mui/material";

function ManageCourseCreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [subject, setSubject] = useState("");
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

    if (!subject.trim()) {
      toast.error("Vui lòng chọn loại môn học");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      if (thumbnail) {
        imageUrl = await uploadToCloudinary(thumbnail);
      }

      const newCourse = {
        title,
        subject,
        thumbnail: imageUrl,
        description
      };

      const res = await courseService.createCourse(newCourse);  

      if (res.success) {
        toast.success(res.message || "Tạo khóa học thành công");
        setTitle("");
        setSubject("");
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Tạo khóa học
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tiêu đề */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tiêu đề khóa học<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            placeholder="Nhập tiêu đề khóa học"
          />
        </div>

        {/* Thuộc loại môn học nào */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Loại môn học<span className="text-red-500">*</span>
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
          >
            <option value="">Chọn loại môn học</option>
            <option value="Math">Toán học</option>
            <option value="Literature">Ngữ văn</option>
            <option value="English">Tiếng Anh</option>
            <option value="CivicEducation">Giáo dục công dân</option>
            <option value="HistoryAndGeography">Lịch sử và Địa Lý</option>
            <option value="NaturalSciences">Khoa học tự nhiên</option>
            <option value="Technology">Công nghệ</option>
            <option value="InformationTechnology">Tin học</option>
            <option value="Other">Khác</option>
          </select>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mô tả khóa học<span className="text-red-500">*</span>
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
            className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-custom-blue transition"
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
              className="cursor-pointer text-custom-blue hover:underline"
            >
              Chọn hoặc kéo-thả ảnh vào đây
            </label>

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-4 w-48 object-cover rounded-xl border shadow-sm mx-auto"
              />
            )}
          </div>
        </div>

        {/* Nút tạo */}
        <div className="flex space-x-4 gap-4">
          <Button
            type="button"
            variant="contained"
            disableElevation
            fullWidth
            disabled={loading} // 👈 tránh user bấm khi đang loading
            onClick={() => (window.location.href = ROUTE_PATH.LECTURER_COURSES)}
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
            Quay lại
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={loading} // 👈 Thêm prop này
            disableElevation
            fullWidth
            disabled={loading} // 👈 tránh user bấm khi đang loading
            sx={{
              py: "8px",
              px: "16px",
              fontSize: "0.875rem",
              fontWeight: "500",
              borderRadius: "6px",
              textTransform: "none",
              color: "white",
              bgcolor: !loading ? "#4A90E2" : "grey.400",
              transition:
                "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
              "&:hover": {
                bgcolor: !loading ? "#357ABD" : "grey.400",
              },
              "&.Mui-disabled": {
                color: "white",
                bgcolor: "grey.400",
                cursor: "not-allowed",
                opacity: 1,
              },
            }}
          >
            {loading ? "Đang xử lý..." : "Tạo khóa học"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ManageCourseCreatePage;
