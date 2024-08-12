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

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideSettings();
    } else if (event.key === ' ') {
        document.getElementById('search-input').focus();
    }
});

loadSavedSearchEngine();
