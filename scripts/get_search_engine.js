
function hideSettings() {
	document.getElementById("settings-container").style.display = 'none';
}


function showSettings() {
	document.getElementById("settings-container").style.display = 'flex';
}


function changeSearchEngine() {
	var form = document.getElementById('search-form');
	var input = document.getElementById('search-input');
	var searchEngine = document.getElementById("search-engine-selector");

	form.action = searchEngine.value;
	input.placeholder = "Search with " + searchEngine.options[searchEngine.selectedIndex].text;

	localStorage.setItem('selectedSearchEngine', searchEngine.value);
}


function loadSavedSearchEngine() {
	var savedSearchEngine = localStorage.getItem('selectedSearchEngine');
	var searchEngine = document.getElementById('search-engine-selector');

	if (savedSearchEngine) {
		searchEngine.value = savedSearchEngine;
	} else {
		searchEngine.value = 'https://duckduckgo.com/';
	}
	changeSearchEngine();
}


function clearSearchInput() {
	document.getElementById('search-input').value = '';
	document.getElementById('search-input').focus();
	highlightMatchingLinks();
}


function highlightMatchingLinks() {
	document.getElementById('search-input').value = document.getElementById('search-input').value.replace(/^\s+/, '');
	const query = document.getElementById('search-input').value.toLowerCase();
	const links = document.querySelectorAll('ul li a');

	links.forEach(link => {
		const linkText = link.textContent.toLowerCase();
		if (!linkText.includes(query)) {
			link.style.color = 'var(--drx-color-deactivate)';
		} else {
			link.style.color = 'var(--drx-color-text)';
		}
	});
}


document.addEventListener('keydown', function(event) {
	if (event.key === 'Escape') {
		hideSettings();
	} else if (event.key === ' ') {
		document.getElementById('search-input').focus();
	} else if (event.key === 'Enter') {
		handleSearch(event);
	} else if (event.key === 'c' && event.ctrlKey) {
		clearSearchInput();
	}
});

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


document.addEventListener('DOMContentLoaded', async function() {
	const shortcuts = await loadShortcuts();

	window.handleSearch = function(event) {
		event.preventDefault();
		const query = document.getElementById('search-input').value.toLowerCase();
		const searchEngine = document.getElementById('search-engine-selector').value;

		if (query.startsWith('s:')) {
			const searchQuery = query.substring(2);
			window.location.href = `${searchEngine}?q=${encodeURIComponent(searchQuery)}`;

		} else if (query.startsWith('r:')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://www.reddit.com/search/?q=${encodeURIComponent(searchQuery)}`;

		} else if (query.startsWith('g:')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://www.github.com/search/?q=${encodeURIComponent(searchQuery)}`;

		} else if (query.startsWith('i:')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;

		} else if (query.startsWith('a:')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://wiki.archlinux.org/index.php?search=${encodeURIComponent(searchQuery)}`;

		} else {
            const shortcut = Object.keys(shortcuts).find(key => 
                key.toLowerCase().split(' ').some(word => word.startsWith(query.trim()))
            );

            if (shortcut) {
                window.location.href = shortcuts[shortcut];
            } else {
                 window.location.href = `${searchEngine}?q=${encodeURIComponent(query)}`;
            }
		}
	};

	document.getElementById('search-input').addEventListener('input', highlightMatchingLinks);
});


loadSavedSearchEngine();
