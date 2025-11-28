document.addEventListener('DOMContentLoaded', () => {
    const data = window.cvData;
    let currentLang = localStorage.getItem('cv_lang') || 'en';

    const containerEl = document.querySelector('.container');
    const sidebarEl = document.querySelector('#sidebar .sidebar-sticky');
    const contentEl = document.getElementById('content');
    const langBtns = document.querySelectorAll('.lang-btn');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (containerEl) {
        containerEl.classList.add('loaded');
    }

    render(currentLang);
    updateLangButtons(currentLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                sidebarEl.classList.add('fade-out');
                contentEl.classList.add('fade-out');

                setTimeout(() => {
                    currentLang = lang;
                    localStorage.setItem('cv_lang', lang);
                    render(currentLang);
                    updateLangButtons(currentLang);

                    sidebarEl.classList.remove('fade-out');
                    contentEl.classList.remove('fade-out');
                }, 200);
            }
        });
    });

    if(scrollToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        };

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    function updateLangButtons(lang) {
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    function render(lang) {
        const d = data[lang];
        const icons = {
            email: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
            linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
            github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
            youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`,
            location: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
        };
        
        let sidebarHTML = `
            <div class="profile-section">
                <!-- Placeholder for Image - in a real scenario this would be a URL -->
                <img src="assets/images/profile-photo.jpeg" alt="${d.profile.name}" class="profile-photo">
                <h1 class="profile-name">${d.profile.name}</h1>
                <div class="profile-title">${d.profile.title}</div>
                <div class="profile-tagline">${d.profile.tagline}</div>
            </div>

            <div class="contact-info">
                <div class="contact-item">
                    ${icons.email} <a href="mailto:${d.profile.contact.email}">${d.profile.contact.email}</a>
                </div>
                <div class="contact-item">
                    ${icons.linkedin} <a href="${d.profile.contact.linkedin}" target="_blank">LinkedIn</a>
                </div>
                <div class="contact-item">
                    ${icons.github} <a href="${d.profile.contact.github}" target="_blank">GitHub</a>
                </div>
                <div class="contact-item">
                    ${icons.youtube} <a href="${d.profile.contact.youtube}" target="_blank">YouTube</a>
                </div>
                <div class="contact-item">
                    ${icons.location} <span>${d.profile.contact.location}</span>
                </div>
            </div>

            <div class="skills-section">
                <h3 class="section-title">Skills</h3>
                <ul class="skills-list">
                    ${Object.entries(d.skills).map(([category, skills]) => `
                        <li class="skill-category">
                            <div class="skill-category-title">${category}</div>
                            <div class="skill-tags">
                                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        sidebarEl.innerHTML = sidebarHTML;

        const createAccordionItem = (id, title, icon, contentHTML, isOpen = false) => `
            <div class="accordion-item ${isOpen ? 'open' : ''}" id="${id}">
                <button class="accordion-header" aria-expanded="${isOpen}" aria-controls="${id}-content">
                    <span class="material-symbols-outlined">${icon}</span>
                    <span class="accordion-title">${title}</span>
                    <span class="accordion-icon">▲</span>
                </button>
                <div class="accordion-content" id="${id}-content">
                    <div class="accordion-body">
                        ${contentHTML}
                    </div>
                </div>
            </div>
        `;

        const aboutHTML = `
            <p>${d.about.description}</p>
        `;

        const experienceHTML = d.experience.map(job => `
            <div class="experience-item">
                <div class="experience-header">
                    <div class="role-title">${job.role}</div>
                    <div class="period">${job.period}</div>
                </div>
                <div class="company-name">${job.company}</div>
                <div class="description-text">
                    <ul style="padding-left: 20px; margin-top: 10px;">
                        ${job.responsibilities.map(res => `<li>${res}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        const projectsHTML = d.projects.map(proj => `
            <div class="project-item">
                <div class="project-header">
                    <div class="project-name">${proj.name}</div>
                    <div class="tech-stack">${proj.tech.join(' • ')}</div>
                </div>
                <div class="company-name">${proj.summary}</div>
                <div class="description-text">${proj.description}</div>
            </div>
        `).join('');

        const educationHTML = d.education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <div class="institution">${edu.institution}</div>
                    <div class="period">${edu.period}</div>
                </div>
                <div class="degree">${edu.degree}</div>
                ${edu.achievements ? `<div class="description-text">${edu.achievements}</div>` : ''}
            </div>
        `).join('');

         const certsHTML = `
            <div class="certs-container">
                <div class="certs-group">
                    <h4>${d.certifications.title}</h4>
                    ${d.certifications.list.map(grp => `
                        <div class="cert-provider">
                            <strong>${grp.name}</strong>
                            <ul>
                                ${grp.items.map(i => `<li>${i}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                <div class="certs-group" style="margin-top: 20px;">
                     <h4>${d.courses.title}</h4>
                    ${d.courses.list.map(grp => `
                        <div class="cert-provider">
                            <strong>${grp.name}</strong>
                            <ul>
                                ${grp.items.map(i => `<li>${i}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
         `;

        contentEl.innerHTML = `
            ${createAccordionItem('section-about', d.about.title, 'person', aboutHTML, true)}
            ${createAccordionItem('section-exp', lang === 'en' ? 'Experience' : 'Experiencia', 'work', experienceHTML, false)}
            ${createAccordionItem('section-proj', lang === 'en' ? 'Projects' : 'Proyectos', 'code_blocks', projectsHTML, false)}
            ${createAccordionItem('section-edu', lang === 'en' ? 'Education' : 'Educación', 'school', educationHTML, false)}
            ${createAccordionItem('section-certs', lang === 'en' ? 'Certifications & Courses' : 'Certificaciones y Cursos', 'workspace_premium', certsHTML, false)}
        `;

        attachAccordionListeners();
    }

    function attachAccordionListeners() {
        const headers = document.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const content = item.querySelector('.accordion-content');
                const isOpen = item.classList.contains('open');
                if (isOpen) {
                    item.classList.remove('open');
                    header.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('open');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }
});