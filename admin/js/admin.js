const API_URL = 'http://localhost:3000';
let currentProductId = null;
let currentOrderId = null;
let currentPage = 1;
let itemsPerPage = 10;
let products = [];
let orders = [];
let categories = [];
let brands = [];
let currentTab = 'dashboard';
let user_name_header = "" 
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadDashboardData();
    initEvents();
});

//todo: innit các tab
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            currentTab = tabId; // Lưu tab hiện tại
            
            navItems.forEach(navItem => navItem.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            if (tabId === 'products' && products.length === 0) {
                loadProducts();
                loadCategories();
                loadBrands();
            } else if (tabId === 'orders' && orders.length === 0) {
                loadOrders();
            }
        });
    });
    document.querySelectorAll('.view-all').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            document.querySelector(`.nav-item[data-tab="${tabId}"]`).click();
        });
    });
}

//todo: Khởi tạo các sự kiện
function initEvents() {
    //Todo: Add tên user vào header 
    user_name_header = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('user_name').innerHTML = user_name_header.name

    //Todo: Sự kiện cho nút thêm sản phẩm
    document.getElementById('add-product-btn').addEventListener('click', () => {
        showProductPopup();
    });
    
    //Todo: Sự kiện đóng popup sản phẩm
    document.getElementById('close-product-popup').addEventListener('click', () => {
        hideProductPopup();
    });
    
    //Todo: Sự kiện hủy thêm/sửa sản phẩm
    document.getElementById('cancel-product').addEventListener('click', () => {
        hideProductPopup();
    });
    
    //Todo: Sự kiện submit form sản phẩm
    document.getElementById('product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });

    //Todo: upload
    const uploadEl = document.getElementById('product-upload');
    if (uploadEl) {
        uploadEl.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const imageInput = document.getElementById('product-image');
                if (imageInput) imageInput.value = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }
    
    //Todo: Sự kiện đóng popup đơn hàng
    document.getElementById('close-order-popup').addEventListener('click', () => {
        hideOrderPopup();
    });
    
    //Todo: Sự kiện đóng chi tiết đơn hàng
    document.getElementById('close-order-detail').addEventListener('click', () => {
        hideOrderPopup();
    });
    
    //Todo: Sự kiện cập nhật trạng thái đơn hàng
    document.getElementById('update-order-status').addEventListener('click', (e) => {
        e.preventDefault();
        updateOrderStatus();
    });
    
    //Todo: Sự kiện lưu ghi chú đơn hàng
    document.getElementById('save-order-notes').addEventListener('click', () => {
        saveOrderNotes();
    });
    
    //Todo: Sự kiện đóng popup xác nhận xóa
    document.getElementById('close-confirm-popup').addEventListener('click', () => {
        hideConfirmPopup();
    });
    
    //Todo: Sự kiện hủy xóa
    document.getElementById('cancel-delete').addEventListener('click', () => {
        hideConfirmPopup();
    });
    
    //Todo: Sự kiện xác nhận xóa
    document.getElementById('confirm-delete').addEventListener('click', () => {
        if (currentProductId) {
            deleteProduct(currentProductId);
        }
        hideConfirmPopup();
    });
    
    //Todo: Sự kiện đóng alert
    document.querySelector('.alert-close').addEventListener('click', () => {
        hideAlert();
    });
    
    //Todo: Sự kiện tìm kiếm sản phẩm
    document.getElementById('product-search-btn').addEventListener('click', () => {
        searchProducts();
    });
    
    //Todo: Sự kiện tìm kiếm đơn hàng
    document.getElementById('order-search-btn').addEventListener('click', () => {
        searchOrders();
    });
    
    //Todo: Sự kiện lọc theo danh mục
    document.getElementById('category-filter').addEventListener('change', () => {
        filterProducts();
    });
    
    //Todo: Sự kiện lọc theo trạng thái đơn hàng
    document.getElementById('status-filter').addEventListener('change', () => {
        filterOrders();
    });
    
    //Todo: Sự kiện sắp xếp sản phẩm
    document.getElementById('sort-filter').addEventListener('change', () => {
        sortProducts();
    });
    
    //Todo: Sự kiện lọc theo ngày
    document.getElementById('date-from').addEventListener('change', () => {
        filterOrdersByDate();
    });
    
    document.getElementById('date-to').addEventListener('change', () => {
        filterOrdersByDate();
    });
}

//Todo: Tải dữ liệu cho Dashboard
async function loadDashboardData() {
    try {
        console.log("Đang tải dữ liệu...");
        const productsResponse = await fetch(`${API_URL}/products`);
        console.log("productsResponse:", productsResponse);
        if (!productsResponse.ok) throw new Error(`Lỗi tải products: ${productsResponse.status}`);
        const productsData = await productsResponse.json();
        const ordersResponse = await fetch(`${API_URL}/orders`);
        if (!ordersResponse.ok) throw new Error(`Lỗi tải orders: ${ordersResponse.status}`);
        const ordersData = await ordersResponse.json();
        const usersResponse = await fetch(`${API_URL}/users`);
        if (!usersResponse.ok) throw new Error(`Lỗi tải users: ${usersResponse.status}`);
        const usersData = await usersResponse.json();
        console.log("Dữ liệu nhận được:", { productsData, ordersData, usersData });
        document.getElementById('product-count').textContent = productsData.length;
        document.getElementById('order-count').textContent = ordersData.length;
        document.getElementById('user-count').textContent = usersData.length;
        const totalRevenue = ordersData.reduce((total, order) => {
            if (order.status === 'completed') {
                return total + order.total;
            }
            return total;
        }, 0);
        document.getElementById('revenue').textContent = formatCurrency(totalRevenue);
        const recentOrders = ordersData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        renderRecentOrders(recentOrders);
        const recentProducts = productsData
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);
        renderRecentProducts(recentProducts);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu dashboard:', error);
        showAlert(error.message, 'danger');
    }
}


//Todo: Hiển thị đơn hàng gần đây
function renderRecentOrders(orders) {
    const tableBody = document.getElementById('recent-orders-table');
    tableBody.innerHTML = '';
    
    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Không có đơn hàng nào</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerInfo.name}</td>
            <td>${formatDate(order.createdAt)}</td>
            <td><span class="status-badge status-${getStatusText(order.status)}">${order.status}</span></td>
            <td>${formatCurrency(order.total)}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

//Todo: Hiển thị sản phẩm gần đây
async function renderRecentProducts(products) {
    const tableBody = document.getElementById('recent-products-table');
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Không có sản phẩm nào</td></tr>';
        return;
    }
    const categoriesResponse = await fetch(`${API_URL}/categories`);
    const categoriesData = await categoriesResponse.json();
    
    products.forEach(product => {
        const row = document.createElement('tr');
        const category = categoriesData.find(cat => cat.id == product.category);
        const imgSrc = getProductImageSrc(product.image);
        row.innerHTML = `
            <td><img src="${imgSrc}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${category ? category.name : 'Không có'}</td>
            <td>${formatCurrency(product.price)}</td>
            <td><span class="status-badge status-${product.stock > 0 ? 'instock' : 'outofstock'}">${product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

//Todo: Tải danh sách sản phẩm
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        products = await response.json();
        
        renderProducts(products);
    } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
        showAlert('Lỗi khi tải danh sách sản phẩm', 'danger');
    }
}

//Todo: Tải danh sách danh mục
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        categories = await response.json();
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        const productCategory = document.getElementById('product-category');
        productCategory.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            productCategory.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách danh mục:', error);
        showAlert('Lỗi khi tải danh sách danh mục', 'danger');
    }
}

//Todo: Tải danh sách thương hiệu
async function loadBrands() {
    try {
        const response = await fetch(`${API_URL}/brands`);
        brands = await response.json();
        const productBrand = document.getElementById('product-brand');
        productBrand.innerHTML = '';
        
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.textContent = brand.name;
            productBrand.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
        showAlert('Lỗi khi tải danh sách thương hiệu', 'danger');
    }
}

//Todo: Hiển thị danh sách sản phẩm
async function renderProducts(products) {
    const tableBody = document.getElementById('products-table');
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Không có sản phẩm nào</td></tr>';
        return;
    }
    // Phân trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    if (categories.length === 0) {
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        categories = await categoriesResponse.json();
    }
    
    if (brands.length === 0) {
        const brandsResponse = await fetch(`${API_URL}/brands`);
        brands = await brandsResponse.json();
    }
    
    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        const category = categories.find(cat => cat.id == product.category);
        // console.log(brands)
        const brand = brands.find(b => b.id == product.brand);
        // console.log(brand)
        const imgSrc = getProductImageSrc(product.image);
        row.innerHTML = `
            <td>#${product.id}</td>
            <td><img src="${imgSrc}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${category ? category.name : 'Không có'}</td>
            <td>${brand? brand .name : "Khoong cos"}</td>
            <td>${formatCurrency(product.price)}</td>
            <td><span class="status-badge status-${product.stock > 0 ? (product.stock < 10 ? 'lowstock' : 'instock') : 'outofstock'}">
                ${product.stock > 0 ? (product.stock < 10 ? 'Sắp hết' : 'Còn hàng') : 'Hết hàng'}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="view-btn" onclick="viewProduct('${product.slug}')"><i class="fas fa-eye"></i></button>
                    <button class="delete-btn" onclick="confirmDeleteProduct(${product.id}, '${product.name}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Cập nhật phân trang
    renderPagination(products.length, 'products-pagination');
}

//Todo: Tải danh sách đơn hàng
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        orders = await response.json();
        
        renderOrders(orders);
    } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng:', error);
        showAlert('Lỗi khi tải danh sách đơn hàng', 'danger');
    }
}

//Todo: Hiển thị danh sách đơn hàng
function renderOrders(orders) {
    const tableBody = document.getElementById('orders-table');
    tableBody.innerHTML = '';
    
    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có đơn hàng nào</td></tr>';
        return;
    }
    
    // Phân trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    paginatedOrders.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerInfo.name}</td>
            <td>${formatDate(order.createdAt)}</td>
            <td>${order.items.length} sản phẩm</td>
            <td>${formatCurrency(order.total)}</td>
            <td><span class="status-badge status-${getStatusText(order.status)}">${order.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewOrder(${order.id})"><i class="fas fa-eye"></i></button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    renderPagination(orders.length, 'orders-pagination');
}

//Todo: Hiển thị phân trang
function renderPagination(totalItems, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        return;
    }
    const prevBtn = document.createElement('div');
    prevBtn.classList.add('pagination-item');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            if (containerId === 'products-pagination') {
                renderProducts(products);
            } else {
                renderOrders(orders);
            }
        }
    });
    container.appendChild(prevBtn);
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('div');
        pageBtn.classList.add('pagination-item');
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            if (containerId === 'products-pagination') {
                renderProducts(products);
            } else {
                renderOrders(orders);
            }
        });
        container.appendChild(pageBtn);
    }
    const nextBtn = document.createElement('div');
    nextBtn.classList.add('pagination-item');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            if (containerId === 'products-pagination') {
                renderProducts(products);
            } else {
                renderOrders(orders);
            }
        }
    });
    container.appendChild(nextBtn);
}

//Todo: Hiển thị popup thêm/sửa sản phẩm
async function showProductPopup(productId = null) {
    const popup = document.getElementById('product-popup');
    const popupTitle = document.getElementById('popup-title');
    const form = document.getElementById('product-form');
    form.reset();
    if (productId) {
        // Chế độ sửa sản phẩm
        popupTitle.textContent = 'Chỉnh sửa sản phẩm';
        currentProductId = productId;
        
        try {
            const response = await fetch(`${API_URL}/products/${productId}`);
            const product = await response.json();
            let specs = null;
            if (product.specs_id) {
                const specsResponse = await fetch(`${API_URL}/product_specs/${parseInt(product.specs_id)}`);
                specs = await specsResponse.json();
            }
            console.log(product.specs_id)

            
            //?  Add info sản phẩm vào form
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-brand').value = product.brand;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-image').value = product.image;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-hot').checked = product.hot;
            document.getElementById('product-discount').value = (product.discount ?? '').toString();
            document.getElementById('product-stock').value = (product.stock ?? '').toString();
            document.getElementById('product-rating').value = (product.rating ?? '').toString();
            document.getElementById('product-reviews').value = (product.reviews ?? '').toString();
            document.getElementById('product-warranty').value = product.warranty || '';
            document.getElementById('product-tags').value = Array.isArray(product.tags) ? product.tags.join(', ') : '';
            document.getElementById('product-colors').value = Array.isArray(product.colorOptions) ? product.colorOptions.join(', ') : '';
            document.getElementById('product-variants').value = Array.isArray(product.variants) ? JSON.stringify(product.variants, null, 2) : '';
            const authenticTextInput = document.getElementById('product-authentic-text');
            if (authenticTextInput) {
                authenticTextInput.value = typeof product.authentic === 'string' ? product.authentic : (product.authentic ? 'chính hãng' : 'xách tay');
            }
            document.getElementById('product-authentic').checked = typeof product.authentic === 'boolean' ? product.authentic : (product.authentic === 'chính hãng');
            console.log(specs)
            if (specs) {
                document.getElementById('product-screen').value = specs.screen || '';
                document.getElementById('product-camera').value = specs.camera || '';
                document.getElementById('product-processor').value = specs.cpu || '';
                document.getElementById('product-ram').value = specs.ram || '';
                document.getElementById('product-storage').value = specs.storage || '';
                document.getElementById('product-battery').value = specs.battery || '';
            }
        } catch (error) {
            console.error('Lỗi khi tải thông tin sản phẩm:', error);
            showAlert('Lỗi khi tải thông tin sản phẩm', 'danger');
            return;
        }
    } else {
        popupTitle.textContent = 'Thêm sản phẩm mới';
        currentProductId = null;
        document.getElementById('product-id').value = '';
    }
    
    popup.style.display = 'flex';
}

//Todo: Ẩn popup thêm/sửa sản phẩm
function hideProductPopup() {
    const popup = document.getElementById('product-popup');
    popup.style.display = 'none';
}

//Todo: Lưu sản phẩm
async function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const isEdit = productId !== '';
    const productData = {
        name: document.getElementById('product-name').value,
        category: parseInt(document.getElementById('product-category').value),
        brand: parseInt(document.getElementById('product-brand').value),
        price: parseFloat(document.getElementById('product-price').value),
        discount: parseFloat(document.getElementById('product-discount').value) || 0,
        stock: parseInt(document.getElementById('product-stock').value) || 100,
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value,
        tags: (document.getElementById('product-tags').value.trim() ? document.getElementById('product-tags').value.trim().split(',').map(s => s.trim()).filter(Boolean) : []),
        hot: document.getElementById('product-hot').checked,
        rating: parseFloat(document.getElementById('product-rating').value) || 0,
        reviews: parseInt(document.getElementById('product-reviews').value) || 0,
        colorOptions: (document.getElementById('product-colors').value.trim() ? document.getElementById('product-colors').value.trim().split(',').map(s => s.trim()).filter(Boolean) : []),
        warranty: document.getElementById('product-warranty').value || '',
        authentic: (() => {
            const txtEl = document.getElementById('product-authentic-text');
            const txt = txtEl ? txtEl.value.trim() : '';
            return txt || (document.getElementById('product-authentic').checked ? 'chính hãng' : 'xách tay');
        })(),
        updatedAt: new Date().toISOString()
    };
    const variantsRaw = document.getElementById('product-variants').value.trim();
    if (variantsRaw) {
        try {
            productData.variants = JSON.parse(variantsRaw);
        } catch (e) {
            showAlert('Dữ liệu biến thể không hợp lệ, hãy nhập JSON hợp lệ', 'danger');
            return false;
        }
    } else {
        productData.variants = [];
    }
    
    const specsData = {
        screen: document.getElementById('product-screen').value,
        camera: document.getElementById('product-camera').value,
        cpu: document.getElementById('product-processor').value,
        ram: document.getElementById('product-ram').value,
        storage: document.getElementById('product-storage').value,
        battery: document.getElementById('product-battery').value
    };
    
    try {
        let specsId;
        
        if (isEdit) {
            const productResponse = await fetch(`${API_URL}/products/${productId}`);
            const existingProduct = await productResponse.json();
            specsId = existingProduct.specs_id;
            
            if (specsId) {
                await fetch(`${API_URL}/product_specs/${specsId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(specsData)
                });
            } else {
                const specsListResponse = await fetch(`${API_URL}/product_specs`);
                const specsList = await specsListResponse.json();
                let maxSpecsId = 0;
                specsList.forEach(spec => {
                    const specIdNum = parseInt(spec.id);
                    if (!isNaN(specIdNum) && specIdNum > maxSpecsId) {
                        maxSpecsId = specIdNum;
                    }
                });
                const newSpecsId = (maxSpecsId + 1).toString();
                    specsData.id = newSpecsId;
                    await fetch(`${API_URL}/product_specs`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(specsData)
                    });
                    specsId = newSpecsId;
            }
        } else {           
            const specsListResponse = await fetch(`${API_URL}/product_specs`);
            const specsList = await specsListResponse.json();
            let maxSpecsId = 0;
            specsList.forEach(spec => {
                const specIdNum = parseInt(spec.id);
                if (!isNaN(specIdNum) && specIdNum > maxSpecsId) {
                    maxSpecsId = specIdNum;
                }
            });
            const newSpecsId = (maxSpecsId + 1).toString();
            specsData.id = newSpecsId;
            await fetch(`${API_URL}/product_specs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(specsData)
            });
            specsId = newSpecsId;
        }
        productData.specs_id = specsId;
        
        if (isEdit) {
            productData.slug = slugify(productData.name);
            await fetch(`${API_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            })
            showAlert('Cập nhật sản phẩm thành công', 'success');
        } else {
            productData.slug = slugify(productData.name);
            productData.createdAt = new Date().toISOString();
            const productsResponse = await fetch(`${API_URL}/products`);
            const products = await productsResponse.json();
            let maxId = 0;
            products.forEach(product => {
                const productIdNum = parseInt(product.id);
                if (!isNaN(productIdNum) && productIdNum > maxId) {
                    maxId = productIdNum;
                }
            });
            productData.id = (maxId + 1).toString();        
            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            
            showAlert('Thêm sản phẩm thành công', 'success');
        }
        hideProductPopup();
        await loadProducts();
        document.querySelector(`.nav-item[data-tab="products"]`).click();
        
        return false;
    } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error);
        showAlert('Lỗi khi lưu sản phẩm', 'danger');
        return false;
    }
}

function editProduct(productId) {
    showProductPopup(productId);
}
function viewProduct(productSlug) {
    window.open(`/#/product/${productSlug}`, '_blank');
}
function getProductImageSrc(image) {
    if (!image) return '';
    if (typeof image === 'string' && (image.startsWith('data:') || image.match(/^https?:\/\//) || image.startsWith('/'))) {
        return image;
    }
    return `./../${image}`;
}
function confirmDeleteProduct(productId, productName) {
    currentProductId = productId;
    document.getElementById('delete-item-name').textContent = `sản phẩm "${productName}"`;
    
    const popup = document.getElementById('confirm-popup');
    popup.style.display = 'flex';
}
function hideConfirmPopup() {
    const popup = document.getElementById('confirm-popup');
    popup.style.display = 'none';
}
async function deleteProduct(productId) {
    try {
        const productResponse = await fetch(`${API_URL}/products/${productId}`);
        const product = await productResponse.json();
        await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        if (product.specs_id) {
            await fetch(`${API_URL}/product_specs/${product.specs_id}`, {
                method: 'DELETE'
            });
        }       
        showAlert('Xóa sản phẩm thành công', 'success');
        loadProducts();
        loadDashboardData();
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        showAlert('Lỗi khi xóa sản phẩm', 'danger');
    }
}

//Todo: Xem chi tiết đơn hàng
async function viewOrder(orderId) {
    currentOrderId = orderId;
    console.log(orderId)
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        if(!response) throw new Error("response is undefine");
        
        const order = await response.json();
        document.getElementById('order-detail-id').textContent = order.id;
        document.getElementById('order-customer-name').textContent = order.customerInfo.name;
        document.getElementById('order-customer-email').textContent = order.customerInfo.email;
        document.getElementById('order-customer-phone').textContent = order.customerInfo.phone;
        document.getElementById('order-customer-address').textContent = order.customerInfo.address;
        
        document.getElementById('order-status-select').value = order.status;
        document.getElementById('order-notes-text').value = order.notes || '';
        const tableBody = document.getElementById('order-items-table');
        tableBody.innerHTML = '';
        
        let totalAmount = 0;
        
        for (const item of order.items) {
            const productResponse = await fetch(`${API_URL}/products/${item.id}`);
            const product = await productResponse.json();
            
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center;">
                        <img src="./../${product.image}" alt="${product.name}" class="product-image" style="margin-right: 10px;">
                        <div>
                            <div>${product.name}</div>
                            <div style="font-size: 12px; color: var(--text-muted);">${item.variant || ''}</div>
                        </div>
                    </div>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(itemTotal)}</td>
            `;
            
            tableBody.appendChild(row);
        }
        
        document.getElementById('order-total').textContent = formatCurrency(totalAmount);
        const popup = document.getElementById('order-popup');
        popup.style.display = 'flex';
    } catch (error) {
        console.error('Lỗi khi tải thông tin đơn hàng:', error);
        showAlert('Lỗi khi tải thông tin đơn hàng', 'danger');
    }
}
function hideOrderPopup() {
    const popup = document.getElementById('order-popup');
    popup.style.display = 'none';
}

//Todo: Cập nhật trạng thái đơn hàng
async function updateOrderStatus() {
    const status = document.getElementById('order-status-select').value;
    
    try {
        const response = await fetch(`${API_URL}/orders/${currentOrderId}`);
        const order = await response.json();
        
        order.status = status;
        
        await fetch(`${API_URL}/orders/${currentOrderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        
        showAlert('Cập nhật trạng thái đơn hàng thành công', 'success');
        await loadOrders();
        document.querySelector(`.nav-item[data-tab="orders"]`).click();
        
        return false; 
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        showAlert('Lỗi khi cập nhật trạng thái đơn hàng', 'danger');
        return false;
    }
}

//Todo: Lưu ghi chú đơn hàng
async function saveOrderNotes() {
    const notes = document.getElementById('order-notes-text').value;
    
    try {
        const response = await fetch(`${API_URL}/orders/${currentOrderId}`);
        const order = await response.json();
        
        order.notes = notes;
        
        await fetch(`${API_URL}/orders/${currentOrderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        
        showAlert('Lưu ghi chú đơn hàng thành công', 'success');
    } catch (error) {
        console.error('Lỗi khi lưu ghi chú đơn hàng:', error);
        showAlert('Lỗi khi lưu ghi chú đơn hàng', 'danger');
    }
}

//Todo: Tìm kiếm sản phẩm
function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    
    if (searchTerm === '') {
        renderProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    renderProducts(filteredProducts);
}

//Todo: Tìm kiếm đơn hàng
function searchOrders() {
    const searchTerm = document.getElementById('order-search').value.toLowerCase();
    
    if (searchTerm === '') {
        renderOrders(orders);
        return;
    }
    
    const filteredOrders = orders.filter(order => 
        order.id.toString().includes(searchTerm) || 
        order.customerInfo.name.toLowerCase().includes(searchTerm) || 
        order.customerInfo.email.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    renderOrders(filteredOrders);
}

//Todo: Lọc sản phẩm theo danh mục
function filterProducts() {
    const categoryId = document.getElementById('category-filter').value;
    
    if (categoryId === '') {
        renderProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.category.toString() === categoryId
    );
    
    currentPage = 1;
    renderProducts(filteredProducts);
}

//Todo: Lọc đơn hàng theo trạng thái
function filterOrders() {
    const status = document.getElementById('status-filter').value;
    
    if (status === '') {
        renderOrders(orders);
        return;
    }
    
    const filteredOrders = orders.filter(order => 
        order.status === status
    );
    
    currentPage = 1;
    renderOrders(filteredOrders);
}

//Todo: Lọc đơn hàng theo ngày
function filterOrdersByDate() {
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    
    if (dateFrom === '' && dateTo === '') {
        renderOrders(orders);
        return;
    }
    
    let filteredOrders = [...orders];
    
    if (dateFrom !== '') {
        filteredOrders = filteredOrders.filter(order => 
            new Date(order.date) >= new Date(dateFrom)
        );
    }
    
    if (dateTo !== '') {
        filteredOrders = filteredOrders.filter(order => 
            new Date(order.date) <= new Date(dateTo)
        );
    }
    
    currentPage = 1;
    renderOrders(filteredOrders);
}

//Todo: Sắp xếp sản phẩm
function sortProducts() {
    const sortValue = document.getElementById('sort-filter').value;
    
    let sortedProducts = [...products];
    
    switch (sortValue) {
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'date-desc':
            sortedProducts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            break;
        case 'date-asc':
            sortedProducts.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
            break;
    }
    
    currentPage = 1;
    renderProducts(sortedProducts);
}

//Todo: Hiển thị thông báo
function showAlert(message, type) {
    const alert = document.getElementById('alert');
    const alertMessage = alert.querySelector('.alert-message');
    const alertIcon = alert.querySelector('.alert-icon');
    alert.className = 'alert';
    alert.classList.add(`alert-${type}`);
    alertMessage.textContent = message;
    
    switch (type) {
        case 'success':
            alertIcon.className = 'alert-icon fas fa-check-circle';
            break;
        case 'warning':
            alertIcon.className = 'alert-icon fas fa-exclamation-triangle';
            break;
        case 'danger':
            alertIcon.className = 'alert-icon fas fa-times-circle';
            break;
        case 'info':
            alertIcon.className = 'alert-icon fas fa-info-circle';
            break;
    }
    alert.classList.add('show');
    setTimeout(() => {
        hideAlert();
    }, 3000);
}

//Todo: Ẩn thông báo
function hideAlert() {
    const alert = document.getElementById('alert');
    alert.classList.remove('show');
}

//Todo: Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

//Todo: Định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

//Todo: Lấy text trạng thái
function getStatusText(status) {
    switch (status) {
        case 'Chờ xác nhận':
            return 'pending';
        case 'Đang xử lý':
            return 'processing';
        case 'Đang giao hàng':
            return 'shipping';
        case 'Hoàn thành':
            return 'completed';
        case 'Đã hủy':
            return 'cancelled';
        default:
            return status;
    }
}

function slugify(str, opts = {}) {
	const { separator = '-', lower = true } = opts;
	if (!str && str !== '') return '';

	// 1. chuẩn hoá Unicode -> tách dấu (NFD)
	let s = String(str).normalize('NFD');

	// 2. loại bỏ các ký tự dấu kết hợp (combining marks)
	s = s.replace(/[\u0300-\u036f]/g, '');

	// 3. chuyển ký tự đ Đ thành d
	s = s.replace(/đ/g, 'd').replace(/Đ/g, 'D');

	// 4. chuyển sang chữ thường nếu cần
	if (lower) s = s.toLowerCase();

	// 5. thay mọi ký tự không phải chữ/ số bằng separator
	const sepEsc = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape nếu separator đặc biệt
	const invalidChars = new RegExp(`[^\\p{L}\\p{Nd}]+`, 'gu'); // unicode letters & digits
	s = s.replace(invalidChars, separator);

	// 6. loại nhiều separator liên tiếp -> 1, và trim
	const multipleSep = new RegExp(`${sepEsc}{2,}`, 'g');
	s = s.replace(multipleSep, separator);
	s = s.replace(new RegExp(`^${sepEsc}|${sepEsc}$`, 'g'), '');

	return s;
}
