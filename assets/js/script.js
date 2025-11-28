document.addEventListener('DOMContentLoaded', () => {
    const data = window.cvData;
    let currentLang = localStorage.getItem('cv_lang') || 'en';

    const sidebarEl = document.querySelector('#sidebar .sidebar-sticky');
    const contentEl = document.getElementById('content');
    const langBtns = document.querySelectorAll('.lang-btn');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    render(currentLang);
    updateLangButtons(currentLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                localStorage.setItem('cv_lang', lang);
                render(currentLang);
                updateLangButtons(currentLang);
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
                    <span>📧</span> <a href="mailto:${d.profile.contact.email}">${d.profile.contact.email}</a>
                </div>
                <div class="contact-item">
                    <span>💼</span> <a href="${d.profile.contact.linkedin}" target="_blank">LinkedIn</a>
                </div>
                <div class="contact-item">
                    <span>🐈</span> <a href="${d.profile.contact.github}" target="_blank">GitHub</a>
                </div>
                <div class="contact-item">
                    <span>📍</span> <span>${d.profile.contact.location}</span>
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