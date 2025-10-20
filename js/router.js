import { initHomePage,initProductPage, getProductForDetailPage,initLoginPage} from "./main.js";
import { initCartPage} from "./model/cart.js"
// todo: 1. Danh sách routes và file HTML tương ứng
const left_path = "./";
const routes = {
	"/": left_path + "pages/home.html",
	"/about": left_path + "pages/about.html",
	"/products": left_path + "pages/product.html",
	"/login": left_path + "pages/login.html",
	"/cart": left_path + "pages/cart.html",
	// "/dashboard": "../admin/index.html",
};

// todo: 2. Router chính
async function router() {
	const path = location.hash.slice(1) || "/";
	const app = document.getElementById("main");

	// 2.1: Trường hợp detail sản phẩm "/product/:id"
	if (path.startsWith("/product/")) {
		const productSlug = path.split("/")[2];
		getProductForDetailPage(productSlug);
		return;
	}

	// 2.2: Trường hợp route có trong danh sách
	const file = routes[path];
	if (file) {
		try {
			const res = await fetch(file);
			const html = await res.text();
			app.innerHTML = html;

			// Gọi init function theo path
			callInitFunction(path);
		} catch (err) {
			console.error(err);
			app.innerHTML = "<h1>Lỗi khi load file!</h1>";
		}
	} else {
		// 2.3: Route không có trong danh sách -> 404
		try {
			const res = await fetch(left_path + "pages/404.html");
			const html = await res.text();
			app.innerHTML = html;
		} catch (err) {
			app.innerHTML = "<h1>Lỗi khi load file 404!</h1>";
		}
	}

	// highlight link đang chọn
	document.querySelectorAll("nav a").forEach(link => {
		link.classList.toggle("active", link.getAttribute("href") === "#" + path);
	});
}

// todo: 3. Map path -> init function
const initMap = {
	"/": () => initHomePage && initHomePage(),
	"/about": () => initAboutPage && initAboutPage(),
	"/products": () => initProductPage && initProductPage(),
	"/login": () => initLoginPage && initLoginPage(),
	"/cart": () => initCartPage && initCartPage(),
	// "/dashboard": () => initDashboard && initDashboard	(),
};

// todo: 4. Hàm gọi init function tự động
function callInitFunction(path) {
	if (initMap[path]) {
		initMap[path]();
	}
}

// todo: 5. Gắn sự kiện
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
