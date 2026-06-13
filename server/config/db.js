const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 12347,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // ◄ BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ KẾT NỐI ĐƯỢC AIVEN
    }
});

const db = pool.promise();

const connectDB = async () => {
    try {
        await db.query("SELECT 1");
        console.log('✅ KẾT NỐI MYSQL ĐÁM MÂY (AIVEN) THÀNH CÔNG!');
    } catch (err) {
        console.error('❌ LỖI KẾT NỐI DATABASE:', err);
    }
};

module.exports = { connectDB, db };
