import { initThemes } from './themes';
import { initSettings } from './settings';
import { loadShortcuts, highlightMatchingLinks, handleSearch, clearSearchInput } from './search';

function updateClockDisplay(): void {
	const dateTimeDisplay = document.getElementById('datetime-display');
	if (!dateTimeDisplay) return;

	const now = new Date();
	
	const weekday = now.toLocaleString('en-US', { weekday: 'long' });
	const day = now.toLocaleString('en-US', { day: '2-digit' });
	const month = now.toLocaleString('en-US', { month: '2-digit' });
	const year = now.toLocaleString('en-US', { year: 'numeric' });
	
	const timeString = now.toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});

	dateTimeDisplay.textContent = `${weekday}, ${timeString} | ${day}/${month}/${year}`;
}

document.addEventListener('DOMContentLoaded', async () => {
	initThemes();
	initSettings();
	await loadShortcuts();

	updateClockDisplay();
	setInterval(updateClockDisplay, 1000);

	const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
	const modal = document.getElementById('settings-modal') as HTMLDialogElement | null;

	if (!searchInput) return;

	searchInput.addEventListener('input', () => {
		highlightMatchingLinks(searchInput.value);
	});

	document.addEventListener('keydown', (event: KeyboardEvent) => {
		if (document.activeElement?.tagName === 'SELECT') return;

		if (event.key === 'Escape' && modal?.open) {
			modal.close();
		} else if (event.key === ' ' && document.activeElement !== searchInput) {
			event.preventDefault();
			searchInput.focus();
		} else if (event.key === 'Enter' && document.activeElement === searchInput) {
			event.preventDefault();
			handleSearch(searchInput.value);
		} else if (event.key === 'c' && event.ctrlKey) {
			event.preventDefault();
			clearSearchInput(searchInput);
		}
	});
});
