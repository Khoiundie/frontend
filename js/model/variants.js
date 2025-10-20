// export class Variant {
//     constructor(id, product_id, name, price, stock) {
//         this.id = id;
//         this.product_id = product_id;
//         this.name = name;
//         this.price = price;
//         this.stock = stock;
//     }

//     static async getByProductId(productId) {
//         try {
//             const res = await fetch(`http://localhost:3000/variants?product_id=${productId}`);
//             if (!res.ok) throw new Error(`Không thể lấy biến thể cho sản phẩm có id=${productId}`);
//             const data = await res.json();
//             return data.map(item => new Variant(item.id, item.product_id, item.name, item.price, item.stock));
//         } catch (err) {
//             console.error('Lỗi khi lấy biến thể sản phẩm:', err);
//             return [];
//         }
//     }
// }
