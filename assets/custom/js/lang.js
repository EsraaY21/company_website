document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the selected language from localStorage, default to 'en'
    var selectedLanguage = localStorage.getItem('lang') || 'en';
    
    // Load the appropriate stylesheet based on the selected language
    if (selectedLanguage !== 'en') {
        var rtlStylesheet = document.createElement('link');
        rtlStylesheet.rel = 'stylesheet';
        rtlStylesheet.href = 'assets/custom/css/rtl.css';
        document.head.appendChild(rtlStylesheet);

        // Set HTML attributes for RTL
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        
        // Remove 'lang' parameter from the URL if present
        var currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.has('lang')) {
            currentUrl.searchParams.delete('lang');
            window.history.replaceState({}, '', currentUrl.toString());
        }
    } else {
        // Set HTML attributes for LTR
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';

        // Add 'lang=en' to the URL if not already present
        var currentUrl = new URL(window.location.href);
        if (!currentUrl.searchParams.has('lang')) {
            currentUrl.searchParams.set('lang', 'en');
            window.history.replaceState({}, '', currentUrl.toString());
        }
    }

    // Load translation file based on the selected language
    var translationFile = 'translations/' + selectedLanguage + '.json';
    fetch(translationFile)
        .then(response => response.json())
        .then(translations => {
            // Update text content based on translations
            var elements = document.querySelectorAll('[data-translate]');
            elements.forEach(function(element) {
                var key = element.getAttribute('data-translate');
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });

            // Update typewriter text if applicable
            var typewriteElement = document.querySelector('.typewrite');
            if (typewriteElement) {
                var dataType = JSON.parse(typewriteElement.getAttribute('data-type'));
                typewriteElement.setAttribute('data-type', JSON.stringify(dataType.map(key => translations[key] || key)));
            }
        });

    // Language switcher
    document.getElementById('language_switcher').addEventListener('change', function() {
        var selectedLanguage = this.value;
        localStorage.setItem('lang', selectedLanguage);
        var currentUrl = new URL(window.location.href);

        if (selectedLanguage === 'en') {
            currentUrl.searchParams.set('lang', 'en');
            window.location.href = currentUrl.toString();
        } else {
            currentUrl.searchParams.delete('lang');
            window.location.href = currentUrl.toString();
        }
    });

    // Set the selected option based on the current localStorage value
    var languageSwitcher = document.getElementById('language_switcher');
    languageSwitcher.value = selectedLanguage;
});
