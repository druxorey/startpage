var colorschemeList = {
    "dracula-dark": {
        '--color-foreground-1': '#F8F8F2',
        '--color-foreground-2': '#585C74',
        '--color-background-1': '#282A36',
        '--color-background-2': '#21222C',
        '--color-accent-1': '#BD93F9',
        '--color-accent-2': '#BD93F933',
        '--color-shadow-1': '#21222C',
        '--color-shadow-2': '#D6ACFF',
		'--button-inactive': 'invert(25%) sepia(9%) saturate(1455%) hue-rotate(194deg) brightness(93%) contrast(82%)',
		'--button-active': 'invert(68%) sepia(92%) saturate(2532%) hue-rotate(213deg) brightness(101%) contrast(103%)',
    },
    "dracula-light": {
        '--color-foreground-1': '#44475A',
        '--color-foreground-2': '#707388',
        '--color-background-1': '#DDDDE3',
        '--color-background-2': '#F3F4F6',
        '--color-accent-1': '#BD93F9',
        '--color-accent-2': '#BD93F933',
        '--color-shadow-1': '#A5A7B6',
        '--color-shadow-2': '#D6ACFF',
		'--button-inactive': 'invert(87%) sepia(10%) saturate(225%) hue-rotate(191deg) brightness(92%) contrast(88%)',
		'--button-active': 'invert(68%) sepia(92%) saturate(2532%) hue-rotate(213deg) brightness(101%) contrast(103%)',
    },
    "edge": {
        '--color-foreground-1': '#F8F8F8',
        '--color-foreground-2': '#B9B9B9',
        '--color-background-1': '#3B3B3B',
        '--color-background-2': '#2B2B2B',
        '--color-accent-1': '#C9C9C9',
        '--color-accent-2': '#9B9B9B33',
        '--color-shadow-1': '#2B2B2B',
        '--color-shadow-2': '#B9B9B9',
		'--button-inactive': 'invert(44%) sepia(1%) saturate(0%) hue-rotate(105deg) brightness(93%) contrast(95%)',
		'--button-active': 'invert(83%) sepia(3%) saturate(26%) hue-rotate(41deg) brightness(104%) contrast(80%)',
    },
    "gruvbox": {
        '--color-foreground-1': '#D4BE98',
        '--color-foreground-2': '#DDC7A1',
        '--color-background-1': '#504945',
        '--color-background-2': '#282828',
        '--color-accent-1': '#E78A4E',
        '--color-accent-2': '#E78A4E33',
        '--color-shadow-1': '#1d2021',
        '--color-shadow-2': '#A89984',
		'--button-inactive': 'invert(7%) sepia(10%) saturate(402%) hue-rotate(156deg) brightness(94%) contrast(96%)',
		'--button-active': 'invert(60%) sepia(75%) saturate(483%) hue-rotate(332deg) brightness(95%) contrast(90%)',
    }
};

function changeColorScheme() {
    var root = document.documentElement;
    var colorscheme = document.getElementById("colorscheme-selector");
    var selectedScheme = colorschemeList[colorscheme.value];

    for (var property in selectedScheme) {
        root.style.setProperty(property, selectedScheme[property]);
    }

    localStorage.setItem("selectedColorscheme", colorscheme.value);
}

function loadSavedColorscheme() {
    var savedColorscheme = localStorage.getItem("selectedColorscheme");
    var colorscheme = document.getElementById("colorscheme-selector");

    if (savedColorscheme) {
        colorscheme.value = savedColorscheme;
    } else {
        colorscheme.value = "dracula-dark";
    }

    changeColorScheme();
}

loadSavedColorscheme();
