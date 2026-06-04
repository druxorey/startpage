export interface ThemeSettings {
	preferredLight: string;
	preferredDark: string;
}

const STORAGE_KEY = 'startpage_theme_preferences';

const defaultSettings: ThemeSettings = {
	preferredLight: 'latte',
	preferredDark: 'dracula-dark'
};

export function getThemeSettings(): ThemeSettings {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (!saved) return defaultSettings;
	try {
		return JSON.parse(saved) as ThemeSettings;
	} catch {
		return defaultSettings;
	}
}

export function saveThemeSettings(settings: ThemeSettings): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	applyCurrentTheme();
}

export function applyCurrentTheme(): void {
	const settings = getThemeSettings();
	const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const themeToApply = systemPrefersDark ? settings.preferredDark : settings.preferredLight;
	document.documentElement.setAttribute('data-theme', themeToApply);
}

export function initThemes(): void {
	applyCurrentTheme();
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		applyCurrentTheme();
	});
}
