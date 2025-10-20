// // Định nghĩa các class cho các bảng dữ liệu

// export class Brand {
//     constructor(id, name, logo, description) {
//         this.id = id;
//         this.name = name;
//         this.logo = logo;
//         this.description = description;
//     }

//     static async getById(id) {
//         try {
//             const res = await fetch(`http://localhost:3000/brands/${id}`);
//             if (!res.ok) throw new Error(`Không thể lấy thương hiệu có id=${id}`);
//             const data = await res.json();
//             return new Brand(data.id, data.name, data.logo, data.description);
//         } catch (err) {
//             console.error('Lỗi khi lấy thương hiệu:', err);
//             return null;
//         }
//     }

//     static async getAll() {
//         try {
//             const res = await fetch('http://localhost:3000/brands');
//             if (!res.ok) throw new Error('Không thể lấy danh sách thương hiệu');
//             const data = await res.json();
//             return data.map(item => new Brand(item.id, item.name, item.logo, item.description));
//         } catch (err) {
//             console.error('Lỗi khi lấy danh sách thương hiệu:', err);
//             return [];
//         }
//     }
// }

// export class Category {
//     constructor(id, name, description) {
//         this.id = id;
//         this.name = name;
//         this.description = description;
//     }

//     static async getById(id) {
//         try {
//             const res = await fetch(`http://localhost:3000/categories/${id}`);
//             if (!res.ok) throw new Error(`Không thể lấy danh mục có id=${id}`);
//             const data = await res.json();
//             return new Category(data.id, data.name, data.description);
//         } catch (err) {
//             console.error('Lỗi khi lấy danh mục:', err);
//             return null;
//         }
//     }

//     static async getAll() {
//         try {
//             const res = await fetch('http://localhost:3000/categories');
//             if (!res.ok) throw new Error('Không thể lấy danh sách danh mục');
//             const data = await res.json();
//             return data.map(item => new Category(item.id, item.name, item.description));
//         } catch (err) {
//             console.error('Lỗi khi lấy danh sách danh mục:', err);
//             return [];
//         }
//     }
// }




// export class Product {
//     constructor(id, name, slug, brand_id, price, description, category_id, image, rating, hot, authentic, warranty, specs_id, updatedAt) {
//         this.id = id;
//         this.name = name;
//         this.slug = slug;
//         this.brand_id = brand_id;
//         this.price = price;
//         this.description = description;
//         this.category_id = category_id;
//         this.image = image;
//         this.rating = rating;
//         this.hot = hot;
//         this.authentic = authentic;
//         this.warranty = warranty;
//         this.specs_id = specs_id;
//         this.updatedAt = updatedAt;
        
//         // Các thuộc tính sẽ được tải sau
//         this.brand = null;
//         this.category = null;
//         this.variants = [];
//         this.colorOptions = [];
//         this.specs = null;
//     }

//     async loadRelatedData() {
//         // Tải thương hiệu
//         if (this.brand_id) {
//             this.brand = await Brand.getById(this.brand_id);
//         }
        
//         // Tải danh mục
//         if (this.category_id) {
//             this.category = await Category.getById(this.category_id);
//         }
        
//         // Tải biến thể
//         this.variants = await Variant.getByProductId(this.id);
        
//         // Tải màu sắc
//         const colors = await Color.getByProductId(this.id);
//         this.colorOptions = colors.map(color => color.color_name);
        
//         // Tải thông số kỹ thuật
//         if (this.specs_id) {
//             this.specs = await Spec.getById(this.specs_id);
//         }
        
//         return this;
//     }

//     render() {
//         // Giữ nguyên logic render hiện tại
//         const brandName = this.brand?.name || '';
//         const categoryName = this.category?.name || '';
        
//         // Tạo badge HOT
//         let badgeHot = '';
//         if (this.hot) {
//             badgeHot = `<div class="badge-hot">HOT</div>`;
//         }

//         // Tạo badge giảm giá
//         let badgeSale = '';
//         if (this.variants && this.variants.length > 0) {
//             const maxPrice = Math.max(...this.variants.map(variant => variant.price));
//             if (maxPrice > this.price) {
//                 const percent = Math.round((maxPrice - this.price) / maxPrice * 100);
//                 badgeSale = `<div class="badge-sale">-${percent}%</div>`;
//             }
//         }

//         // Tạo badge hàng mới về
//         let badgeNew = '';
//         if (this.updatedAt) {
//             const dayDiff = getDay(this.updatedAt);
//             if (dayDiff < 10) {
//                 badgeNew = `<div class="badge-new">Mới</div>`;
//             }
//         }

//         // Tạo HTML cho sản phẩm
//         return `
//             <div class="product-item">
//                 <div class="product-image">
//                     <a href="/product/${this.slug}">
//                         <img src="${this.image}" alt="${this.name}">
//                     </a>
//                     <div class="product-badge">
//                         ${badgeHot}
//                         ${badgeSale}
//                         ${badgeNew}
//                     </div>
//                     <div class="product-actions">
//                         <div class="product-actions-item">
//                             <i class="fa-regular fa-heart"></i>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="product-content">
//                     <div class="product-content-header">
//                         <div class="product-category">${categoryName}</div>
//                         <div class="product-brand">${brandName}</div>
//                     </div>
//                     <h3 class="product-title">
//                         <a href="/product/${this.slug}">${this.name}</a>
//                     </h3>
//                     <div class="product-rating">
//                         ${this.renderRating()}
//                     </div>
//                     <div class="product-price">
//                         <span class="product-price-current">${formatCurrency(this.price)}</span>
//                     </div>
//                     ${this.renderSpect()}
//                 </div>
//             </div>
//         `;
//     }

//     renderRating() {
//         let html = '';
//         for (let i = 1; i <= 5; i++) {
//             if (i <= this.rating) {
//                 html += `<i class="fa-solid fa-star"></i>`;
//             } else {
//                 html += `<i class="fa-regular fa-star"></i>`;
//             }
//         }
//         return html;
//     }

//     renderSpect() {
//         if (!this.specs) return '';
        
//         const categoryName = this.category?.name?.toLowerCase() || '';
        
//         if (categoryName === 'điện thoại' || categoryName === 'laptop') {
//             return `
//                 <div class="product-specs">
//                     <div class="product-specs-item">
//                         <i class="fa-solid fa-mobile-screen"></i>
//                         <span>${this.specs.screen}</span>
//                     </div>
//                     <div class="product-specs-item">
//                         <i class="fa-solid fa-camera"></i>
//                         <span>${this.specs.camera}</span>
//                     </div>
//                     <div class="product-specs-item">
//                         <i class="fa-solid fa-battery-full"></i>
//                         <span>${this.specs.battery}</span>
//                     </div>
//                 </div>
//             `;
//         }
        
//         return '';
//     }

//     renderDetail() {
//         // Giữ nguyên logic renderDetail hiện tại
//         // Có thể cập nhật sau khi đã hoàn thành các phần khác
//         return `<div class="product-detail">
//             <div class="product-detail-image">
//                 <img src="${this.image}" alt="${this.name}">
//             </div>
//             <div class="product-detail-content">
//                 <h1 class="product-detail-title">${this.name}</h1>
//                 <div class="product-detail-rating">
//                     ${this.renderRating()}
//                 </div>
//                 <div class="product-detail-price">
//                     <span class="product-detail-price-current">${formatCurrency(this.price)}</span>
//                 </div>
//                 <div class="product-detail-description">
//                     ${this.description}
//                 </div>
//                 <div class="product-detail-variants">
//                     ${this.renderVariants()}
//                 </div>
//                 <div class="product-detail-colors">
//                     ${this.renderColors()}
//                 </div>
//                 <div class="product-detail-specs">
//                     ${this.renderDetailSpecs()}
//                 </div>
//             </div>
//         </div>`;
//     }

//     renderVariants() {
//         if (!this.variants || this.variants.length === 0) return '';
        
//         let html = '<h3>Phiên bản</h3><div class="variant-list">';
//         this.variants.forEach(variant => {
//             html += `<div class="variant-item">
//                 <span class="variant-name">${variant.name}</span>
//                 <span class="variant-price">${formatCurrency(variant.price)}</span>
//             </div>`;
//         });
//         html += '</div>';
//         return html;
//     }

//     renderColors() {
//         if (!this.colorOptions || this.colorOptions.length === 0) return '';
        
//         let html = '<h3>Màu sắc</h3><div class="color-list">';
//         this.colorOptions.forEach(color => {
//             html += `<div class="color-item">${color}</div>`;
//         });
//         html += '</div>';
//         return html;
//     }

//     renderDetailSpecs() {
//         if (!this.specs) return '';
        
//         return `<h3>Thông số kỹ thuật</h3>
//         <div class="specs-list">
//             <div class="specs-item">
//                 <span class="specs-label">Màn hình:</span>
//                 <span class="specs-value">${this.specs.screen}</span>
//             </div>
//             <div class="specs-item">
//                 <span class="specs-label">Camera:</span>
//                 <span class="specs-value">${this.specs.camera}</span>
//             </div>
//             <div class="specs-item">
//                 <span class="specs-label">Pin:</span>
//                 <span class="specs-value">${this.specs.battery}</span>
//             </div>
//             <div class="specs-item">
//                 <span class="specs-label">Bộ xử lý:</span>
//                 <span class="specs-value">${this.specs.processor}</span>
//             </div>
//             <div class="specs-item">
//                 <span class="specs-label">RAM:</span>
//                 <span class="specs-value">${this.specs.ram}</span>
//             </div>
//             <div class="specs-item">
//                 <span class="specs-label">Bộ nhớ:</span>
//                 <span class="specs-value">${this.specs.storage}</span>
//             </div>
//             <div class="specs-item">
//                 <span class="specs-label">Hệ điều hành:</span>
//                 <span class="specs-value">${this.specs.os}</span>
//             </div>
//         </div>`;
//     }

//     static async getById(id) {
//         try {
//             const res = await fetch(`http://localhost:3000/products/${id}`);
//             if (!res.ok) throw new Error(`Không thể lấy sản phẩm có id=${id}`);
//             const data = await res.json();
            
//             const product = new Product(
//                 data.id,
//                 data.name,
//                 data.slug,
//                 data.brand_id,
//                 data.price,
//                 data.description,
//                 data.category_id,
//                 data.image,
//                 data.rating,
//                 data.hot,
//                 data.authentic,
//                 data.warranty,
//                 data.specs_id,
//                 data.updatedAt
//             );
            
//             await product.loadRelatedData();
//             return product;
//         } catch (err) {
//             console.error('Lỗi khi lấy sản phẩm:', err);
//             return null;
//         }
//     }

//     static async getBySlug(slug) {
//         try {
//             const res = await fetch(`http://localhost:3000/products?slug=${slug}`);
//             if (!res.ok) throw new Error(`Không thể lấy sản phẩm có slug=${slug}`);
//             const data = await res.json();
            
//             if (data.length === 0) return null;
            
//             const productData = data[0];
//             const product = new Product(
//                 productData.id,
//                 productData.name,
//                 productData.slug,
//                 productData.brand_id,
//                 productData.price,
//                 productData.description,
//                 productData.category_id,
//                 productData.image,
//                 productData.rating,
//                 productData.hot,
//                 productData.authentic,
//                 productData.warranty,
//                 productData.specs_id,
//                 productData.updatedAt
//             );
            
//             await product.loadRelatedData();
//             return product;
//         } catch (err) {
//             console.error('Lỗi khi lấy sản phẩm theo slug:', err);
//             return null;
//         }
//     }

//     static async getAll() {
//         try {
//             const res = await fetch('http://localhost:3000/products');
//             if (!res.ok) throw new Error('Không thể lấy danh sách sản phẩm');
//             const data = await res.json();
            
//             const products = [];
//             for (const item of data) {
//                 const product = new Product(
//                     item.id,
//                     item.name,
//                     item.slug,
//                     item.brand_id,
//                     item.price,
//                     item.description,
//                     item.category_id,
//                     item.image,
//                     item.rating,
//                     item.hot,
//                     item.authentic,
//                     item.warranty,
//                     item.specs_id,
//                     item.updatedAt
//                 );
                
//                 await product.loadRelatedData();
//                 products.push(product);
//             }
            
//             return products;
//         } catch (err) {
//             console.error('Lỗi khi lấy danh sách sản phẩm:', err);
//             return [];
//         }
//     }

//     static async getHotProducts(limit = 4) {
//         try {
//             const res = await fetch('http://localhost:3000/products?hot=true');
//             if (!res.ok) throw new Error('Không thể lấy danh sách sản phẩm hot');
//             const data = await res.json();
            
//             const products = [];
//             for (const item of data.slice(0, limit)) {
//                 const product = new Product(
//                     item.id,
//                     item.name,
//                     item.slug,
//                     item.brand_id,
//                     item.price,
//                     item.description,
//                     item.category_id,
//                     item.image,
//                     item.rating,
//                     item.hot,
//                     item.authentic,
//                     item.warranty,
//                     item.specs_id,
//                     item.updatedAt
//                 );
                
//                 await product.loadRelatedData();
//                 products.push(product);
//             }
            
//             return products;
//         } catch (err) {
//             console.error('Lỗi khi lấy danh sách sản phẩm hot:', err);
//             return [];
//         }
//     }

//     static async getByCategory(categoryId, limit = 4) {
//         try {
//             const res = await fetch(`http://localhost:3000/products?category_id=${categoryId}`);
//             if (!res.ok) throw new Error(`Không thể lấy danh sách sản phẩm theo danh mục id=${categoryId}`);
//             const data = await res.json();
            
//             const products = [];
//             for (const item of data.slice(0, limit)) {
//                 const product = new Product(
//                     item.id,
//                     item.name,
//                     item.slug,
//                     item.brand_id,
//                     item.price,
//                     item.description,
//                     item.category_id,
//                     item.image,
//                     item.rating,
//                     item.hot,
//                     item.authentic,
//                     item.warranty,
//                     item.specs_id,
//                     item.updatedAt
//                 );
                
//                 await product.loadRelatedData();
//                 products.push(product);
//             }
            
//             return products;
//         } catch (err) {
//             console.error(`Lỗi khi lấy danh sách sản phẩm theo danh mục id=${categoryId}:`, err);
//             return [];
//         }
//     }
// }

// // Các hàm tiện ích
// function formatCurrency(price) {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
// }

// function getDay(dateString) {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
// }