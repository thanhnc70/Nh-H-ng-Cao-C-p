const dotenv = require('dotenv');
const app = require('./app'); // Nhập cấu hình ứng dụng từ file app.js ở trên
const { connectDB } = require('./config/db'); // Hàm kết nối database của bạn

// 1. Nạp cấu hình các biến môi trường từ file .env
dotenv.config();

// 2. Kích hoạt lệnh kết nối tới cơ sở dữ liệu SQL Server
connectDB();

// 3. Khai báo cổng chạy (Ưu tiên cổng trong file .env, nếu không có sẽ chạy cổng 5000)
const PORT = process.env.PORT || 5000;

// 4. Khởi chạy Server lắng nghe các yêu cầu từ Frontend
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`✅ Server Backend đang chạy ổn định tại: http://localhost:${PORT}`);
    console.log(`🚀 Hệ thống API đã sẵn sàng phục vụ kết nối!`);
    console.log(`======================================================\n`);
});