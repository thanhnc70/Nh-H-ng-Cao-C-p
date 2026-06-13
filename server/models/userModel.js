const { db } = require('../config/db'); // Import đối tượng kết nối db từ file server/config/db.js

const User = {
    // 1. Hàm lấy tất cả người dùng
    getAllUsers: async () => {
        const [rows] = await db.query("SELECT * FROM Users");
        return rows;
    },

    // 2. Hàm tìm người dùng theo Email
    findByEmail: async (email) => {
        const [rows] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);
        return rows[0]; 
    },

    // 3. Hàm tạo tài khoản mới
    createUser: async (fullName, email, passwordHash, role) => {
        const query = "INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(query, [fullName, email, passwordHash, role]);
        return result.insertId; 
    }
};

module.exports = User;
