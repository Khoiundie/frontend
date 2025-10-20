import { AuthService } from "./model/user.js";
export function loginFunciton() {
	const loginForm = document.getElementById("loginForm");
	console.log(loginForm)
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
		console.log("click")
        const emailOrUsername = loginForm.querySelector("input[type='email']").value.trim();
        const password = loginForm.querySelector("input[type='password']").value.trim();
        try {
            const user = await AuthService.login(emailOrUsername, password);
            if (user.role === "admin") {
                alert("Đăng nhập admin thành công!");
                window.location.href = "admin/index.html";
            } else {
                alert("Đăng nhập người dùng thành công!");
                window.location.href = "index.html";
            }
            console.log("Thông tin người dùng:", user.viewProfile());
        } catch (err) {
            alert(err.message);
            console.error("Lỗi đăng nhập:", err);
        }
    });
}
