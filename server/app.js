const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. Cấu hình các Middleware cơ bản
app.use(cors()); // Cho phép Frontend (Live Server) gọi API tới Backend không bị chặn
app.use(express.json()); // Cho phép đọc dữ liệu định dạng JSON từ Frontend gửi lên

// 2. Nạp định tuyến API Tài khoản (Đăng ký, Đăng nhập, Quản lý thành viên)
app.use('/api/auth', authRoutes);

// 3. Xuất cấu hình ứng dụng app ra ngoài để server.js sử dụng
module.exports = app;