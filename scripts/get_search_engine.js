function hideSettings() {document.getElementById("settings-content").style.display = 'none';}


function showSettings() {document.getElementById("settings-content").style.display = 'flex';}


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
}


function highlightMatchingLinks() {
	const query = document.getElementById('search-input').value.toLowerCase();
	const links = document.querySelectorAll('ul li a');

	links.forEach(link => {
		const linkText = link.textContent.toLowerCase();
		if (linkText.includes(query) && query !== '') {
			link.style.fontWeight = 'bold';
		} else {
			link.style.color = 'var(--color-background-1)';
			link.style.fontWeight = 'normal';
		}
	});

	if (query === '') {
		links.forEach(link => {
			link.style.color = 'var(--color-foreground-1)';
			link.style.fontWeight = 'normal';
		});
	}
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


document.addEventListener('DOMContentLoaded', function() {
	const shortcuts = {
		'Reddit': 'https://reddit.com/',
		'Daily Dev': 'https://app.daily.dev/',
		'Modrinth': 'https://modrinth.com/dashboard',
		'Ivanime': 'https://www.ivanime.com/',
		'Ditlep': 'https://www.ditlep.com/',
		'GitHub': 'https://github.com/druxorey',
		'DevDocs': 'https://devdocs.io/',
		'W3Schools': 'https://w3schools.com',
		'Cplusplus': 'https://cplusplus.com/',
		'VirusTotal': 'https://www.virustotal.com/gui/home/upload',
		'Conest': 'https://conest.ciens.ucv.ve/webapp/',
		'PortalAsig2': 'https://portalasig2.ciens.ucv.ve/#/',
		'Campus Virtual': 'https://campusvirtualucv.org/ead/login/index.php',
		'CiensMail': 'https://correo.ciens.ucv.ve',
		'Geogebra': 'https://www.geogebra.org/calculator',
		'Dotfiles': 'https://github.com/druxorey/dotfiles',
		'Arch Wiki': 'https://wiki.archlinux.org/',
		'Explain Shell': 'https://explainshell.com/#',
		'Techthings': 'https://www.reddit.com/user/devdruxorey/m/techthings/',
		'Deepseek': 'https://chat.deepseek.com/'
	};

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

		} else {
			const shortcut = Object.keys(shortcuts).find(key => key.toLowerCase().includes(query));
			if (shortcut) {
				window.location.href = shortcuts[shortcut];
			} else {
				alert('Shortcut not found');
			}
		}
	};

	document.getElementById('search-input').addEventListener('input', highlightMatchingLinks);
});


loadSavedSearchEngine();
