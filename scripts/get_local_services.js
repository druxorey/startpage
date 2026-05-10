async function checkServices() {
	const items = document.querySelectorAll('#homelab-list li[data-url]');
	
	items.forEach(async (item) => {
		const url = item.getAttribute('data-url');
		const statusSpan = item.querySelector('.status');
		
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 2000);

			await fetch(url, { mode: 'no-cors', signal: controller.signal });
			
			clearTimeout(timeoutId);
			statusSpan.textContent = "●";
			statusSpan.style.color = "#50FA7B";
		} catch (e) {
			statusSpan.textContent = "○";
			statusSpan.style.color = "#FF5555";
		}
	});
}

document.addEventListener('DOMContentLoaded', checkServices);
