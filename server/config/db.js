const sql = require('mssql');

const config = {
    user: 'sa', 
    password: '123456', // Đảm bảo mật khẩu này trùng với mật khẩu sa trong SSMS của bạn
    server: 'localhost', 
    database: 'NhaHangDB', 
    options: {
        encrypt: false,               
        trustServerCertificate: true  // Bắt buộc đối với SQL Server đời mới
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('✅ KẾT NỐI SQL SERVER THÀNH CÔNG!');
    } catch (err) {
        console.error('❌ LỖI KẾT NỐI DATABASE:', err.message);
    }
};

module.exports = { connectDB, sql };