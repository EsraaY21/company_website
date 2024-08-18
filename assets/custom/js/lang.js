document.addEventListener('DOMContentLoaded', function () {
    var selectedLanguage = localStorage.getItem('lang') || 'ar';
    setLanguageAttributes(selectedLanguage);
    loadLanguageFiles(selectedLanguage);
    initializeLanguageSwitcher(selectedLanguage);
});

function setLanguageAttributes(lang) {
    var isRTL = lang !== 'en';
    document.documentElement.lang = isRTL ? 'ar' : 'en';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    var stylesheetLink = document.createElement('link');
    stylesheetLink.rel = 'stylesheet';
    stylesheetLink.href = isRTL ? 'assets/rtl/css/rtl.css' : 'assets/ltr/css/ltr.css';
    document.head.appendChild(stylesheetLink);

    var currentUrl = new URL(window.location.href);
    if (isRTL) {
        currentUrl.searchParams.delete('lang');
    } else {
        currentUrl.searchParams.set('lang', 'en');
    }
    window.history.replaceState({}, '', currentUrl.toString());

    loadScripts(isRTL);
}

function loadLanguageFiles(lang) {
    var translationFile = 'translations/' + lang + '.json';
    fetch(translationFile)
        .then(response => response.json())
        .then(translations => {
            updateTextContent(translations);
        });
}

function updateTextContent(translations) {
    var elements = document.querySelectorAll('[data-translate]');
    elements.forEach(function (element) {
        var key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

function initializeLanguageSwitcher(currentLanguage) {
    var languageSwitcher = document.getElementById('language_switcher');
    languageSwitcher.value = currentLanguage;

    languageSwitcher.addEventListener('change', function () {
        var selectedLanguage = this.value;
        localStorage.setItem('lang', selectedLanguage);
        
        // Reload the page immediately with the new language set
        var currentUrl = new URL(window.location.href);
        if (selectedLanguage === 'en') {
            currentUrl.searchParams.set('lang', 'en');
        } else {
            currentUrl.searchParams.delete('lang');
        }
        window.location.href = currentUrl.toString(); // Use href to force page reload
    });
}

function loadScripts(isRTL) {
    var scriptFiles = [
        'jquery-3.7.1.min.js',
        'bootstrap.bundle.min.js',
        'select2.min.js',
        'owl.carousel.min.js',
        'isotope.js',
        'waypoint.min.js',
        'jquery.counterup.min.js',
        'fancybox.js',
        'jquery.lazy.min.js',
        'datedropper.min.js',
        'emojionearea.min.js',
        'tooltipster.bundle.min.js',
        isRTL ? 'main-rtl.js' : 'main.js'
    ];

    scriptFiles.forEach(function (scriptFile) {
        var scriptElement = document.createElement('script');
        scriptElement.src = 'assets/' + (isRTL ? 'rtl' : 'ltr') + '/js/' + scriptFile;
        scriptElement.async = false; // Ensure scripts load in order
        document.body.appendChild(scriptElement);
    });
}
