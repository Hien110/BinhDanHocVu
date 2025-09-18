// app/controllers/userController.js
const User = require("../models/User");
const generateOtp = require("../../utils/generateOTP");
const sendOTP = require("../../utils/sendOTP");
const hashPassword = require("../../utils/hashPassword");
const jwt = require("jsonwebtoken");

const avatarDefault =
  "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg";
class UserController {
  //Đăng ký người dùng
  async registerUser(req, res) {
    try {
      const userData = req.body;
      // Kiểm tra người dùng đã tồn tại
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await hashPassword(userData.password);

      // Tạo OTP và thời gian hết hạn
      const otp = generateOtp();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 phút

      // Tạo người dùng mới
      const newUser = new User({
        fullName: userData.name,
        email: userData.email,
        password: hashedPassword,
        bio: userData.bio || "",
        gender: userData.gender || "",
        workplace: userData.workplace || "",
        otp,
        otpExpires,
        avatar: avatarDefault,
        status: "non-active", // Trạng thái mặc định là không hoạt động
      });

      await newUser.save();

      // Gửi OTP qua email
      const { success, error } = await sendOTP(newUser.email, otp);

      if (!success) {
        await User.findByIdAndDelete(newUser._id); // rollback nếu email thất bại
        return res.status(500).json({ message: "Gửi email thất bại", error });
      }

      return res
        .status(201)
        .json({ message: "Đăng ký thành công. Mã OTP đã gửi đến email." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Hàm gửi mã OTP
  async resendOtp(req, res) {
    try {
      const { email } = req.body;
      // Tìm người dùng theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      // Tạo OTP mới và thời gian hết hạn
      const otp = generateOtp();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 phút
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
      // Gửi OTP qua email
      const { success, error } = await sendOTP(email, otp);
      if (!success) {
        return res.status(500).json({ message: "Gửi email thất bại", error });
      }
      return res.status(200).json({ message: "Mã OTP đã gửi đến email." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Xác thực OTP
  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      // Tìm người dùng theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      // Kiểm tra OTP
      if (user.otp !== otp) {
        return res.status(400).json({ message: "OTP không hợp lệ" });
      }

      // Kiểm tra thời gian hết hạn OTP
      if (Date.now() > user.otpExpires) {
        return res.status(400).json({ message: "OTP đã hết hạn" });
      }

      // Xác thực thành công
      user.status = "active";
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      return res.status(200).json({ message: "Xác thực thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Hàm compare mật khẩu
  async comparePassword(password) {
    // Sử dụng bcrypt hoặc thư viện khác để so sánh mật khẩu
    const bcrypt = require("bcrypt");
    return await bcrypt.compare(password, this.password);
  }

  // Đăng nhập người dùng
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Tìm người dùng theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email không tồn tại" });
      }
      // Kiểm tra mật khẩu
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng" });
      }
      // Kiểm tra trạng thái người dùng
      if (user.status !== "active") {
        return res
          .status(403)
          .json({ message: "Tài khoản chưa được kích hoạt hoặc bị khóa" });
      }

      // Đăng nhập thành công trả về thông tin người dùng trừ mật khẩu
      const userObj = user.toObject(); // Chuyển từ Mongoose Document thành object
      delete userObj.password;
      delete userObj.otp;
      delete userObj.otpExpires;

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role, status: user.status },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Đăng nhập thành công",
        user: userObj,
        token: token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Lấy tất cả người dùng
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}, "-password -otp -otpExpires"); // Trả về tất cả người dùng trừ mật khẩu, OTP và thời gian hết hạn OTP
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Đặt lại mật khẩu theo email
  async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;

      // Tìm người dùng theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      // Mã hóa mật khẩu mới
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Cập nhật thông tin người dùng
  async updateUser(req, res) {
    try {
      const userId = req.user.userId; // Lấy ID người dùng từ token
      const { name, yearOfAdmission, avatar } = req.body;

      // Tìm người dùng theo ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      // Cập nhật thông tin người dùng
      user.name = name || user.name;
      user.yearOfAdmission = yearOfAdmission || user.yearOfAdmission;
      user.avatar = avatar || user.avatar;

      await user.save();

      return res.status(200).json({ message: "Cập nhật thành công", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Đổi mật khẩu
  async changePassword(req, res) {
    try {
      const userId = req.user.userId; // Lấy ID người dùng từ token
      const { currentPassword, newPassword } = req.body;

      // Tìm người dùng theo ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      // Kiểm tra mật khẩu hiện tại
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại không đúng" });
      }

      // Mã hóa mật khẩu mới
      user.password = await hashPassword(newPassword);
      await user.save();

      return res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Lấy mọi tài khoản với role student
  async getAllStudents(req, res) {
    try {
      const students = await User.find(
        { role: "student" },
        "-password -otp -otpExpires"
      );
      return res.status(200).json(students);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Khóa hoặc hủy khóa tài khoản student
  async toggleStudentLock(req, res) {
    try {
      const { studentId } = req.body;
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      student.status = student.status === "locked" ? "active" : "locked";
      await student.save();

      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái tài khoản thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  //Lấy tài khoản user theo ID
  async getUserById(req, res) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      return res
        .status(200)
        .json({ data: user, message: "Lấy thông tin người dùng thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  //Lấy tất cả tài khoản giảng viên
  async getAllLecturers(req, res) {
    try {
      const lecturers = await User.find(
        { role: "lecturer" },
        "-password -otp -otpExpires"
      );
      return res.status(200).json({ message: "Lấy danh sách giảng viên thành công", data: lecturers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }

  // Phê duyệt giảng viên
  async approveLecturer(req, res) {
    try {
      const { lecturerId } = req.body;
      const lecturer = await User.findById(lecturerId);
      if (!lecturer) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      lecturer.approved = true;
      await lecturer.save();

      return res
        .status(200)
        .json({ message: "Phê duyệt giảng viên thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
  }
}

module.exports = new UserController();
