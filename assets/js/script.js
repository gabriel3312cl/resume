function toggleLanguage() {
    const body = document.body;
    if (body.classList.contains('show-es')) {
        body.classList.remove('show-es');
        document.documentElement.lang = 'en';
    } else {
        body.classList.add('show-es');
        document.documentElement.lang = 'es';
    }
}
