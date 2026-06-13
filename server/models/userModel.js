const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Đảm bảo đường dẫn này đúng tới file db.js của bạn

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'Id' // Khớp với cột Id trong SQL Server
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'FullName' // Khớp với cột FullName trong SQL Server
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'Email' // Khớp với cột Email trong SQL Server
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'PasswordHash' // Biến password trong code sẽ lưu vào cột PasswordHash ở DB
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'Customer',
        field: 'Role' // Khớp với cột Role trong SQL Server
    }
}, {
    tableName: 'Users', // Bắt buộc trỏ đúng tên bảng viết hoa chữ U trong SSMS
    timestamps: false   // Tắt timestamps nếu trong DB bạn tự tạo cột CreatedAt độc lập
});

module.exports = User;