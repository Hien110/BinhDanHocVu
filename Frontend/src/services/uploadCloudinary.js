// services/uploadCloudinary.js
import axios from "axios";

const API_URL = "http://localhost:3000/uploads";

// Hàm lấy chữ ký bảo mật từ BE
const getSignature = async () => {
  const res = await axios.get(`${API_URL}/cloudinary-signature`);
  return res.data; // { timestamp, signature, apiKey, cloudName, folder }
};

// ===== 1) Upload 1 ảnh =====
export const uploadToCloudinary = async (file) => {
  const { timestamp, signature, apiKey, cloudName, folder } = await getSignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );
  return res.data.secure_url;
};

// ===== 2) Upload nhiều ảnh =====
export const uploadMultipleImagesToCloudinary = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) return [];
  const { timestamp, signature, apiKey, cloudName, folder } = await getSignature();

  const uploads = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return res.data.secure_url;
  });

  return await Promise.all(uploads);
};

// ===== 3) Upload nhiều file tài liệu (PDF, Word, PPTX) =====
export const uploadMultipleFilesToCloudinary = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) return [];
  const { timestamp, signature, apiKey, cloudName, folder } = await getSignature();

  const uploads = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
    // 🟡 Lưu ý: sử dụng endpoint /raw để upload file không phải ảnh
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      formData
    );
    return res.data.secure_url;
  });

  return await Promise.all(uploads);
};
