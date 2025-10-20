import "./views/loadLayout.js";
import { loadLayout, loadMainLayout } from "./views/loadLayout.js";
import './router.js';
import "./model/cart.js";
import {loginFunciton} from "./login.js";
class Product {
	constructor(id, name, slug, brand, price, description, category, image, rating,hot, authentic,warranty,variants,colorOptions, specs,updateAt) {
		this.id = id;
		this.name = name;
		this.slug = slug;
		this.brand = brand;
		this.price = price;
		this.image = image;
		this.description = description;
		this.category = category;
		this.rating = rating;
		this.hot = hot;
		this.image = image;
		this.authentic = authentic;
		this.warranty = warranty;
		this.variants = variants;
		this.colorOptions = colorOptions;
		this.specs = specs;
		this.updateAt = updateAt;
	}
	render() {
		const discountedPrice = brandPromotion(this.price, this.brand);

		// Nếu có giảm giá
		let priceHtml = "";
		if (discountedPrice !== this.price) {
			priceHtml = `
			<span class="d-flex gap-2 align-items-center flex-wrap" style="height:fit-content;">
				<p class="text-primary mb-0">Giá:</p>
				<span class="text-danger fw-bold">${discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
				<span class="text-muted text-decoration-line-through text-secondary" style="font-size: 12px;">${this.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
			</span>
		`;
		} else {
			// Không giảm giá
			priceHtml = `
			<span class="d-flex gap-2 align-items-center" style="height:fit-content;">
				<p class="text-primary mb-0">Giá:</p>
				<span class="fw-bold text-danger">${this.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
			</span>
		`;
		}

		return `
		<div class="card" style="min-width: 230px;">
			<a href="#/product/${this.slug}" class="card text-decoration-none py-0 h-100 pt-2 position-relative" style="border:none;">
				${this.hot ? `<span class="badge bg-danger position-absolute">HOT</span>` : ""}
				${getDiscountPercent(this.price, discountedPrice) > 0 ? `<span class="badge bg-primary position-absolute discount">Giảm ${getDiscountPercent(this.price, discountedPrice)}<i class="fa-regular fa-percent"></i></span>` : ""}
				<img src="${this.image}" class="card-img-top text-center" alt="${this.name}" style="max-width:180px; margin:0 auto;">
				
				<div class="card-body d-flex flex-column gap-1 algin-align-items-center justify-content-center">
					<h5 class="card-title">${this.name}</h5>
					<div class="d-flex align-content-center gap-2 flex-column">
						${getDay(this.updateAt) < 80 ? `<span class="badge success">Hàng mới về</span>` : ""}
						${priceHtml}
						${getDay(this.updateAt) < 10 ? `<span class="badge primary">Tstore member giảm 300.000đ</span>` : ""}
					</div>
				</div>
			</a>
			<div>
				<div></div>
				<a href="#?id=${this.id}" onclick="getIdFromUrl()" class=" d-flex align-items-center gap-2 justify-content-end mb-1 love_btn" style="padding: 1rem;" id="love_btn">
					<i class="fa-solid fa-heart"></i>
					<span class="d-block" style="height:fit-content;">Yêu thích</span>
				</a>
			</div>
		</div>
	`;
	}
	renderWarranty() {

	}
	renderSpect() {
		if(this.category == "điện thoại") {
			return `
			<div class="d-flex flex-column gap-2">
				<div class=""><h4 style="font-weight: 400;">Màng hình</h4></div>
				<div class="d-flex align-items-center gap-2 h-100">
					<i class="bi bi-phone-fill fs-5"></i>
					<span>${getFirstTwoWords(this.specs.screen)}</span>
				</div>
			</div>
			<!--<div class="line"></div>-->
			<div class="d-flex flex-column gap-2">
				<div class=""><h4 style="font-weight: 400;">Camera</h4></div>
				<div class="d-flex align-items-center gap-2 h-100">
					<i class="fa-solid fa-camera fs-5"></i>
					<span>${getFirstOneWords(this.specs.camera)}</span>
				</div>
			</div>
			<div class="d-flex flex-column gap-2">
				<div class=""><h4 style="font-weight: 400;">Dung lượng pin</h4></div>
				<div class="d-flex align-items-center gap-2 h-100">
					<i class="bi bi-battery-full fs-4"></i>
					<span>${this.specs.battery}</span>
				</div>
			</div>
			`
		} if(this.category == "laptop") {
			return `
			<div><i class="bi bi-phone-fill"></i><span>${this.category}</span></div>
			<div><i class="bi bi-phone-fill"></i><span>${this.category}</span></div>
			<div><i class="bi bi-phone-fill"></i><span>${this.category}</span></div>
			`
		} if(this.category == "tai nghe") {
			return `
			<div><i class="bi bi-phone-fill"></i><span>${this.category}</span></div>
			<div><i class="bi bi-phone-fill"></i><span>${this.category}</span></div>
			<div><i class="bi bi-phone-fill"></i><span>${this.category}</span></div>
			`
		}
	}
	renderColorOptions() {
		console.log("🧩 renderColorOptions() chạy với:", this);
		console.log("colorOptions:", this.colorOptions);

		if (!Array.isArray(this.colorOptions)) {
			console.warn("⚠️ colorOptions không hợp lệ:", this.colorOptions);
			return '<p>Không có dữ liệu màu</p>';
		}
		console.log(this.colorOptions)
		return `
			<h5 class="mt-2 fw-bold">Phiên bản màu hiện có:</h5>
			<div class="color-group mb-2">
				${this.colorOptions.map((item, index) => `
					<label class="color-option">
						<input 
							type="radio" 
							name="colorOptions" 
							value="${item}" 
							data-color='${JSON.stringify(item)}'
							${index===0 ? "checked" : ""}
							style="background-color: ${getColorCode(item)};"
						>
						<span>${item}</span>
					</label>
				`).join("")}
			</div>
		`;
	}
	renderVariants() {
		return `
			<h5 class="mt-2 fw-bold">Phiên bản hiện có:</h5>
			<div class="variant-group mb-2">
				${this.variants.map((v, i) => `
					<label class="variant-option">
						<input 
							type="radio" 
							name="variant" 
							value="${v.ram}/${v.rom}" 
							data-variant='${JSON.stringify(v)}'
							${i===0 ? "checked" : ""}
						>
						<span>${v.ram} / ${v.rom}</span>
					</label>
				`).join("")}
			</div>
		`;
	}


	renderDetail() {
	return `
		<div class="container my-5 bg-white detail_container">
			<div class="d-flex gap-4">
				<div class="col-md-6 p-4 rounded-2 position-relative d-flex flex-column gap-2" style="max-width: 450px;">
					<img src="${this.image}" class="img-fluid rounded" alt="${this.name}" style="max-width: 450px;">
					${this.hot ? `<span class="badge bg-danger position-absolute">HOT</span>` : ""}
					<div class="d-flex flex-column">
						<div class="m-2 py-2 pb-3" style="border-bottom:1px solid #0000002b;">
							<h4>Thông số nổi bật:</h4>
						</div>
						<div class="d-flex justify-content-between p-2">
							${this.renderSpect()}
						</div>
						<div class="d-flex flex-column">
							<div class="d-flex justify-content-between m-2 py-2"  style="border-top:1px solid #0000002b;">
								<h4>Chính sách sản phẩm:</h4>
								<a src="" class="text-primary text-decoration-underline" style="font-size:12px;">Tìm hiểu thêm &#8250;</a>
							</div>
							<ul class="d-flex flex-column gap-2 p-2">	
								<li class="d-flex align-items-center gap-2 position-relative chinhsach_item">
									<img alt="Hàng ${this.authentic} - Bảo hành ${this.warranty}" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" class="size-5 pc:size-6" srcset="https://cdn2.fptshop.com.vn/svg/Type_Bao_hanh_chinh_hang_4afa1cb34d.svg 1x, https://cdn2.fptshop.com.vn/svg/Type_Bao_hanh_chinh_hang_4afa1cb34d.svg 2x" src="https://cdn2.fptshop.com.vn/svg/Type_Bao_hanh_chinh_hang_4afa1cb34d.svg" style="color: transparent;">
									<span>Hàng ${this.authentic} - Bảo hành ${this.warranty}</span>
								</li>
								<li class="d-flex align-items-center gap-2 position-relative chinhsach_item">
									<img alt="Miễn phí giao hàng toàn quốc" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" class="size-5 pc:size-6" srcset="https://cdn2.fptshop.com.vn/svg/Type_Giao_hang_toan_quoc_318e6896b4.svg 1x, https://cdn2.fptshop.com.vn/svg/Type_Giao_hang_toan_quoc_318e6896b4.svg 2x" src="https://cdn2.fptshop.com.vn/svg/Type_Giao_hang_toan_quoc_318e6896b4.svg" style="color: transparent;">
									<span>Miễn phí giao hàng</span>
								</li>
								<li class="d-flex align-items-center gap-2 position-relative chinhsach_item">
									<img alt="Kỹ thuật viên hỗ trợ trực tuyến" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" class="size-5 pc:size-6" srcset="https://cdn2.fptshop.com.vn/svg/icon_ktv_8c9caa2c06.svg 1x, https://cdn2.fptshop.com.vn/svg/icon_ktv_8c9caa2c06.svg 2x" src="https://cdn2.fptshop.com.vn/svg/icon_ktv_8c9caa2c06.svg" style="color: transparent;">
									<span>Kỹ thuật viên hỗ trợ trực tuyến</span>								
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="d-flex flex-column justify-content-between">
					<div class="d-flex flex-column justify-content-between">
						<div style="max-width: 250px;" class="my-1">
							<img alt="D2C - Free Ship toàn quốc" loading="lazy" decoding="async" data-nimg="fill" class="relative w-auto object-contain" sizes="100vw" srcset="https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg 360w, https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg 480w, https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg 640w, https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg 750w, https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg 828w, https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg 1080w, https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg 1200w, https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg 1920w" src="https://cdn2.fptshop.com.vn/svg/Mien_phi_giao_hang_Detail_f24a37cad5.svg" style="height: 100%; width: 100%; inset: 0px; color: transparent;">
						</div>
						<div class="d-flex align-align-items-center gap-2">
							<h2 class="fs-4 fw-bold">${this.name}</h2>
							<span class="fs-6 d-flex gap-1" style="line-height: 1.8rem;">|<i class="bi bi-star-fill" style="color: #FCD34D;"></i>${this.rating}</span>
							<!--<span class="fs-6 bange-authentic">${this.authentic}</span>-->
							<!--<span class="fs-6 bange-warranty">Bảo hành ${this.warranty}</span>-->
						</div>
						${this.renderColorOptions()}
						${this.renderVariants()}
						<div class="d-none">
						${handleVariantChange(this.price)}
						</div>
						<h4 class="text-danger price-wrapper d-flex align-items-center detail_price position-relative" >
							<span class="position-absolute title_price-detail text-black">Giá chỉ từ :</span>
							<span id="productPrice" style="width:160px;" class="position-relative fs-4">${this.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
						</h4>
						<div class="price-change" ></div>
						<p>${this.description}</p>
					</div>
					${this.renderStudentPro()}
					${this.renderMethod()}
					${this.renderTable()}
					<div class="mt-3 d-flex gap-2 align-items-center">
						<button type="button" class="d-flex gap-0 justify-content-center align-items-center shiny-btn" productId=${this.id} id="addCartBtn">
							Trả góp 0<i class="bi bi-percent"></i>
						</button>
						<button type="button" class="d-flex gap-2 justify-content-center align-items-center addtocart_btn" productId=${this.id} id="addCartBtn">
							<i class="bi bi-cart-check"></i> Thêm vào giỏ hàng
						</button>
						<button type="button" class="d-flex gap-2 justify-content-center align-items-center addtocart_btn" productId=${this.id} id="buyNowBtn">
							<i class="bi bi-cart-check"></i> Mua ngay
						</button>
						<a href="#/products" class="text-secondary text-decoration-none backtohome_btn" style="height: fit-content;">	
							<i class="bi bi-arrow-left"></i> Quay lại mua sắm
						</a>
					</div>
				</div>
			</div>
		</div>
	`;
}	
renderMethod(){
		return `
		<div class="w-100 rounded-2 border border-1 mt-3 overflow-hidden">
			<div class="p-3 fs-6 py-3 d-flex justify-content-between align-items-center" style="font-weight: 600; background-color: #0d6dfd2f;"><span style="font-weight: 600; class="fs-6">Khuyễn mãi thanh toán</span><a class="px-2 justify-content-end text-primary" style="width: fit-content; font-size: 12px;" href="">Xem thêm &#8250;</a></div>
			<div class="p-3 pt-2">
				<ul class="position-relative d-flex gap-2" style="padding-bottom: 4.5rem;">
					<li class="method_thanhtoan-item d-flex align-items-center gap-2 py-1 rounded-2 border border-1" style="width: 80px;height: 80px;">
						<img class="w-100 h-100" alt="Giảm ngay 500.000đ cho đơn từ 20 triệu khi trả góp 100% qua thẻ tín dụng Techcombank" loading="lazy" decoding="async" data-nimg="fill" class="rounded-xs object-contain" sizes="100vw" srcset="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg 360w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg 480w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg 640w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg 750w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg 828w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg 1080w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg 1200w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg 1920w" src="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-techcombank-inkythuatso-10-15-11-46-1753758027837.jpeg" style="height: 100%; width: 100%; inset: 0px; color: transparent;">
						<div class="position-absolute start-0 bottom-0 d-flex flex-column gap-2">
							<span class="" style="bottom: 18%;">Giảm ngay 500.000đ cho đơn từ 20 triệu khi trả góp 100% qua thẻ tín dụng Techcombank</span>
							<span class=" text-secondary" style="bottom:0%;">HSD: 31/10/2025</span>
						</div>
					</li>
					<li class="method_thanhtoan-item d-flex align-items-center gap-2 py-1 rounded-2 border border-1" style="width: 80px;height: 80px;">
						<img alt="Giảm ngay 10% tối đa 500.000đ cho đơn hàng khi thanh toán 100% qua thẻ tín dụng NCB" loading="lazy" decoding="async" data-nimg="fill" class="rounded-xs object-contain" sizes="100vw" srcset="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png 360w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png 480w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png 640w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png 750w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png 828w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png 1080w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png 1200w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png 1920w" src="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ncbank-1744348536816.png" style=" height: 100%; width: 100%; inset: 0px; color: transparent;">
						<div class="position-absolute start-0 bottom-0 d-flex flex-column gap-2">
							<span class="" style="left:0; bottom: 18%;">Giảm ngay 500.000đ cho đơn từ 20 triệu khi trả góp 100% qua thẻ tín dụng Techcombank</span>
							<span class=" text-secondary" style="bottom:0%;">HSD: 31/10/2025</span>
						</div>
					</li>
					<li class="method_thanhtoan-item d-flex align-items-center gap-2 py-1 rounded-2 border border-1" style="width: 80px;height: 80px;">
						<img alt="Giảm&nbsp;ngay 500,000đ cho đơn hàng từ 10 triệu khi thanh toán bằng thẻ OCB" loading="lazy" decoding="async" data-nimg="fill" class="rounded-xs object-contain" sizes="100vw" srcset="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png 360w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png 480w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png 640w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png 750w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png 828w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png 1080w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png 1200w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png 1920w" src="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-ocb-1751209894982.png" style="height: 100%; width: 100%; inset: 0px; color: transparent;">
						<div class="position-absolute start-0 bottom-0 d-flex flex-column gap-2">
							<span class="" style="left:0; bottom: 18%;">Giảm ngay 10% tối đa 500.000đ cho đơn hàng khi thanh toán 100% qua thẻ tín dụng NCB </span>
							<span class=" text-secondary" style="bottom:0%;">HSD: 28/11/2025</span>
						</div>
					</li>
					<li class="method_thanhtoan-item d-flex align-items-center gap-2 py-1 rounded-2 border border-1" style="width: 80px;height: 80px;">
						<img alt="Giảm đến 800.000đ cho đơn trên 15 triệu khi trả góp 100% qua thẻ Visa (áp dụng Sacombank và Muadee by HDBank)" loading="lazy" decoding="async" data-nimg="fill" class="rounded-xs object-contain" sizes="100vw" srcset="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png 360w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png 480w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png 640w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png 750w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png 828w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png 1080w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png 1200w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png 1920w" src="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-visa-1744348654364.png" style="height: 100%; width: 100%; inset: 0px; color: transparent;">
						<div class="position-absolute start-0 bottom-0 d-flex flex-column gap-2">
							<span class="" style="left:0; bottom: 18%;">Giảm ngay 500,000đ cho đơn hàng từ 10 triệu khi thanh toán bằng thẻ OCB </span>
							<span class=" text-secondary" style="bottom:0%;">HSD: 31/10/2025</span>
						</div>
					</li>
					<li class="method_thanhtoan-item d-flex align-items-center gap-2 py-1 rounded-2 border border-1" style="width: 80px;height: 80px;">
						<img alt="Giảm ngay 50% tối đa 100.000đ cho Khách hàng mới Hoặc Giảm 5% tối đa 200,000đ đơn hàng từ 700.000đ  khi thanh toán qua Kredivo" loading="lazy" decoding="async" data-nimg="fill" class="rounded-xs object-contain" sizes="100vw" srcset="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png 360w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png 480w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png 640w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png 750w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png 828w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png 1080w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png 1200w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png 1920w" src="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/logo-Kredivo-1744348489666.png" style="height: 100%; width: 100%; inset: 0px; color: transparent;">
						<div class="position-absolute start-0 bottom-0 d-flex flex-column gap-2">
							<span class="" style="left:0; bottom: 18%;">Giảm ngay 50% tối đa 100.000đ cho Khách hàng mới Hoặc Giảm 5% tối đa 200,000đ đơn hàng từ 700.000đ khi thanh toán qua Kredivo </span>
							<span class=" text-secondary" style="bottom:0%;">HSD: 31/10/2025</span>
						</div>
					</li>
					<li class="method_thanhtoan-item d-flex align-items-center gap-2 py-1 rounded-2 border border-1" style="width: 80px;height: 80px;">
						<img alt="Giảm ngay 500,000đ cho hóa đơn từ 10,000,000đ khi thanh toán qua HDBank" loading="lazy" decoding="async" data-nimg="fill" class="rounded-xs object-contain" sizes="100vw" srcset="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png 360w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png 480w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png 640w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png 750w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png 828w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png 1080w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png 1200w, https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png 1920w" src="https://s3-sgn09.fptcloud.com/ict-k8s-promotion-prod/images-promotion/462636566_533475369687081_1230000458424744947_hd%20bank%201-1733973320478.png" style="height: 100%; width: 100%; inset: 0px; color: transparent;">
						<div class="position-absolute start-0 bottom-0 d-flex flex-column gap-2">
							<span class="" style="left:0; bottom: 18%;">Giảm ngay 500,000đ cho hóa đơn từ 10,000,000đ khi thanh toán qua HDBank </span>
							<span class=" text-secondary" style="bottom:0%;">HSD: 31/10/2025</span>
						</div>
					</li>
				</ul>
				
			</div>
		</div> 
		<div class="d-none"></div>
		`
	}
	renderTable(){
		return `
		<div class="w-100 rounded-2 border border-1 mt-3 overflow-hidden">
			<div class="p-3 fs-6 py-3" style="font-weight: 600; background-color: #0d6dfd2f;">Quà tặng và ưu đãi khi mua hàng</div>
			<div class="p-3 pt-2">
				<div class="d-flex align-items-center gap-2 py-2">
					<i class="bi bi-gift text-center position-relative" style="width:20px; height:20px; line-height:100%; vertical-align: middle;"></i>
					<span>
						Tặng phiếu mua hàng 50,000đ khi mua sim FPT kèm máy
					</span>
				</div>
				<ul>
					<li class="d-flex align-items-center gap-2 py-1">
						<span style="flex-shrink:0;">Ưu đãi</span>
						<span class="line-center w-100" style="height: 1px; background-color:#0000002b;transform: scaleY(0.5);"></span>
					</li>
					<li class="d-flex align-items-center gap-2 py-1">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-full" style="flex-shrink: 0;" ><path d="M13.3341 4.06264L13.4105 4.21523L13.9871 5.74849C14.0324 5.86924 14.1276 5.96451 14.2484 6.00981L15.7287 6.56519C16.3784 6.8089 16.7274 7.50307 16.5543 8.15984L16.5127 8.29055L15.824 9.81366C15.7706 9.93107 15.7706 10.0658 15.824 10.1832L16.478 11.6227C16.7651 12.2544 16.5211 12.9921 15.9342 13.3341L15.7816 13.4105L14.2484 13.9871C14.1276 14.0324 14.0324 14.1276 13.9871 14.2484L13.4317 15.7287C13.188 16.3784 12.4938 16.7274 11.837 16.5543L11.7063 16.5127L10.1832 15.824C10.0658 15.7706 9.93107 15.7706 9.81366 15.824L8.37419 16.478C7.7425 16.7651 7.00481 16.5211 6.6628 15.9342L6.58637 15.7816L6.00981 14.2484C5.96451 14.1276 5.86924 14.0324 5.74849 13.9871L4.26815 13.4317C3.61852 13.188 3.26944 12.4938 3.44254 11.837L3.48419 11.7063L4.17288 10.1832C4.22623 10.0658 4.22623 9.93107 4.17288 9.81366L3.51883 8.37419C3.23181 7.7425 3.47582 7.00481 4.06264 6.6628L4.21523 6.58637L5.74849 6.00981C5.86924 5.96451 5.96451 5.86924 6.00981 5.74849L6.56519 4.26815C6.8089 3.61852 7.50307 3.26944 8.15984 3.44254L8.29055 3.48419L9.81366 4.17288C9.93107 4.22623 10.0658 4.22623 10.1832 4.17288L11.6227 3.51883C12.2544 3.23181 12.9921 3.47582 13.3341 4.06264ZM12.1627 7.70393L8.9765 11.3453L7.81383 10.1827C7.63939 10.0082 7.35657 10.0082 7.18213 10.1827C7.00768 10.3571 7.00768 10.6399 7.18213 10.8144L8.6824 12.3147C8.86511 12.4974 9.16427 12.4874 9.33442 12.2929L12.8351 8.29221C12.9975 8.10656 12.9787 7.82436 12.793 7.66191C12.6074 7.49946 12.3252 7.51827 12.1627 7.70393Z" fill="url(#paint0_linear_2374_403820)"></path><defs><linearGradient id="paint0_linear_2374_403820" x1="8.7433" y1="17.3679" x2="21.4098" y2="-3.45304" gradientUnits="userSpaceOnUse"><stop offset="0.381435" stop-color="#8B7D75"></stop><stop offset="0.84052" stop-color="#DAC392"></stop></linearGradient></defs></svg>
						<span>Giảm 5% mua camera cho đơn hàng Điện thoại/ Tablet từ 1 triệu </span>
					</li>
					<li class="d-flex align-items-center gap-2 py-1">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-full" style="flex-shrink: 0;" ><path d="M13.3341 4.06264L13.4105 4.21523L13.9871 5.74849C14.0324 5.86924 14.1276 5.96451 14.2484 6.00981L15.7287 6.56519C16.3784 6.8089 16.7274 7.50307 16.5543 8.15984L16.5127 8.29055L15.824 9.81366C15.7706 9.93107 15.7706 10.0658 15.824 10.1832L16.478 11.6227C16.7651 12.2544 16.5211 12.9921 15.9342 13.3341L15.7816 13.4105L14.2484 13.9871C14.1276 14.0324 14.0324 14.1276 13.9871 14.2484L13.4317 15.7287C13.188 16.3784 12.4938 16.7274 11.837 16.5543L11.7063 16.5127L10.1832 15.824C10.0658 15.7706 9.93107 15.7706 9.81366 15.824L8.37419 16.478C7.7425 16.7651 7.00481 16.5211 6.6628 15.9342L6.58637 15.7816L6.00981 14.2484C5.96451 14.1276 5.86924 14.0324 5.74849 13.9871L4.26815 13.4317C3.61852 13.188 3.26944 12.4938 3.44254 11.837L3.48419 11.7063L4.17288 10.1832C4.22623 10.0658 4.22623 9.93107 4.17288 9.81366L3.51883 8.37419C3.23181 7.7425 3.47582 7.00481 4.06264 6.6628L4.21523 6.58637L5.74849 6.00981C5.86924 5.96451 5.96451 5.86924 6.00981 5.74849L6.56519 4.26815C6.8089 3.61852 7.50307 3.26944 8.15984 3.44254L8.29055 3.48419L9.81366 4.17288C9.93107 4.22623 10.0658 4.22623 10.1832 4.17288L11.6227 3.51883C12.2544 3.23181 12.9921 3.47582 13.3341 4.06264ZM12.1627 7.70393L8.9765 11.3453L7.81383 10.1827C7.63939 10.0082 7.35657 10.0082 7.18213 10.1827C7.00768 10.3571 7.00768 10.6399 7.18213 10.8144L8.6824 12.3147C8.86511 12.4974 9.16427 12.4874 9.33442 12.2929L12.8351 8.29221C12.9975 8.10656 12.9787 7.82436 12.793 7.66191C12.6074 7.49946 12.3252 7.51827 12.1627 7.70393Z" fill="url(#paint0_linear_2374_403820)"></path><defs><linearGradient id="paint0_linear_2374_403820" x1="8.7433" y1="17.3679" x2="21.4098" y2="-3.45304" gradientUnits="userSpaceOnUse"><stop offset="0.381435" stop-color="#8B7D75"></stop><stop offset="0.84052" stop-color="#DAC392"></stop></linearGradient></defs></svg>
						<span>Trả góp 0% lãi suất, MIỄN PHÍ chuyển đổi kì hạn 3 - 6 tháng qua thẻ tín dụng</span>
					</li>
					<li class="d-flex align-items-center gap-2 py-1">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-full" style="flex-shrink: 0;" ><path d="M13.3341 4.06264L13.4105 4.21523L13.9871 5.74849C14.0324 5.86924 14.1276 5.96451 14.2484 6.00981L15.7287 6.56519C16.3784 6.8089 16.7274 7.50307 16.5543 8.15984L16.5127 8.29055L15.824 9.81366C15.7706 9.93107 15.7706 10.0658 15.824 10.1832L16.478 11.6227C16.7651 12.2544 16.5211 12.9921 15.9342 13.3341L15.7816 13.4105L14.2484 13.9871C14.1276 14.0324 14.0324 14.1276 13.9871 14.2484L13.4317 15.7287C13.188 16.3784 12.4938 16.7274 11.837 16.5543L11.7063 16.5127L10.1832 15.824C10.0658 15.7706 9.93107 15.7706 9.81366 15.824L8.37419 16.478C7.7425 16.7651 7.00481 16.5211 6.6628 15.9342L6.58637 15.7816L6.00981 14.2484C5.96451 14.1276 5.86924 14.0324 5.74849 13.9871L4.26815 13.4317C3.61852 13.188 3.26944 12.4938 3.44254 11.837L3.48419 11.7063L4.17288 10.1832C4.22623 10.0658 4.22623 9.93107 4.17288 9.81366L3.51883 8.37419C3.23181 7.7425 3.47582 7.00481 4.06264 6.6628L4.21523 6.58637L5.74849 6.00981C5.86924 5.96451 5.96451 5.86924 6.00981 5.74849L6.56519 4.26815C6.8089 3.61852 7.50307 3.26944 8.15984 3.44254L8.29055 3.48419L9.81366 4.17288C9.93107 4.22623 10.0658 4.22623 10.1832 4.17288L11.6227 3.51883C12.2544 3.23181 12.9921 3.47582 13.3341 4.06264ZM12.1627 7.70393L8.9765 11.3453L7.81383 10.1827C7.63939 10.0082 7.35657 10.0082 7.18213 10.1827C7.00768 10.3571 7.00768 10.6399 7.18213 10.8144L8.6824 12.3147C8.86511 12.4974 9.16427 12.4874 9.33442 12.2929L12.8351 8.29221C12.9975 8.10656 12.9787 7.82436 12.793 7.66191C12.6074 7.49946 12.3252 7.51827 12.1627 7.70393Z" fill="url(#paint0_linear_2374_403820)"></path><defs><linearGradient id="paint0_linear_2374_403820" x1="8.7433" y1="17.3679" x2="21.4098" y2="-3.45304" gradientUnits="userSpaceOnUse"><stop offset="0.381435" stop-color="#8B7D75"></stop><stop offset="0.84052" stop-color="#DAC392"></stop></linearGradient></defs></svg>
						<span>HOÀN NGAY 100% phí chuyển đổi trả góp, trị giá lên đến 3.500.000 khi mở và thanh toán bằng TP Bank EVO</span>
					</li>
				</ul>
			</div>
		</div>
		`
	}
	renderStudentPro(){
		return `
			<div class="d-flex gap-1 mt-3">
				<div style="max-width: 200px;" class="rounded-1 overflow-hidden">
					<img src="./img/bannerSide/hssv_new.png">
				</div>
				<div class="d-flex gap-1 flex-column rounded-1 overflow-hidden w-100 p-2" style="border:1px solid #0d6efd; background-color: #0d6dfd2f;">
					<h1 class="fs-5">Đặc quyền HSSV</h1>
					<span class="text-secondary">Bạn được giảm:</span>
					<span class="text-primary" style="font-size: 1.1rem;">213.000đ</span>
					<button class="px-2 justify-content-end text-primary" style="width: fit-content; font-size: 12px; margin-left:auto;">Xác thực ngay &#8250;</button>
				</div>
			</div>
		
		`
	}
}

// ? =================Helper function===================
function getFirstTwoWords(str) {
	return str.split(" ").slice(0, 2).join(" ");
}
function getFirstOneWords(str) {
	return str.split(" ").slice(0, 1).join(" ");
}

const colorMap = {
	"Đen": "#000000",
	"Trắng": "#FFFFFF",
	"Xám": "#808080",
	"Xanh dương": "#007BFF",
	"Xanh lá": "#28A745",
	"Đỏ": "#FF0000",
	"Vàng": "#FFD700",
	"Tím": "#800080",
	"Hồng": "#FFC0CB",
	"Bạc": "#C0C0C0",
	"Xanh ngọc": "#00CED1",
	"Tím Bora": "#8A2BE2",
	"Đen Graphite": "#1C1C1C",
	"Xanh Neon": "#39FF14"
};

function getColorCode(colorName) {
	const colorCode = colorMap[colorName] || "#CCCCCC";
	return colorCode;
}

function handleVariantChange(basePrice, options = { showDiff: true, highlight: true }) {
	setTimeout(() => {
		const radios = document.querySelectorAll('input[name="variant"]');
		const priceEl = document.getElementById('productPrice');
		let diffEl = document.getElementById('priceDiff');
		let bestDealEl = document.getElementById('bestDeal'); // Span hiển thị “tiết kiệm nhất”

		// Lấy toàn bộ giá variant để tìm giá thấp nhất
		const allPrices = Array.from(radios).map(r => JSON.parse(r.dataset.variant).price);
		const minPrice = Math.min(...allPrices);

		let currentPrice = basePrice;

		// Nếu chưa có phần tử hiển thị chênh lệch, tạo mới
		if (!diffEl) {
			diffEl = document.createElement('span');
			diffEl.id = 'priceDiff';
			diffEl.style.marginLeft = '10px';
			diffEl.style.fontSize = '1rem';
			diffEl.style.fontWeight = '600';
			diffEl.style.transition = 'opacity 0.3s ease, color 0.3s ease';
			priceEl.parentElement.appendChild(diffEl);
		}

		// Nếu chưa có span "Tiết kiệm nhất", tạo mới
		if (!bestDealEl) {
			bestDealEl = document.createElement('span');
			bestDealEl.id = 'bestDeal';
			bestDealEl.textContent = 'Tiết kiệm nhất';
			bestDealEl.style.display = 'inline-block';
			bestDealEl.style.marginLeft = '12px';
			bestDealEl.style.color = '#1b5e20';
			bestDealEl.style.fontWeight = '500';
			bestDealEl.style.fontSize = '10px';
			priceEl.parentElement.appendChild(bestDealEl);
		}

		// Lặp qua từng radio variant
		radios.forEach(radio => {
			radio.addEventListener('change', (e) => {
				const variantData = JSON.parse(e.target.dataset.variant);
				const newPrice = variantData.price;

				// Chênh lệch dựa theo giá thấp nhất (không phải giá hiện tại)
				const diff = newPrice - minPrice;

				const sign = diff > 0 ? '+' : diff < 0 ? '-' : '';
				const formattedDiff = diff === 0 ? '' : `${sign}${Math.abs(diff).toLocaleString('vi-VN')}₫`;

				// Cập nhật giá chênh lệch nếu bật showDiff
				if (options.showDiff) {
					diffEl.textContent = formattedDiff;
					diffEl.style.color = diff > 0 ? '#e63946' : diff < 0 ? '#1b5e20' : '#555';
					diffEl.style.opacity = formattedDiff ? 1 : 0.6;
				} else {
					diffEl.style.opacity = 0;
				}

					// Hiển thị “tiết kiệm nhất” khi chọn giá thấp nhất
				if (newPrice === minPrice) {
					bestDealEl.style.opacity = '1';
				} else {
					bestDealEl.style.opacity = '0';
				}

				// Hiệu ứng highlight giá chính (nếu bật)
				if (options.highlight) {
					priceEl.classList.add('flash');
					setTimeout(() => priceEl.classList.remove('flash'), 500);
				}

				// Animation tăng giảm giá mượt
				animatePrice(currentPrice, newPrice, 900, (val) => {
					priceEl.textContent = val.toLocaleString('vi-VN', {
						style: 'currency',
						currency: 'VND'
					});
				});

				currentPrice = newPrice;
			});
		});
	}, 100);
}
// Animation số mượt
function animatePrice(from, to, duration, onUpdate) {
	const start = performance.now();
	function update(now) {
		const progress = Math.min((now - start) / duration, 1);
		const eased = easeOutCubic(progress);
		const current = Math.round(from + (to - from) * eased);
		onUpdate(current);
		if (progress < 1) requestAnimationFrame(update);
	}
	requestAnimationFrame(update);
}

function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}





//?===========RenderFuntion=============
function renderProduct(array, el) {
	let html = '';
	array.forEach(item => {
		const product = new Product(
			item.id,
			item.name,
			item.slug,
			item.brand,
			item.price,
			item.description,
			item.category,
			item.image,
			item.rating,
			item.hot,
			item.authentic,
			item.warranty,
			item.variants,
			item.colorOptions,
			item.specs,
			item.updatedAt,
		);
		html += product.render();
	});
	el.innerHTML = renderLoadingEffect(el, array.length)
	setTimeout(() => { el.innerHTML = html }, 500)
}

function renderLoadingEffect(el, count) {
	let html = '';
	for (let i = 0; i < count; i++) {
		html += skeletonCardLoadindEffect();
	}
	return html;
}

function renderOnlyOneProduct(array, el) {
	let html = '';
	array.forEach(item => {
		const product = new Product(
			item.id,
			item.name,
			item.slug,
			item.brand,
			item.price,
			item.description,
			item.category,
			item.image,
			item.rating,
			item.hot,
			item.authentic,
			item.warranty,
			item.variants,
			item.colorOptions,
			item.specs,
			item.updatedAt,
		);
		html += product.renderDetail();
		
	});
	el.innerHTML = html;
	
	// Gọi hàm methodBankHoverEffect chỉ khi ở trang detail
	methodBankHoverEffect();
}
function methodBankHoverEffect() {
	const items = document.querySelectorAll(".method_thanhtoan-item");
	items.forEach((li, index) => {
		const spans = li.querySelectorAll("span");
		spans.forEach(span => {
		span.style.display = index === 0 ? "block" : "none";
		});
	});

	let activeLi = items[0];

	items.forEach(li => {
		li.addEventListener("mouseenter", () => {
		if (activeLi && activeLi !== li) {
			activeLi.querySelectorAll("span").forEach(span => {
			span.style.display = "none";
			});
		}

		li.querySelectorAll("span").forEach(span => {
			span.style.display = "block";
		});
		});

		li.addEventListener("mouseleave", () => {
		activeLi = li;
		});
	});
}








//? ===================
//? innit HomePage 
//? ===================
export function initHomePage() {
	const productHot = document.getElementById("product-hot");
	const productLaptop = document.getElementById("product-laptop");
	const productPhone = document.getElementById("product-phone");
	getFourProductForHomePage(productHot, productLaptop, productPhone)
}
function getFourProductForHomePage(hot, latop, phone) {
	if (hot || latop || phone) {
		fetch('http://localhost:3000/products')
			.then(res => res.json())
			.then(data => {

				const dataHot = data.filter(item => item.hot).slice(0, 4);
				const dataLaptop = data.filter(item => item.category === "laptop").slice(0, 4);
				const dataPhone = data.filter(item => item.category === "điện thoại").slice(0, 4);

				// render product ra ngoài view
				renderProduct(dataHot, hot);
				renderProduct(dataLaptop, latop);
				renderProduct(dataPhone, phone);
			});

	}
}


//? ===================
//? innit ProductPage 
//? ===================
export function initProductPage() {
	//*Load all product in product page
	const productPage = document.getElementById('product-page');
	loadProductforProductPage(productPage)
	//*load Product new
	const newProductBtn = document.getElementById('new_product')
	newProductBtn.addEventListener('click', () => {
		loadNewProduct(productPage)
	})
	const asc = document.getElementById('soft_asc');
	asc.addEventListener('click', async () => {
		if (asc.classList.contains('active')) { asc.classList.remove('active') }
		else {
			asc.classList.add('active')
			console.log(sortProductsByPrice())
			const products = await sortProductsByPrice("asc");
			renderProduct(products, productPage)
		}
	})
	const desc = document.getElementById('soft_desc');
	desc.addEventListener('click', async () => {
		if (desc.classList.contains('active')) { desc.classList.remove('active') }
		else {
			desc.classList.add('active')
			const products = await sortProductsByPrice("desc");
			renderProduct(products, productPage)
		}
	})
	showCategoryContainerContent()
	showCategoryRamRomContent()
	//*Lấy ra mảng gồm start price và end price
	initPriceFilter("price-filter", (values) => {
		getProductWithPrice(values, productPage)
		console.log("Nhận array bên ngoài:", values);
	});
}

async function loadProductforProductPage(el) {
	const res = await fetch('http://localhost:3000/products');
	const data = await res.json();
	renderProduct(data, el)
}

async function loadNewProduct(el) {
	try {
		const res = await fetch('http://localhost:3000/products');
		if (!res.ok) { throw new Error("Có lỗi khi lấy mảng full sản phầm trong fun loadnewproduct"); }
		const data = await res.json();
		console.log(data)
		const filterNewProduct = data.filter((item) => getDay(item.updatedAt) < 80)
		console.log(filterNewProduct)
		renderProduct(filterNewProduct, el)
	}
	catch (err) { console.error('Có lỗi khi loadNewProduct', err) }
}

function showCategoryContainerContent() {
	const li = document.getElementById('filter_category-btn');
	const back = document.getElementById('back_btn-category');
	const cateContainer = document.getElementById('category_product');
	li.addEventListener('click', () => {
		if (cateContainer.classList.contains('active')) { cateContainer.classList.remove('active') } else {
			cateContainer.classList.add('active');
		}
	})
	back.addEventListener('click', () => {
		cateContainer.classList.remove('active');
		console.log(cateContainer)
		console.log(back)
	})
}

function showCategoryRamRomContent() {
	const li = document.getElementById('filter_ramrom-btn');
	const back = document.getElementById('back_btn-ramrom');
	const cateContainer = document.getElementById('category_ramrom');
	li.addEventListener('click', () => {
		if (cateContainer.classList.contains('active')) { cateContainer.classList.remove('active') } else {
			cateContainer.classList.add('active');
		}
	})
	back.addEventListener('click', () => {
		cateContainer.classList.remove('active');
		console.log(cateContainer)
		console.log(back)
	})
}
async function sortProductsByPrice(order = 'asc') {
	try {
		const res = await fetch('http://localhost:3000/products');
		if (!res.ok) { throw new Error("Lỗi khi lấy product array"); }
		const products = await res.json();
		// order có thể là 'asc' (tăng dần) hoặc 'desc' (giảm dần)
		const sorted = [...products].sort((a, b) => {
			if (order === 'asc') {
				return a.price - b.price; // từ thấp đến cao
			} else {
				return b.price - a.price; // từ cao đến thấp
			}
		});
		return sorted;
	} catch (err) { console.error('loi kh xap xep', err) }
}


//? ===================
//? innit loginPage 
//? ===================
export async function initLoginPage() {
	await loadMainLayout("#main", "login")
	await loginFunciton()
}





// todo: deltail page lấy sản phẩm từ url rồi render ra
export async function getProductForDetailPage(slug) {
	try {
		const res = await fetch(`http://localhost:3000/products?slug=${slug}`);
		if (!res.ok) { throw new Error(`Không thể lấy sản phẩm có slug=${slug}`) }
		const product = await res.json();
		await loadMainLayout("#main", "detail")
		const mainElementInDetail = document.getElementById('detail-page')
		if (!mainElementInDetail) { throw new Error(`Không thể tìm đc element có id=#detail-page`) };
		renderOnlyOneProduct(product, mainElementInDetail)
		
	} catch (err) {
		console.error('Lỗi khi lấy sản phẩm dể render ra detail', err)
	}
}

//todo: Trả về Danh sách brand theo Category Vidu: getBrand("điện thoại")
async function getBrand(category) {
	const res = await fetch('http://localhost:3000/products')
	const data = await res.json();
	const brands = [...new Set(
		data.filter(item => item.category == category)
			.map(item => item.brand)
	)]
	return brands;

}

//todo: Trả về Danh sách NameProduct theo Category Vidu: getNameProductHot("điện thoại")
async function getNameProductHot(category) {
	const res = await fetch('http://localhost:3000/products')
	const data = await res.json()
	const names = [...new Set(
		data.filter(item => item.category == category)
			.map(item => item.name)
	)]
	return names;
}

//todo: Trả về thời gian tùy vào updateAt
function getDay(dayStart) {
	const start = new Date(dayStart);
	const end = new Date();
	const diff = end - start;
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	return days;
}

//todo: Giảm giá theo brand
function brandPromotion(price, el) {
	const discounts = {
		"Samsung": 25,
		"Apple": 5,
		"Vivo": 14,
		"Xiaomi": 18,
	}
	const discountPercent = discounts[el] || 0;
	return price * (1 - discountPercent / 100);
}

//todo: Trả về phần trăm giảm giá
function getDiscountPercent(originalPrice, discountedPrice) {
	if (originalPrice <= 0) return 0; // tránh chia cho 0
	const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
	return Math.round(discount); // làm tròn số %
}

//todo: Hàm trả về mảng sản phẩm đc tìm theo giá và render ra luôn
async function getProductWithPrice(priceArray, container) {
	const res = await fetch('http://localhost:3000/products');
	const data = await res.json();
	const min = parseInt(priceArray[0].toString().replace(/\D/g, ""), 10);
	const max = parseInt(priceArray[1].toString().replace(/\D/g, ""), 10);
	const productWithPrice = data.filter(item => {
		return item.price >= min && item.price <= max;
	});
	console.log("Sản phẩm lọc được:", productWithPrice);
	renderProduct(productWithPrice, container);
}

//todo: hàm trả về mảng chứa price min và price max
function initPriceFilter(containerId, onApply) {
	const container = document.getElementById(containerId);
	const trigger = document.getElementById("filter_btn-price");
	if (!container || !trigger) return;

	const rangeMin = container.querySelector("#range-min");
	const rangeMax = container.querySelector("#range-max");
	const minInput = container.querySelector("#min-price");
	const maxInput = container.querySelector("#max-price");
	const applyBtn = container.querySelector("#apply");
	const closeBtn = container.querySelector(".price-filter__btn-close");
	const sliderRange = container.querySelector("#slider-range");
	const minGap = 0;

	let isOpen = false;

	function open() {
		container.classList.add("open");
		isOpen = true;
	}
	function close() {
		container.classList.remove("open");
		isOpen = false;
	}
	function toggle() {
		isOpen ? close() : open();
	}

	//** */ Bấm vào li -> mở/đóng
	trigger.addEventListener("click", (e) => {
		// Nếu click vào chính container bên trong thì bỏ qua (để tránh toggle khi dùng filter)
		if (container.contains(e.target)) return;
		toggle();
	});

	//** */ Bấm nút Đóng
	closeBtn?.addEventListener("click", (e) => {
		e.preventDefault();
		close();
	});

	//** */ Bấm nút Xem kết quả
	applyBtn?.addEventListener("click", (e) => {
		e.preventDefault();
		close();
		const values = [minInput.value, maxInput.value];
		if (typeof onApply === "function") onApply(values);
	});

	//** */ Click ra ngoài -> đóng
	document.addEventListener("click", (e) => {
		if (!isOpen) return;
		if (!trigger.contains(e.target) && !container.contains(e.target)) {
			close();
		}
	});

	//** */ ESC -> đóng
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") close();
	});

	//** */ Format số tiền
	function formatPrice(num) {
		return Number(num || 0).toLocaleString("vi-VN") + "đ";
	}

	function updateSlider(e) {
		let minVal = parseInt(rangeMin.value) || 0;
		let maxVal = parseInt(rangeMax.value) || 0;

		if (maxVal - minVal <= minGap) {
			if (e && e.target === rangeMin) {
				minVal = maxVal - minGap;
				rangeMin.value = minVal;
			} else {
				maxVal = minVal + minGap;
				rangeMax.value = maxVal;
			}
		}

		minInput.value = formatPrice(minVal);
		maxInput.value = formatPrice(maxVal);

		const maxAllowed = parseInt(rangeMax.max || 100, 10);
		const percentMin = (minVal / maxAllowed) * 100;
		const percentMax = (maxVal / maxAllowed) * 100;
		sliderRange.style.left = percentMin + "%";
		sliderRange.style.width = (percentMax - percentMin) + "%";
	}

	rangeMin.addEventListener("input", updateSlider);
	rangeMax.addEventListener("input", updateSlider);
	updateSlider();
}

//todo: skeletonCard render
function skeletonCardLoadindEffect() {
	return `
		<div class="skeleton-card" role="status" aria-busy="true" aria-label="Loading product">
			<div class="skeleton-image"></div>
			<div class="skeleton-body">
				<div class="skeleton-title"></div>
				<div class="skeleton-line short"></div>
				<div class="skeleton-line"></div>
				<div class="skeleton-line small"></div>

				<div class="skeleton-footer">
					<div class="skeleton-price"></div>
					<div class="skeleton-btn"></div>
				</div>
			</div>

			<div class="skeleton-bubbles" aria-hidden="true">
				<span class="bubble b1"></span>
				<span class="bubble b2"></span>
				<span class="bubble b3"></span>
			</div>
		</div>
	`
}

//todo: hàm trả về và render ra sản phẩm đc tìm kiếm
window.searchProduct = async function () {
	try {
		const res = await fetch("http://localhost:3000/products")
		if (!res.ok) { throw new Error("lỗi khi cố lấy full mảng product"); }
		const products = await res.json();

		const keyword = document.getElementById('find_input').value.trim().toLowerCase();
		console.log(keyword)
		const resultList = document.getElementById('resultList');

		const result = products.filter(item => item.name.toLowerCase().includes(keyword));
		console.log(result)
		resultList.innerHTML = '';

		if (keyword === '') return;

		if (result.length > 0) {
			renderProduct(result, resultList)
		} else {
			resultList.innerHTML = '<li>Không tìm thấy sản phẩm nào</li>';
		}
	}
	catch (err) {
		console.error("lỗi khi chay hàm search product", err)
	}
}

//todo: hàm điểu khiển overlay khi tìm kiếm
window.overlayControll = function () {
	showOverlayNavbar()
	removeOvelayNavbar()
}

//todo: hàm show overlay
function showOverlayNavbar() {
	console.log('function dã đc load')
	const navBarOverlay = document.getElementById('nav_overlay')
	navBarOverlay.classList.add('active')
}

//todo: hàm ẩn overlay
function removeOvelayNavbar() {
	const navOverLay = document.getElementById('nav_overlay');
	if (navOverLay) {
		navOverLay.addEventListener('click', function () {
			if (navOverLay.classList.contains('active')) { navOverLay.classList.remove('active') }
		})
	}
}












