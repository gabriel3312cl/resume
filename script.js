document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialization
    const defaultLang = localStorage.getItem('cv-lang') || 'en';
    let currentLang = defaultLang;

    // Dictionary for Section Titles (as I didn't include them in the data model)
    const dictionary = {
        en: {
            experience: "Experience",
            projects: "Projects",
            skills: "Technical Skills",
            education: "Education",
            certifications: "Certifications",
            contact: "Contact",
            about: "About Me"
        },
        es: {
            experience: "Experiencia Laboral",
            projects: "Proyectos Destacados",
            skills: "Habilidades Técnicas",
            education: "Educación",
            certifications: "Certificaciones",
            contact: "Contacto",
            about: "Perfil Profesional"
        }
    };

    // 2. DOM Elements
    const els = {
        name: document.getElementById('cv-name'),
        title: document.getElementById('cv-title'),
        tagline: document.getElementById('cv-tagline'),
        contact: document.getElementById('cv-contact'),
        aboutTitle: document.querySelector('#section-about .section-title'),
        aboutText: document.getElementById('about-text'),
        expList: document.getElementById('experience-list'),
        projGrid: document.getElementById('projects-grid'),
        eduList: document.getElementById('education-list'),
        skillList: document.getElementById('skills-list'),
        certList: document.getElementById('certifications-list'),
        sectionTitles: document.querySelectorAll('.section-title[data-label]'),
        langBtns: document.querySelectorAll('.lang-switcher button')
    };

    // 3. Render Function
    function render(lang) {
        const data = window.cvData[lang];
        if (!data) return console.error('Language data not found');

        // Update Global UI
        document.documentElement.lang = lang;
        els.langBtns.forEach(btn => {
            if(btn.dataset.lang === lang) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Header
        els.name.textContent = data.profile.name;
        els.title.textContent = data.profile.title;
        els.tagline.textContent = data.profile.tagline;

        // Contact (Formatted nicely)
        els.contact.innerHTML = `
            <span>${data.profile.contact.location}</span> &bull;
            <a href="mailto:${data.profile.contact.email}">${data.profile.contact.email}</a> &bull;
            <span>${data.profile.contact.phone}</span>
        `;

        // Section Titles
        els.sectionTitles.forEach(titleEl => {
            const labelKey = titleEl.dataset.label;
            if (dictionary[lang][labelKey]) {
                titleEl.textContent = dictionary[lang][labelKey];
            }
        });
        els.aboutTitle.textContent = dictionary[lang].about;

        // About
        els.aboutText.textContent = data.about.description;

        // Experience
        els.expList.innerHTML = data.experience.map(job => `
            <div class="exp-item">
                <div class="exp-header">
                    <h4 class="exp-role">${job.role}</h4>
                    <span class="exp-period">${job.period}</span>
                </div>
                <div class="exp-company">${job.company}</div>
                <ul class="exp-responsibilities">
                    ${job.responsibilities.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        // Projects
        els.projGrid.innerHTML = data.projects.map(proj => `
            <div class="project-card">
                <div class="project-header">
                    <h4 class="project-name">${proj.name}</h4>
                </div>
                <p class="project-summary">${proj.summary}</p>
                <div class="project-tech">
                    ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <p class="project-desc">${proj.description}</p>
            </div>
        `).join('');

        // Education
        els.eduList.innerHTML = data.education.map(edu => `
            <div class="edu-item">
                <h4 class="edu-degree">${edu.degree}</h4>
                <div class="edu-institution">${edu.institution}</div>
                <div class="edu-period">${edu.period}</div>
                ${edu.achievements ? `<div class="edu-achievements">${edu.achievements}</div>` : ''}
            </div>
        `).join('');

        // Skills (Grouped)
        els.skillList.innerHTML = Object.entries(data.skills).map(([category, items]) => `
            <div class="skill-group">
                <h4 class="skill-category">${category}</h4>
                <p class="skill-items">${items.join(', ')}</p>
            </div>
        `).join('');

        // Certifications
        els.certList.innerHTML = data.certifications.map(cert => `
            <li>${cert}</li>
        `).join('');
    }

    // 4. Event Listeners
    els.langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = btn.dataset.lang;
            currentLang = newLang;
            localStorage.setItem('cv-lang', newLang);
            render(newLang);
        });
    });

    // 5. Initial Render
    if (window.cvData) {
        render(currentLang);
    } else {
        console.error('CV Data not loaded!');
        els.name.textContent = "Error loading data.js";
    }
});
