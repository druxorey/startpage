var colorschemeList = {
	"dracula-dark": {
		'--color-foreground-1': '#F8F8F2',
		'--color-foreground-2': '#5a5d6d',
		'--color-background-1': '#282A36',
		'--color-background-2': '#1E1F29',
		'--color-accent': '#BD93F9',
		'--color-blur': '#BD93F933',
		'--color-shadow': '#1A1B23',
		'--color-highlight': '#D6ACFF',
		'--button-inactive': 'brightness(0) saturate(100%) invert(37%) sepia(20%) saturate(343%) hue-rotate(193deg) brightness(90%) contrast(90%)',
		'--button-active': 'invert(68%) sepia(92%) saturate(2532%) hue-rotate(213deg) brightness(101%) contrast(103%)',
	},
	"dracula-light": {
		'--color-foreground-1': '#44475A',
		'--color-foreground-2': '#B9BAC2',
		'--color-background-1': '#DDDDE3',
		'--color-background-2': '#F4F4F6',
		'--color-accent': '#BD93F9',
		'--color-blur': '#BD93F933',
		'--color-shadow': '#A5A7B6',
		'--color-highlight': '#D6ACFF',
		'--button-inactive': 'brightness(0) saturate(100%) invert(78%) sepia(7%) saturate(219%) hue-rotate(196deg) brightness(96%) contrast(92%)',
		'--button-active': 'invert(68%) sepia(92%) saturate(2532%) hue-rotate(213deg) brightness(101%) contrast(103%)',
	},
	"edge": {
		'--color-foreground-1': '#F8F8F8',
		'--color-foreground-2': '#6B6B6B',
		'--color-background-1': '#3B3B3B',
		'--color-background-2': '#2B2B2B',
		'--color-accent': '#C9C9C9',
		'--color-blur': '#9B9B9B33',
		'--color-shadow': '#2B2B2B',
		'--color-highlight': '#B9B9B9',
		'--button-inactive': 'brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(923%) hue-rotate(182deg) brightness(98%) contrast(74%)',
		'--button-active': 'invert(83%) sepia(3%) saturate(26%) hue-rotate(41deg) brightness(104%) contrast(80%)',
	},
	"gruvbox": {
		'--color-foreground-1': '#D4BE98',
		'--color-foreground-2': '#3c3836',
		'--color-background-1': '#504945',
		'--color-background-2': '#282828',
		'--color-accent': '#E78A4E',
		'--color-blur': '#E78A4E33',
		'--color-shadow': '#1d2021',
		'--color-highlight': '#A89984',
		'--button-inactive': 'brightness(0) saturate(100%) invert(16%) sepia(1%) saturate(2902%) hue-rotate(336deg) brightness(102%) contrast(83%)',
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
