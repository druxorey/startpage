function changeColorScheme() {
    const colorscheme = document.getElementById("colorscheme-selector");
    document.body.setAttribute("theme", colorscheme.value);

    const link = document.getElementById("colorscheme-style");
    link.href = `static/styles/schemes/${colorscheme.value}.css`

    localStorage.setItem("selectedColorscheme", colorscheme.value);
}

function loadSavedColorscheme() {
    const savedColorscheme = localStorage.getItem("selectedColorscheme") ?? 'dracula-dark';
    const colorscheme = document.getElementById("colorscheme-selector");

    colorscheme.value = savedColorscheme;

    changeColorScheme();
}

loadSavedColorscheme();
