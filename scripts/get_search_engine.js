
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


document.addEventListener('DOMContentLoaded', function() {
	const shortcuts = {
		'Druxorey': 'https://druxorey.github.io/',
		'Arch Wiki': 'https://wiki.archlinux.org/',
		'Calendar': 'https://calendar.google.com/calendar/u/0/r',
		'Campus Virtual': 'https://campusvirtualucv.org/ead/login/index.php',
		'CiensMail': 'https://correo.ciens.ucv.ve',
		'Conest': 'https://conest.ciens.ucv.ve/webapp/',
		'Daily Dev': 'https://app.daily.dev/',
		'Deepseek': 'https://chat.deepseek.com/',
		'DevDocs': 'https://devdocs.io/',
		'Dotfiles': 'https://github.com/druxorey/dotfiles',
		'Drive': 'https://drive.google.com/drive/my-drive',
		'Escritorio Remoto': 'https://remotedesktop.google.com/access',
		'Explain Shell': 'https://explainshell.com/#',
		'Gemini': 'https://gemini.google.com/app',
		'Geogebra': 'https://www.geogebra.org/calculator',
		'GitHub': 'https://github.com/druxorey',
		'Gmail': 'https://mail.google.com/mail/u/0/#inbox',
		'Ivanime': 'https://www.ivanime.com/',
		'Letcode': 'https://leetcode.com/problemset/',
		'Mercado Libre': 'https://www.mercadolibre.com.ve/',
		'Modrinth': 'https://modrinth.com/dashboard',
		'NotebookLM': 'https://notebooklm.google.com/',
		'Notion': 'https://notion.so/',
		'Reddit': 'https://reddit.com/',
		'PortalAsig2': 'https://portalasig2.ciens.ucv.ve/#/',
		'Tasks': 'https://tasks.google.com/tasks/',
		'Techthings': 'https://www.reddit.com/user/devdruxorey/m/techthings/',
		'The Pirate Bay': 'https://thepiratebay.org/',
		'Traductor': 'https://translate.google.com/',
		'Translate': 'https://translate.google.com/',
		'Todo': 'https://tasks.google.com/tasks/',
		'VirusTotal': 'https://www.virustotal.com/gui/home/upload',
		'Youtube': 'https://www.youtube.com/',
		'W3Schools': 'https://w3schools.com',
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

		} else if (query.startsWith('a:')) {
			const searchQuery = query.substring(2);
			window.location.href = `https://wiki.archlinux.org/index.php?search=${encodeURIComponent(searchQuery)}`;

		} else {
			const shortcut = Object.keys(shortcuts).find(key => key.toLowerCase().includes(query));
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
