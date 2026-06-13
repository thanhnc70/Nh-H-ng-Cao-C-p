const User = require('../models/userModel');
const bcrypt = require('bcrypt'); // Hoặc để nguyên nếu bạn đang lưu mật khẩu thô dạng '123'

// HÀM XỬ LÝ ĐĂNG KÝ
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Kiểm tra xem email đã tồn tại trong database chưa
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email này đã được đăng ký!' });
        }

        // Tạo user mới trực tiếp xuống Database SQL Server
        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: password, // Nếu có dùng mã hóa bcrypt thì thay bằng: await bcrypt.hash(password, 10)
            role: role || 'Customer'
        });

        return res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            user: newUser
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng ký!' });
    }
};

// HÀM XỬ LÝ ĐĂNG NHẬP
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user theo Email
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại!' });
        }

        // Kiểm tra mật khẩu (Sửa lại so sánh bằng nếu bạn đang lưu pass thô '123')
        if (user.password !== password) { 
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        return res.json({
            success: true,
            message: 'Đăng nhập thành công!',
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng nhập!' });
    }
};