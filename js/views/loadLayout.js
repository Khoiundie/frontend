// todo: Load layout
export async function loadLayout(tagetel, filePath) {
	try {
		const layout = await fetch(`./layout/${filePath}.html`);
		if (!layout.ok) throw new Error(`Không tìm thấy file: ${layout.url}`)
		const html = await layout.text();

		// ** Check xem tagetel có tồn tại không
		if (document.querySelector(tagetel)) {
			document.querySelector(tagetel).innerHTML = html;
		} else {
			console.log('Không tìm thấy tagetel')
		}

	} catch (err) {
		// ** Check xem tagetel có tồn tại không
		if (document.querySelector(tagetel)) {
			// ** sau đó mới thêm message vào
			document.querySelector(tagetel).innerHTML = `<p style="color:red;">${err.message}</p>`;
		} else {
			console.log('Không tìm thấy tagetel')
		}
	}
}
export async function loadMainLayout(tagetel, filePath) {
	try {
		const layout = await fetch(`./pages/${filePath}.html`);
		if (!layout.ok) throw new Error(`Không tìm thấy file: ${layout.url}`)
		const html = await layout.text();

		// ** Check xem tagetel có tồn tại không
		if (document.querySelector(tagetel)) {
			document.querySelector(tagetel).innerHTML = html;
		} else {
			console.log('Không tìm thấy tagetel')
		}

	} catch (err) {
		// ** Check xem tagetel có tồn tại không
		if (document.querySelector(tagetel)) {
			// ** sau đó mới thêm message vào
			document.querySelector(tagetel).innerHTML = `<p style="color:red;">${err.message}</p>`;
		} else {
			console.log('Không tìm thấy tagetel')
		}
	}
}

const header = document.getElementById('header');
const footer = document.getElementById('footer');
loadLayout('#header', 'header');
loadLayout('#footer', 'footer');