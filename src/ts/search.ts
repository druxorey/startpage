interface ShortcutMap {
	[key: string]: string;
}

let shortcuts: ShortcutMap = {};
let currentMatch: string | null = null;

const SEARCH_PREFIXES: Record<string, string> = {
	's/': 'https://google.com/search?q=',
	'r/': 'https://www.reddit.com/search/?q=',
	'g/': 'https://www.github.com/search/?q=',
	'y/': 'https://www.youtube.com/search/?q=',
	'i/': 'https://www.google.com/search?tbm=isch&q=',
	'a/': 'https://wiki.archlinux.org/index.php?search='
};

export async function loadShortcuts(): Promise<void> {
	const yamlUrl = 'https://raw.githubusercontent.com/druxorey/dotfiles/refs/heads/main/config/brave/bookmarks.yaml';
	try {
		const response = await fetch(yamlUrl);
		if (!response.ok) throw new Error('Failed to retrieve remote shortcuts yaml file');
		const yamlText = await response.text();

		const shortcutsArray = yamlText
			.split('\n')
			.filter(line => line.trim() && !line.startsWith('#'))
			.reduce<{ name?: string; url?: string }[]>((acc, line) => {
				const match = line.match(/^\s*-\s*name:\s*(.+)|^\s*url:\s*(.+)/);
				if (match) {
					if (match[1]) acc.push({ name: match[1].trim() });
					if (match[2] && acc.length > 0) acc[acc.length - 1].url = match[2].trim();
				}
				return acc;
			}, []);

		shortcuts = shortcutsArray.reduce<ShortcutMap>((acc, item) => {
			if (item.name && item.url) {
				acc[item.name.toLowerCase()] = item.url;
			}
			return acc;
		}, {});
	} catch (error) {
		console.error('Error processing shortcuts configuration:', error);
		shortcuts = {};
	}
}

function findBestMatch(query: string): string | null {
	if (!query || Object.keys(shortcuts).length === 0) return null;
	const names = Object.keys(shortcuts);

	const startMatch = names.find(name => name.startsWith(query));
	if (startMatch) return startMatch;

	const wordMatch = names.find(name => name.split(' ').some(word => word.startsWith(query)));
	return wordMatch || null;
}

export function highlightMatchingLinks(inputVal: string): void {
	const query = inputVal.toLowerCase().trim();
	const links = document.querySelectorAll<HTMLAnchorElement>('.bookmark-list li a');

	links.forEach(link => {
		const linkText = link.textContent?.toLowerCase() || '';
		if (query !== '' && !linkText.includes(query)) {
			link.style.color = 'var(--drx-color-deactivate)';
		} else {
			link.style.color = '';
		}
	});

	currentMatch = findBestMatch(query);
}

export function handleSearch(query: string): void {
	const trimmedQuery = query.trim();
	if (!trimmedQuery) return;

	const matchedPrefix = Object.keys(SEARCH_PREFIXES).find(p => trimmedQuery.toLowerCase().startsWith(p));
	
	if (matchedPrefix) {
		const searchQuery = trimmedQuery.substring(matchedPrefix.length);
		window.location.href = `${SEARCH_PREFIXES[matchedPrefix]}${encodeURIComponent(searchQuery)}`;
		return;
	}

	const lowerQuery = trimmedQuery.toLowerCase();
	if (shortcuts[lowerQuery]) {
		window.location.href = shortcuts[lowerQuery];
		return;
	}

	if (currentMatch && shortcuts[currentMatch]) {
		window.location.href = shortcuts[currentMatch];
		return;
	}

	window.location.href = `${SEARCH_PREFIXES['s/']}${encodeURIComponent(trimmedQuery)}`;
}

export function clearSearchInput(inputElement: HTMLInputElement): void {
	inputElement.value = '';
	inputElement.focus();
	highlightMatchingLinks('');
}
