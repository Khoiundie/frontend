export class Spec {
    constructor(id, screen, camera, battery, processor, ram, storage, os) {
        this.id = id;
        this.screen = screen;
        this.camera = camera;
        this.battery = battery;
        this.processor = processor;
        this.ram = ram;
        this.storage = storage;
        this.os = os;
    }

    static async getById(id) {
        try {
            const res = await fetch(`http://localhost:3000/specs/${id}`);
            if (!res.ok) throw new Error(`Không thể lấy thông số kỹ thuật có id=${id}`);
            const data = await res.json();
            return new Spec(
                data.id, 
                data.screen, 
                data.camera, 
                data.battery, 
                data.processor, 
                data.ram, 
                data.storage, 
                data.os
            );
        } catch (err) {
            console.error('Lỗi khi lấy thông số kỹ thuật:', err);
            return null;
        }
    }
}