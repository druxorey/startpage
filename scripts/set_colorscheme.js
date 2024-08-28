var colorschemeList = {
    "dracula-dark": {
        '--color-foreground-1': '#F8F8F2',
        '--color-foreground-2': '#B9BBCB',
        '--color-background-1': '#44475A',
        '--color-background-2': '#282A36',
        '--color-background-3': '#21222C',
        '--color-accent-1': '#BD93F9',
        '--color-accent-2': '#BD93F933',
        '--color-shadow-1': '#21222C',
        '--color-shadow-2': '#D6ACFF',
        '--icon-settings-open-1': 'url("../images/dracula-settings-open-1.svg")',
        '--icon-settings-open-2': 'url("../images/dracula-settings-open-2.svg")',
        '--icon-settings-close-1': 'url("../images/dracula-settings-close-1.svg")',
        '--icon-settings-close-2': 'url("../images/dracula-settings-close-2.svg")',
    },
    "dracula-light": {
        '--color-foreground-1': '#44475A',
        '--color-foreground-2': '#353747',
        '--color-background-1': '#C4C7D4',
        '--color-background-2': '#DCDDE5',
        '--color-background-3': '#F3F4F6',
        '--color-accent-1': '#BD93F9',
        '--color-accent-2': '#BD93F933',
        '--color-shadow-1': '#C4C7D4',
        '--color-shadow-2': '#D6ACFF',
        '--icon-settings-open-1': 'url("../images/dracula-settings-open-3.svg")',
        '--icon-settings-open-2': 'url("../images/dracula-settings-open-2.svg")',
        '--icon-settings-close-1': 'url("../images/dracula-settings-close-3.svg")',
        '--icon-settings-close-2': 'url("../images/dracula-settings-close-2.svg")',
    },
    "edge": {
        '--color-foreground-1': '#F8F8F8',
        '--color-foreground-2': '#B9B9B9',
        '--color-background-1': '#6B6B6B',
        '--color-background-2': '#3B3B3B',
        '--color-background-3': '#2B2B2B',
        '--color-accent-1': '#C9C9C9',
        '--color-accent-2': '#9B9B9B33',
        '--color-shadow-1': '#2B2B2B',
        '--color-shadow-2': '#B9B9B9',
        '--icon-settings-open-1': 'url("../images/edge-settings-open-1.svg")',
        '--icon-settings-open-2': 'url("../images/edge-settings-open-2.svg")',
        '--icon-settings-close-1': 'url("../images/edge-settings-close-1.svg")',
        '--icon-settings-close-2': 'url("../images/edge-settings-close-2.svg")',
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
