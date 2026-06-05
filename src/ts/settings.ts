import { getThemeSettings, saveThemeSettings, ThemeSettings } from './themes';
import { getSavedSearchEngine } from './search';

export function initSettings(): void {
	const modal = document.getElementById('settings-modal') as HTMLDialogElement | null;
	const toggleBtn = document.getElementById('settings-toggle');
	const closeBtn = document.getElementById('settings-close');
	const lightSelect = document.getElementById('light-theme-select') as HTMLSelectElement | null;
	const darkSelect = document.getElementById('dark-theme-select') as HTMLSelectElement | null;
	const engineSelect = document.getElementById('search-engine-select') as HTMLSelectElement | null;

	if (!modal || !toggleBtn || !closeBtn || !lightSelect || !darkSelect || !engineSelect) return;

	const currentPreferences = getThemeSettings();

	lightSelect.value = currentPreferences.preferredLight;
	darkSelect.value = currentPreferences.preferredDark;
	engineSelect.value = getSavedSearchEngine();

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

	const syncPreferences = () => {
		const updatedSettings: ThemeSettings = {
			preferredLight: lightSelect.value,
			preferredDark: darkSelect.value
		};
		saveThemeSettings(updatedSettings);
	};

	lightSelect.addEventListener('change', syncPreferences);
	darkSelect.addEventListener('change', syncPreferences);
	
	engineSelect.addEventListener('change', () => {
		localStorage.setItem('selectedSearchEngine', engineSelect.value);
	});
}
