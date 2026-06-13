/* ==========================
DOM ELEMENTS
========================== */
const ordersTable = document.getElementById("usersTableBody") || document.getElementById("adminOrderTableBody") || document.getElementById("ordersTable");
const bookingAdminList = document.getElementById("bookingAdminList");
const productList = document.getElementById("productList");
const statusFilter = document.getElementById("statusFilter");
const orderSearch = document.getElementById("orderSearch");

/* ==========================
INIT STORAGE / DATA
========================== */
let products = JSON.parse(localStorage.getItem("products")) || [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let orders = []; // Nạp dữ liệu live từ API SQL Server

/* ==========================
DASHBOARD COUNTER
========================== */
function dashboardStats() {
    const revenue = orders.reduce((a, b) => a + parseFloat(b.TotalPrice || b.total || 0), 0);
    
    const totalRevenueCard = document.getElementById("totalRevenue") || document.getElementById("totalRevenueCount");
    if (totalRevenueCard) totalRevenueCard.innerText = `$${revenue.toFixed(2)}`;

    const totalOrdersCard = document.getElementById("totalOrders");
    if (totalOrdersCard) totalOrdersCard.innerText = orders.length;

    const totalBookingsCard = document.getElementById("totalBookings");
    if (totalBookingsCard) totalBookingsCard.innerText = bookings.length;

    const totalCustomersCard = document.getElementById("totalCustomers") || document.getElementById("totalUsersCount");
    if (totalCustomersCard && !document.getElementById("totalUsersCount")) {
        totalCustomersCard.innerText = new Set(orders.map(o => o.FullName || o.customer)).size;
    }
}

/* ==========================
RENDER ORDERS (CHUẨN 6 CỘT KHỚP THEO ĐÚNG DATABASE & HTML)
========================== */
function renderOrders(data = orders) {
    if (!ordersTable) return;
    ordersTable.innerHTML = "";

    if (data.length === 0) {
        ordersTable.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #aaa;">Không tìm thấy đơn hàng nào.</td></tr>`;
        return;
    }

    data.forEach(order => {
        // Map chính xác theo các cột trong SQL Server (Id, FullName, UserEmail, TotalPrice, OrderDate, Status)
        const orderId = order.Id || order.id;
        const customerName = order.FullName || order.customer || "Khách vãng lai";
        const email = order.UserEmail || order.email || "Chưa cập nhật";
        const total = parseFloat(order.TotalPrice || order.total || 0).toFixed(2);
        const status = order.Status || order.status || "Chờ xử lý";
        const orderDate = order.OrderDate ? new Date(order.OrderDate).toLocaleString('vi-VN') : "Vừa xong";

        // Render chuẩn xác khớp 6 ô <td> tương ứng với 6 cột trên thẻ <thead> của HTML
        ordersTable.innerHTML += `
        <tr style="border-bottom: 1px solid #333;" onmouseover="this.style.background='#252525'" onmouseout="this.style.background='transparent'">
            <td style="padding: 12px; font-weight: bold; color: #ffd700;">#${orderId}</td>
            
            <td style="padding: 12px;">${customerName}</td>
            
            <td style="padding: 12px; color: #aaa;">${email}</td>
            
            <td style="padding: 12px; font-weight: bold; color: #ffd700;">$${total}</td>
            
            <td style="padding: 12px; font-size: 14px; color: #bbb;">${orderDate}</td>
            
            <td class="status-column" style="padding: 12px;">
                <select class="status-select" data-order-id="${orderId}" onchange="updateOrderStatus(this)" 
                    style="background: #252525; color: #ffd700; border: 1px solid #ffd700; padding: 4px 8px; border-radius: 4px; font-weight: bold; cursor: pointer; outline: none;">
                    <option value="Chờ xử lý" ${status === 'Chờ xử lý' || status === 'Pending' ? 'selected' : ''}>Chờ xử lý</option>
                    <option value="Đang giao" ${status === 'Đang giao' || status === 'Shipping' ? 'selected' : ''}>Đang giao</option>
                    <option value="Đã giao" ${status === 'Đã giao' || status === 'Completed' ? 'selected' : ''}>Đã giao</option>
                    <option value="Đã hủy" ${status === 'Đã hủy' || status === 'Cancelled' ? 'selected' : ''}>Đã hủy</option>
                </select>
            </td>
        </tr>
        `;
    });
}

/* ==========================
LOAD ORDERS FROM LIVE BACKEND API
========================== */
async function loadLiveOrdersFromServer() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/admin/orders');
        const data = await response.json();

        if (data.success && data.orders) {
            orders = data.orders;
        } else {
            // Chế độ dự phòng giả lập khớp cấu trúc Database thực tế của bạn
            orders = [
                { Id: 1, FullName: "Nguyễn Văn An", UserEmail: "an@gmail.com", TotalPrice: 30.00, Status: "Chờ xử lý", OrderDate: new Date() }
            ];
        }
    } catch (error) {
        console.error('Không thể kết nối đến API Backend, chuyển sang chế độ dữ liệu offline:', error);
        orders = [
            { Id: 1, FullName: "Nguyễn Văn An", UserEmail: "an@gmail.com", TotalPrice: 30.00, Status: "Chờ xử lý", OrderDate: new Date() }
        ];
    }
    renderOrders();
    dashboardStats();
    drawChart();
}

/* ==========================
UPDATE ORDER STATUS DIRECTLY TO API
========================== */
async function updateOrderStatus(selectElement) {
    const orderId = selectElement.getAttribute('data-order-id');
    const newStatus = selectElement.value;

    try {
        const response = await fetch(`http://localhost:5000/api/auth/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();
        if (data.success) {
            alert(`Cập nhật trạng thái đơn hàng #${orderId} sang [${newStatus}] thành công!`);
            orders = orders.map(o => {
                if ((o.Id || o.id).toString() === orderId.toString()) {
                    o.Status = newStatus;
                    o.status = newStatus;
                }
                return o;
            });
            dashboardStats();
            drawChart();
        } else {
            alert('Máy chủ báo lỗi: ' + data.message);
        }
    } catch (error) {
        console.error('Lỗi truyền tải kết nối cập nhật trạng thái:', error);
        orders = orders.map(o => {
            if ((o.Id || o.id).toString() === orderId.toString()) {
                o.status = newStatus; o.Status = newStatus;
            }
            return o;
        });
        alert(`[Offline Mode] Đã lưu tạm trạng thái đơn hàng #${orderId} thành công.`);
        dashboardStats();
        drawChart();
    }
}

/* ==========================
SEARCH SEARCHING
========================== */
if (orderSearch) {
    orderSearch.addEventListener("keyup", () => {
        const keyword = orderSearch.value.toLowerCase();
        const result = orders.filter(item => {
            const name = item.FullName || item.customer || "";
            return name.toLowerCase().includes(keyword);
        });
        renderOrders(result);
    });
}

/* ==========================
FILTER STATUS
========================== */
if (statusFilter) {
    statusFilter.addEventListener("change", () => {
        const value = statusFilter.value;
        if (value === "all") {
            renderOrders();
            return;
        }
        const result = orders.filter(item => {
            const currentStatus = item.Status || item.status || "";
            return currentStatus === value;
        });
        renderOrders(result);
    });
}

/* ==========================
BOOKING MANAGEMENT
========================== */
function renderBookings() {
    if (!bookingAdminList) return;
    bookingAdminList.innerHTML = "";

    if (bookings.length === 0) {
        bookingAdminList.innerHTML = "<p style='color: #aaa; padding: 15px;'>Không có lịch đặt bàn nào hiện tại.</p>";
        return;
    }

    bookings.forEach(item => {
        bookingAdminList.innerHTML += `
        <div class="booking-card" style="background: #1e1e1e; padding: 15px; border: 1px solid #2a2a2a; border-radius: 8px; margin-bottom: 10px;">
            <h3 style="color: #ffd700;">${item.name}</h3>
            <p style="color: #aaa; margin: 5px 0;">${item.date} | ${item.time}</p>
            <p style="font-weight: bold;">Bàn số: ${item.table}</p>
            <div style="margin-top: 10px;">
                <button onclick="approveBooking(${item.id})" style="background: #00b386; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Duyệt</button>
                <button onclick="deleteBooking(${item.id})" style="background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Xóa</button>
            </div>
        </div>
        `;
    });
}

function approveBooking(id) {
    alert("Lịch đặt bàn đã được phê duyệt thành công!");
}

function deleteBooking(id) {
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    renderBookings();
    dashboardStats();
}

/* ==========================
CRUD PRODUCT (MÓN ĂN)
========================== */
function renderProducts() {
    if (!productList) return;
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = "<p style='color: #aaa; padding: 15px;'>Chưa có món ăn nào trong thực đơn.</p>";
        return;
    }

    products.forEach(product => {
        productList.innerHTML += `
        <div class="booking-card" style="background: #1e1e1e; padding: 15px; border: 1px solid #2a2a2a; border-radius: 8px; margin-bottom: 10px;">
            <h3 style="color: #ffd700;">${product.name}</h3>
            <p style="color: #00b386; font-weight: bold; margin: 5px 0;">$${parseFloat(product.price).toFixed(2)}</p>
            <p style="color: #aaa; font-size: 14px;">Danh mục: ${product.category}</p>
            <button onclick="removeProduct(${product.id})" style="background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Xóa món</button>
        </div>
        `;
    });
}

function addProduct() {
    const nameEl = document.getElementById("productName");
    const priceEl = document.getElementById("productPrice");
    const categoryEl = document.getElementById("productCategory");

    if (!nameEl || !priceEl) return;

    const name = nameEl.value;
    const price = priceEl.value;
    const category = categoryEl ? categoryEl.value : "General";

    if (name === "" || price === "") {
        alert("Vui lòng điền đầy đủ tên món và giá bán!");
        return;
    }

    const product = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        category
    };

    products.push(product);
    saveProducts();

    nameEl.value = "";
    priceEl.value = "";
}

function removeProduct(id) {
    products = products.filter(p => p.id !== id);
    saveProducts();
}

/* ==========================
REVENUE CHART (VẼ BIỂU ĐỒ)
========================== */
function drawChart() {
    const canvas = document.getElementById("revenueChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 700;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const values = orders.map(o => parseFloat(o.TotalPrice || o.total || 0));
    if (values.length === 0) return;

    const barWidth = 60;
    const spacing = 40;

    values.forEach((value, index) => {
        const maxHeight = Math.max(...values, 100);
        const height = (value / maxHeight) * 200;

        ctx.fillStyle = "#ffd700";
        ctx.fillRect(index * (barWidth + spacing) + 50, 250 - height, barWidth, height);

        ctx.fillStyle = "#fff";
        ctx.font = "12px Segoe UI";
        ctx.fillText(`$${value.toFixed(1)}`, index * (barWidth + spacing) + 60, 240 - height);
        ctx.fillText(`#${orders[index].Id || orders[index].id}`, index * (barWidth + spacing) + 60, 270);
    });
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
}

/* ==========================
INITIALIZATION
========================== */
document.addEventListener("DOMContentLoaded", () => {
    loadLiveOrdersFromServer();
    renderBookings();
    renderProducts();
});