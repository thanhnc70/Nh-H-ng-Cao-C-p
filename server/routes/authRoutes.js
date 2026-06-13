const express = require('express');
const router = express.Router();
const sql = require('mssql');

// ĐẢM BẢO DÒNG NÀY ĐÚNG ĐƯỜNG DẪN ĐẾN FILE CONFIG DATABASE CỦA BẠN
const { config } = require('../config/db'); 

// 🚀 1. API ĐĂNG KÝ: http://localhost:5000/api/auth/register
router.post('/register', async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        let pool = await sql.connect(config);
        
        // Kiểm tra trùng lặp email
        let checkEmail = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @Email');

        if (checkEmail.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'Email này đã tồn tại trên hệ thống!' });
        }

        // Đồng bộ chuẩn dùng cột PasswordHash
        await pool.request()
            .input('FullName', sql.NVarChar, fullName)
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, password)
            .input('Role', sql.NVarChar, role || 'Customer') 
            .query('INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES (@FullName, @Email, @PasswordHash, @Role)');

        res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi đăng ký hệ thống: ' + err.message });
    }
});

// 🚀 2. API ĐĂNG NHẬP: http://localhost:5000/api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đủ email và mật khẩu!' });
    }

    try {
        let pool = await sql.connect(config);
        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, password)
            .query('SELECT Id, FullName, Email, Role FROM Users WHERE Email = @Email AND PasswordHash = @PasswordHash');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.json({
                success: true,
                message: 'Đăng nhập thành công!',
                user: {
                    id: user.Id,
                    fullName: user.FullName,
                    email: user.Email,
                    role: user.Role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi đăng nhập hệ thống!' });
    }
});

// 🚀 3. API LẤY DANH SÁCH THÀNH VIÊN: http://localhost:5000/api/auth/users
router.get('/users', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request().query('SELECT Id, FullName, Email, Role FROM Users ORDER BY Id ASC');
        
        res.json({
            success: true,
            users: result.recordset.map(user => ({
                id: user.Id,
                fullName: user.FullName,
                email: user.Email,
                role: user.Role || 'Customer'
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống khi tải danh sách thành viên!' });
    }
});

// 🚀 4. API THÊM MỚI THÀNH VIÊN (Sửa lỗi Invalid column name Password ở đây)
router.post('/users', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        
        let pool = await sql.connect(config);
        
        // Kiểm tra trùng lặp email
        let checkEmail = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @Email');

        if (checkEmail.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'Email này đã tồn tại trên hệ thống!' });
        }

        // Đã sửa thành cột PasswordHash trùng khớp hoàn toàn với cấu trúc DB của bạn
        await pool.request()
            .input('FullName', sql.NVarChar, fullName)
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, password)
            .input('Role', sql.NVarChar, role || 'Customer')
            .query('INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES (@FullName, @Email, @PasswordHash, @Role)');

        res.status(201).json({ success: true, message: 'Thêm thành viên mới thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server khi thêm user: ' + err.message });
    }
});

// 🚀 5. API CHỈNH SỬA THÀNH VIÊN: http://localhost:5000/api/auth/users/:id
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, email, role } = req.body;

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .input('FullName', sql.NVarChar, fullName)
            .input('Email', sql.NVarChar, email)
            .input('Role', sql.NVarChar, role)
            .query('UPDATE Users SET FullName = @FullName, Email = @Email, Role = @Role WHERE Id = @Id');

        res.json({ success: true, message: 'Cập nhật thông tin thành viên thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống khi cập nhật dữ liệu!' });
    }
});

// 🚀 6. API XÓA THÀNH VIÊN: http://localhost:5000/api/auth/users/:id
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Users WHERE Id = @Id');

        res.json({ success: true, message: 'Đã xóa thành viên khỏi cơ sở dữ liệu!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống khi thực thi lệnh xóa!' });
    }
});

module.exports = router;

// 🚀 API LƯU ĐƠN HÀNG KHI KHÁCH BẤM THANH TOÁN
router.post('/orders', async (req, res) => {
    const { userEmail, fullName, totalPrice, items } = req.body;

    if (!userEmail || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Dữ liệu đơn hàng không hợp lệ!' });
    }

    try {
        let pool = await sql.connect(config);
        
        // 1. Thêm thông tin tổng quan vào bảng Orders và lấy ra ID vừa tạo
        let insertOrder = await pool.request()
            .input('UserEmail', sql.NVarChar, userEmail)
            .input('FullName', sql.NVarChar, fullName)
            .input('TotalPrice', sql.Decimal(18, 2), totalPrice)
            .query('INSERT INTO Orders (UserEmail, FullName, TotalPrice) OUTPUT INSERTED.Id VALUES (@UserEmail, @FullName, @TotalPrice)');
        
        const orderId = insertOrder.recordset[0].Id;

        // 2. Chạy vòng lặp thêm từng món ăn đối ứng vào bảng OrderDetails
        for (let item of items) {
            await pool.request()
                .input('OrderId', sql.Int, orderId)
                .input('FoodName', sql.NVarChar, item.name)
                .input('Price', sql.Decimal(18, 2), item.price)
                .input('Quantity', sql.Int, item.quantity)
                .query('INSERT INTO OrderDetails (OrderId, FoodName, Price, Quantity) VALUES (@OrderId, @FoodName, @Price, @Quantity)');
        }

        res.status(201).json({ success: true, message: 'Đơn hàng đã được lưu vào hệ thống SQL Server!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống khi lưu đơn hàng: ' + err.message });
    }
});

// 🚀 API LẤY TOÀN BỘ DANH SÁCH ĐƠN HÀNG (DÀNH CHO TRANG ADMIN)
router.get('/admin/orders', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        
        // Lấy danh sách đơn hàng xếp theo thứ tự ngày đặt mới nhất lên đầu
        let result = await pool.request()
            .query('SELECT Id, UserEmail, FullName, TotalPrice, OrderDate, Status FROM Orders ORDER BY OrderDate DESC');
            
        res.json({ success: true, orders: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng: ' + err.message });
    }
});