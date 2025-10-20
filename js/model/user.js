// ===========================
// 1. Lớp User
// ===========================
class User {
	constructor({ id, username, email, password, role = 'user' }) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
		this.role = role;
	}

	viewProfile() {
		return {
			id: this.id,
			username: this.username,
			email: this.email,
			role: this.role
		};
	}

	hasPermission(action) {
		return User.permissions[this.role]?.includes(action) ?? false;
	}

	static permissions = {
		user: ['view_product', 'add_to_cart'],
		admin: ['view_product', 'add_to_cart', 'create_product', 'delete_product', 'manage_users']
	};
}


// ===========================
// 2. Lớp Admin (kế thừa User)
// ===========================
class Admin extends User {
	constructor(props) {
		super({ ...props, role: 'admin' });
	}

	createProduct(product) {
		if (!this.hasPermission('create_product')) {
			throw new Error('Bạn không có quyền tạo sản phẩm');
		}
		console.log('Sản phẩm đã được tạo:', product);
	}

	deleteUser(userId) {
		if (!this.hasPermission('manage_users')) {
			throw new Error('Bạn không có quyền xoá user');
		}
		const users = AuthService.getAllUsers().filter(u => u.id !== userId);
		localStorage.setItem('users', JSON.stringify(users));
		console.log('Đã xoá user ID', userId);
	}
}

// ===========================
// 3. AuthService (đăng ký, đăng nhập, session)
// ===========================
export class AuthService {
	static apiUrl = "http://localhost:3000/users"; 
	static validateEmail(email) {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	}
	static async register(username, email, password, role = "user") {
		const res = await fetch(this.apiUrl);
		const users = await res.json();
		if (users.some(u => u.username === username)) {
			throw new Error("Tên đăng nhập đã tồn tại");
		}
		if (users.some(u => u.email === email)) {
			throw new Error("Email đã được sử dụng");
		}
		if (!this.validateEmail(email)) {
			throw new Error("Email không hợp lệ");
		}
		const newUser = { id: Date.now(), username, email, password, role };
		await fetch(this.apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newUser),
		});
		console.log("Đăng ký thành công:", username);
		return newUser;
	}

	static async login(usernameOrEmail, password) {
		const res = await fetch(this.apiUrl);
		const users = await res.json();
		const found = users.find(
			u =>
				(u.username === usernameOrEmail || u.email === usernameOrEmail) &&
				u.password === password
		);
		if (!found) throw new Error("Sai tài khoản hoặc mật khẩu");
		const userInstance = found.role === "admin" ? new Admin(found) : new User(found);
		localStorage.setItem("currentUser", JSON.stringify(found));
		console.log("Đăng nhập thành công:", found.username);
		return userInstance;
	}
	static logout() {
		localStorage.removeItem("currentUser");
		console.log("Đã đăng xuất");
	}
	static getCurrentUser() {
		const data = localStorage.getItem("currentUser");
		if (!data) return null;
		const raw = JSON.parse(data);
		return raw.role === "admin" ? new Admin(raw) : new User(raw);
	}
	static async getAllUsers() {
		const res = await fetch(this.apiUrl);
		return await res.json();
	}
}
