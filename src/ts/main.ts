import { initThemes } from './themes';
import { initSettings } from './settings';
import { initSearchEngine, loadShortcuts, updateSearchSuggestions, handleSearchKeyDown, handleSearch, clearSearchInput } from './search';

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

function initHelpModal(): void {
	const modal = document.getElementById('help-modal') as HTMLDialogElement | null;
	const toggleBtn = document.getElementById('help-toggle');
	const closeBtn = document.getElementById('help-close');

	if (!modal || !toggleBtn || !closeBtn) return;

	toggleBtn.addEventListener('click', () => modal.showModal());
	closeBtn.addEventListener('click', () => modal.close());

	modal.addEventListener('click', (event: MouseEvent) => {
		const rect = modal.getBoundingClientRect();
		const clickedInside = (
			rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX && event.clientX <= rect.left + rect.width
		);
		if (!clickedInside) {
			modal.close();
		}
	});
}

document.addEventListener('DOMContentLoaded', async () => {
	initThemes();
	initSettings();
	initSearchEngine();
	initHelpModal();
	await loadShortcuts();

	updateClockDisplay();
	setInterval(updateClockDisplay, 1000);

	const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
	const settingsModal = document.getElementById('settings-modal') as HTMLDialogElement | null;
	const helpModal = document.getElementById('help-modal') as HTMLDialogElement | null;

	if (!searchInput) return;

	searchInput.addEventListener('input', () => {
		updateSearchSuggestions(searchInput.value);
	});

	document.addEventListener('keydown', (event: KeyboardEvent) => {
		if (document.activeElement?.tagName === 'SELECT') return;

		if (document.activeElement === searchInput) {
			const handledByDropdown = handleSearchKeyDown(event, searchInput);
			if (handledByDropdown) return;
		}

		if (event.key === 'Escape') {
			if (settingsModal?.open) settingsModal.close();
			if (helpModal?.open) helpModal.close();
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
