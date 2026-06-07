export async function checkLocalServices(): Promise<void> {
	const serviceLinks = document.querySelectorAll<HTMLAnchorElement>('.homelab-service-link[data-url]');
	
	serviceLinks.forEach(async (link) => {
		const url = link.getAttribute('data-url');
		if (!url) return;

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 2000);

			await fetch(url, { mode: 'no-cors', signal: controller.signal });
			
			clearTimeout(timeoutId);
			link.classList.remove('offline');
			link.classList.add('online');
		} catch (error) {
			link.classList.remove('online');
			link.classList.add('offline');
		}
	});
}
