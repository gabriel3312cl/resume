document.addEventListener('DOMContentLoaded', () => {
    const langEN = document.getElementById('lang-en');
    const langES = document.getElementById('lang-es');

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);

        document.querySelectorAll('[data-lang-en]').forEach(el => {
            const text = el.getAttribute(`data-lang-${lang}`);
            if (text) {
                el.innerHTML = text;
            }
        });
        
        const resumeEN = document.getElementById('resume-en');
        const resumeES = document.getElementById('resume-es');

        if (lang === 'es') {
            langES.classList.add('active');
            langEN.classList.remove('active');
            if(resumeES) resumeES.classList.remove('hidden');
            if(resumeEN) resumeEN.classList.add('hidden');
        } else {
            langEN.classList.add('active');
            langES.classList.remove('active');
            if(resumeEN) resumeEN.classList.remove('hidden');
            if(resumeES) resumeES.classList.add('hidden');
        }
    };

    langEN.addEventListener('click', () => setLanguage('en'));
    langES.addEventListener('click', () => setLanguage('es'));

    // Set initial language
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

    // Modal functionality
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.close-btn');
    const modals = document.querySelectorAll('.modal');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    function openModal(modal) {
        if (modal == null) return;
        modal.classList.add('active');
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.classList.remove('active');
    }
});
