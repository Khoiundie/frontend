function updateCartCount(cartLenght) {
	setTimeout(()=> {
		const cartCountEl = document.getElementById('number');
		if(cartCountEl){
		cartCountEl.innerHTML = cartLenght;
		} else {
			return console.log("dell thấy cartContEl") 
		}
	},100)
}

class Cart {
	constructor() {
		this.items = JSON.parse(localStorage.getItem('cart')) || [];
	}

	saveCart(newArray) {
		localStorage.setItem('cart', JSON.stringify(newArray));
	}

	addItem(product, quantity = 1) {
		const existingItem = this.items.find(item => item.id == product.id);
		if (existingItem) {
			console.log("sản phẩm đã tồn tại trong cart");
			existingItem.quantity += quantity;
		} else {
			console.log("sản phẩm chưa tồn tại trong cart");
			this.items.push({ ...product, quantity });
		}
		this.saveCart(this.items);
		this.updateUI();
	}

	removeItem(id) {
		const item = this.items.find(i => i.id == id);
		if (item) {
			item.quantity--;
			if (item.quantity <= 0) {
				this.items = this.items.filter(i => i.id != id);
			}
			this.saveCart(this.items);
			this.updateUI();
		}
	}

	increaseItem(id) {
		const item = this.items.find(i => i.id == id);
		if (item) {
			item.quantity++;
			this.saveCart(this.items);
			this.updateUI();
		}
	}

	decreaseItem(id) {
		const item = this.items.find(i => i.id == id);
		if (item) {
			item.quantity--;
			if (item.quantity <= 0) {
				this.removeItem(id);
			} else {
				this.saveCart(this.items);
				this.updateUI();
			}
		}
	}

	removeAll() {
		this.items = [];
		this.saveCart(this.items);
		this.updateUI();
	}

	cartQuantity() {
		return this.items.reduce((total, item) => total + item.quantity, 0);
	}

	updateUI() {
		const cartPage = document.getElementById('cart_section-content');
		if (cartPage) {
			cartPage.innerHTML = this.render();
		}
		if (typeof updateCartCount === "function") {
			updateCartCount(this.cartQuantity());
		}
	}

	totalPrice() {
		let total = 0;
		this.items.forEach((item)=> {
			total += item.price * item.quantity
		})
		return total
	}

	render() {
		if (this.cartQuantity() == 0) {
			return `
			<div class="none_product rounded-4 d-flex flex-column g-2 position-relative" style="max-width: 800px; margin: 2rem auto; transform-style: preserve-3d;">
				<img src="./img/bannerSide/noneProduct.png" alt="">
				<div class="text w-100 text-center text-secondary"><p>Giỏ hàng của bạn đang trống</p></div>
				<div class="position-absolute breath_effect"></div>
			</div>`;
		} else {
			return this.items.map(item => `
				<div class="cart_item border rounded p-3 d-flex justify-content-between align-items-center">
					<div class="d-flex align-items-center gap-3">
						<img src="${item.image}" width="60" height="60" style="object-fit:cover">
						<div>
							<div>${item.name}</div>
							<div class="text-danger fw-bold fs-6">
								${parseInt(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
							</div>
						</div>
					</div>
					<div class="d-flex align-items-center gap-2">
						<button type="button" class="btn btn-outline-primary btn-sm" onclick="decreaseItem(${item.id})"><i class="bi bi-dash"></i></button>
						<div class="cart_item-quantity">${item.quantity}</div>
						<button type="button" class="btn btn-outline-primary btn-sm" onclick="increaseItem(${item.id})"><i class="bi bi-plus"></i></button>
					</div>
					<button type="button" class="btn btn-danger btn-sm" onclick="removeItem(${item.id})">Xóa</button>
				</div>
			`).join('') + `
				<div class="text-end mt-3">
					<button type="button" class="btn btn-outline-danger" onclick="removeAll()">Xóa toàn bộ</button>
				</div>
				<div>${this.totalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
			`;
		}
	}
}


const cart = new Cart();
updateCartCount(cart.cartQuantity())
document.addEventListener('click', function (e) {	
	if (e.target && e.target.id == "addCartBtn") {
		const id = e.target.getAttribute('productId');
		fetch(`http://localhost:3000/products/${id}`)
			.then(res => res.json())
			.then(product => {
				cart.addItem(product);
				console.log(cart)
				updateCartCount(cart.cartQuantity())
			})
	}
})
//? ===================
//? innit cartPage 
//? ===================
export async function initCartPage() {
	const cartPage = document.getElementById('cart_section-content');
	cartPage.innerHTML = cart.render();
	updateCartCount(cart.cartQuantity());
}  


window.addEventListener('DOMContentLoaded', () => {
	updateCartCount(cart.cartQuantity());
	const cartPage = document.getElementById('cart_section-content');
	if (cartPage) {
		cartPage.innerHTML = cart.render();
	}
});
window.removeItem =  function (id) {
	setTimeout(() => {
		cart.removeItem(id);
	}, 100);
}
window.increaseItem =  function (id) {
	setTimeout(() => {
		cart.increaseItem(id);
	}, 100);
}
window.decreaseItem =  function (id) {
	setTimeout(() => {
		cart.decreaseItem(id);
	}, 100);
}
window.removeAll =  function (id) {
	setTimeout(() => {
		cart.removeAll(id);
	}, 100);
}

