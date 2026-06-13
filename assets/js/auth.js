document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    const loginForm = document.querySelector('.auth-form:not(.register-form)');

    // 1. XỬ LÝ SỰ KIỆN ĐĂNG KÝ
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const roleSelect = document.getElementById('registerRole');
            const role = roleSelect ? roleSelect.value : 'Customer';

            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, password, role })
                });
                const data = await response.json();
                
                if (response.ok && data.success) {
                    alert('Đăng ký thành công!');
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || 'Đăng ký thất bại!');
                }
            } catch (err) {
                alert('Không thể kết nối tới server Backend!');
            }
        });
    }

    // 2. XỬ LÝ SỰ KIỆN ĐĂNG NHẬP
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('loginEmail') || document.getElementById('email');
            const passwordInput = document.getElementById('loginPassword') || document.getElementById('password');

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailInput.value.trim(),
                        password: passwordInput.value
                    })
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    alert(data.message);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));

                    const userRole = data.user.role ? data.user.role.toLowerCase() : 'customer';
                    if (userRole === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.message || 'Đăng nhập thất bại!');
                }
            } catch (err) {
                alert('Lỗi kết nối server!');
            }
        });
    }
});