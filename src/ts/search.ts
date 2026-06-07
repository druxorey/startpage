interface ShortcutItem {
	name: string;
	url: string;
}

let shortcutsList: ShortcutItem[] = [];
let currentFilteredSuggestions: ShortcutItem[] = [];
let activeSuggestionIndex: number = -1;

const SEARCH_PREFIXES: Record<string, string> = {
	's/': '',
	'r/': 'https://www.reddit.com/search/?q=',
	'g/': 'https://www.github.com/search/?q=',
	'y/': 'https://www.youtube.com/search/?q=',
	'i/': 'https://www.google.com/search?tbm=isch&q=',
	'a/': 'https://wiki.archlinux.org/index.php?search='
};

export function getSavedSearchEngine(): string {
	return localStorage.getItem('selectedSearchEngine') || 'https://google.com/search?q=';
}

export function initSearchEngine(): void {
	const selectElement = document.getElementById('search-engine-select') as HTMLSelectElement | null;
	const inputElement = document.getElementById('search-input') as HTMLInputElement | null;

	if (!inputElement) return;

	const updatePlaceholder = (engineUrl: string) => {
		let engineName = 'Google';
		if (engineUrl.includes('duckduckgo.com')) {
			engineName = 'DuckDuckGo';
		} else if (engineUrl.includes('search.brave.com')) {
			engineName = 'Brave Search';
		}
		inputElement.placeholder = `Search with ${engineName}`;
	};

	const savedEngine = getSavedSearchEngine();
	if (selectElement) {
		selectElement.value = savedEngine;
	}
	updatePlaceholder(savedEngine);

	if (selectElement) {
		selectElement.addEventListener('change', () => {
			localStorage.setItem('selectedSearchEngine', selectElement.value);
			updatePlaceholder(selectElement.value);
		});
	}
}

export function clearSearchInput(inputElement: HTMLInputElement): void {
	inputElement.value = '';
	inputElement.focus();
	updateSearchSuggestions('');
}

export async function loadShortcuts(): Promise<void> {
	const yamlUrl = 'https://raw.githubusercontent.com/druxorey/dotfiles/refs/heads/main/local/share/brave/bookmarks.yaml';
	try {
		const response = await fetch(yamlUrl);
		if (!response.ok) throw new Error('Failed to retrieve remote shortcuts yaml file');
		const yamlText = await response.text();

		const lines = yamlText.split('\n');
		shortcutsList = [];
		let currentName = '';

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) continue;

			if (trimmed.startsWith('- name:')) {
				currentName = trimmed.replace('- name:', '').trim();
			} else if (trimmed.startsWith('url:')) {
				const currentUrl = trimmed.replace('url:', '').trim();
				if (currentName && currentUrl) {
					shortcutsList.push({ name: currentName, url: currentUrl });
				}
			}
		}
	} catch (error) {
		console.error('Error processing shortcuts configuration:', error);
		shortcutsList = [];
	}
}

export function updateSearchSuggestions(inputVal: string): void {
	const query = inputVal.toLowerCase().trim();
	const ghostElement = document.getElementById('search-ghost');
	const suggestionsElement = document.getElementById('search-suggestions');

	if (!ghostElement || !suggestionsElement) return;

	const hasPrefix = Object.keys(SEARCH_PREFIXES).some(prefix => inputVal.toLowerCase().startsWith(prefix));

	if (!query || hasPrefix) {
		ghostElement.textContent = '';
		suggestionsElement.style.display = 'none';
		currentFilteredSuggestions = [];
		activeSuggestionIndex = -1;
		return;
	}

	currentFilteredSuggestions = shortcutsList
		.filter(item => item.name.toLowerCase().includes(query))
		.slice(0, 5);

	if (currentFilteredSuggestions.length > 0) {
		suggestionsElement.style.display = 'block';
		suggestionsElement.innerHTML = '';

		currentFilteredSuggestions.forEach((item, index) => {
			const div = document.createElement('div');
			div.className = 'suggestion-item';
			if (index === activeSuggestionIndex) div.classList.add('active');

			const cleanerUrl = item.url.replace(/^https?:\/\/(www\.)?/, '');
			div.innerHTML = `<span>${item.name}</span><span class="suggestion-url">${cleanerUrl}</span>`;

			div.addEventListener('click', () => {
				window.location.href = item.url;
			});
			suggestionsElement.appendChild(div);
		});

		const topMatchName = currentFilteredSuggestions[0].name;
		if (topMatchName.toLowerCase().startsWith(query)) {
			const missingPart = topMatchName.substring(query.length);
			ghostElement.innerHTML = `${inputVal}<span>${missingPart}</span>`;
		} else {
			ghostElement.textContent = '';
		}
	} else {
		suggestionsElement.style.display = 'none';
		ghostElement.textContent = '';
		activeSuggestionIndex = -1;
	}
}

export function handleSearchKeyDown(event: KeyboardEvent, inputElement: HTMLInputElement): boolean {
	if (currentFilteredSuggestions.length === 0) return false;

	if (event.key === 'ArrowDown') {
		event.preventDefault();
		activeSuggestionIndex = (activeSuggestionIndex + 1) % currentFilteredSuggestions.length;
		updateSearchSuggestions(inputElement.value);
		return true;
	}

	if (event.key === 'ArrowUp') {
		event.preventDefault();
		activeSuggestionIndex = (activeSuggestionIndex - 1 + currentFilteredSuggestions.length) % currentFilteredSuggestions.length;
		updateSearchSuggestions(inputElement.value);
		return true;
	}

	return false;
}

export function handleSearch(query: string): void {
	const trimmedQuery = query.trim();
	if (!trimmedQuery) return;

	const lowerQuery = trimmedQuery.toLowerCase();

	const matchedPrefix = Object.keys(SEARCH_PREFIXES).find(p => lowerQuery.startsWith(p));
	if (matchedPrefix) {
		const searchQuery = trimmedQuery.substring(matchedPrefix.length);
		if (matchedPrefix === 's/') {
			window.location.href = `${getSavedSearchEngine()}${encodeURIComponent(searchQuery)}`;
		} else {
			window.location.href = `${SEARCH_PREFIXES[matchedPrefix]}${encodeURIComponent(searchQuery)}`;
		}
		return;
	}

	if (activeSuggestionIndex >= 0 && activeSuggestionIndex < currentFilteredSuggestions.length) {
		window.location.href = currentFilteredSuggestions[activeSuggestionIndex].url;
		return;
	}

	if (currentFilteredSuggestions.length > 0) {
		window.location.href = currentFilteredSuggestions[0].url;
		return;
	}

	window.location.href = `${getSavedSearchEngine()}${encodeURIComponent(trimmedQuery)}`;
}

document.addEventListener('click', (event: MouseEvent) => {
	const searchWrapper = document.querySelector('.search-wrapper');
	const suggestionsElement = document.getElementById('search-suggestions');
	
	if (searchWrapper && suggestionsElement && !searchWrapper.contains(event.target as Node)) {
		suggestionsElement.style.display = 'none';
		activeSuggestionIndex = -1;
	}
});
