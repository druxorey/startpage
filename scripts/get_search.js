
function clearSearchInput() {
	document.getElementById('search-input').value = '';
	document.getElementById('search-input').focus();
	highlightMatchingLinks();
}

async function loadShortcuts() {
    const yamlUrl = 'https://raw.githubusercontent.com/druxorey/dotfiles/refs/heads/main/config/brave/bookmarks.yaml';
    try {
        const response = await fetch(yamlUrl);
        const yamlText = await response.text();

        // Parse YAML manually
        const shortcutsArray = yamlText
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#')) // Remove empty lines and comments
            .reduce((acc, line) => {
                const match = line.match(/^\s*-\s*name:\s*(.+)|^\s*url:\s*(.+)/);
                if (match) {
                    if (match[1]) acc.push({ name: match[1].trim() });
                    if (match[2]) acc[acc.length - 1].url = match[2].trim();
                }
                return acc;
            }, []);

        // Convert YAML array to dictionary
        const shortcuts = shortcutsArray.reduce((acc, item) => {
            acc[item.name] = item.url;
            return acc;
        }, {});

        return shortcuts;
    } catch (error) {
        console.error('Error loading shortcuts:', error);
        return {};
    }
}


function findBestMatch(query) {
	if (!query || !window.currentShortcuts) return null;
	const names = Object.keys(window.currentShortcuts);
	
	// Priority 1: The name starts with the query
	let match = names.find(name => name.toLowerCase().startsWith(query));
	if (match) return { name: match, type: 'start' };

	// Priority 2: Any word in the name starts with the query
	match = names.find(name => name.toLowerCase().split(' ').some(word => word.includes(query)));
	if (match) return { name: match, type: 'word' };

	return null;
}


function highlightMatchingLinks() {
	const input = document.getElementById('search-input');
	input.value = input.value.replace(/^\s+/, '');
	const query = input.value.toLowerCase();
	const links = document.querySelectorAll('ul li a');
	const suggestionBox = document.getElementById('search-suggestion');

	links.forEach(link => {
		const linkText = link.textContent.toLowerCase();
		if (!linkText.includes(query) && query !== '') {
			link.style.color = 'var(--drx-color-deactivate)';
		} else {
			link.style.color = 'var(--drx-color-text)';
		}
	});

	const matchData = findBestMatch(query);
	window.currentMatch = matchData;

	if (matchData) {
		const matchName = matchData.name;
		const queryIndex = matchName.toLowerCase().indexOf(query);
		const suffix = matchName.substring(queryIndex + query.length);
		
		suggestionBox.textContent = input.value + suffix;
	} else {
		suggestionBox.textContent = '';
	}
}


document.addEventListener('DOMContentLoaded', async function() {
	const shortcuts = await loadShortcuts();
	window.currentShortcuts = shortcuts;

	window.handleSearch = function(event) {
		event.preventDefault();
		const query = document.getElementById('search-input').value.toLowerCase();
		const searchEngine = document.getElementById('search-engine-selector').value;

		if (query.startsWith('s/')) {
			const searchQuery = query.substring(2);
			window.location.href = `${searchEngine}?q=${encodeURIComponent(searchQuery)}`;
		} else if (query.startsWith('r/')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://www.reddit.com/search/?q=${encodeURIComponent(searchQuery)}`;
		} else if (query.startsWith('g/')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://www.github.com/search/?q=${encodeURIComponent(searchQuery)}`;
		} else if (query.startsWith('y/')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://www.youtube.com/search/?q=${encodeURIComponent(searchQuery)}`;
		} else if (query.startsWith('i/')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
		} else if (query.startsWith('a/')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://wiki.archlinux.org/index.php?search=${encodeURIComponent(searchQuery)}`;
		} else {
            if (window.currentMatch) {
                window.location.href = shortcuts[window.currentMatch.name];
            }
		}
	};

	document.getElementById('search-input').addEventListener('input', highlightMatchingLinks);
});
