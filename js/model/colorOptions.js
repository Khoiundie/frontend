// export class Color {
//     constructor(id, product_id, color_name, color_code) {
//         this.id = id;
//         this.product_id = product_id;
//         this.color_name = color_name;
//         this.color_code = color_code;
//     }

//     static async getByProductId(productId) {
//         try {
//             const res = await fetch(`http://localhost:3000/colors?product_id=${productId}`);
//             if (!res.ok) throw new Error(`Không thể lấy màu sắc cho sản phẩm có id=${productId}`);
//             const data = await res.json();
//             return data.map(item => new Color(item.id, item.product_id, item.color_name, item.color_code));
//         } catch (err) {
//             console.error('Lỗi khi lấy màu sắc sản phẩm:', err);
//             return [];
//         }
//     }
// }
