document.addEventListener('DOMContentLoaded', () => {
    const data = window.cvData;
    let currentLang = localStorage.getItem('cv_lang') || 'en';

    // Elements
    const sidebarEl = document.querySelector('#sidebar .sidebar-sticky');
    const contentEl = document.getElementById('content');
    const langBtns = document.querySelectorAll('.lang-btn');

    // Initial Render
    render(currentLang);
    updateLangButtons(currentLang);

    // Event Listeners
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

    function updateLangButtons(lang) {
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    function render(lang) {
        const d = data[lang];

        // --- Sidebar Render ---
        let sidebarHTML = `
            <div class="profile-section">
                <!-- Placeholder for Image - in a real scenario this would be a URL -->
                <img src="https://ui-avatars.com/api/?name=Gabriel+Serra&background=1d1d1f&color=fff&size=200" alt="${d.profile.name}" class="profile-photo">
                <h1 class="profile-name">${d.profile.name}</h1>
                <div class="profile-title">${d.profile.title}</div>
                <div class="profile-tagline">${d.profile.tagline}</div>
            </div>

            <div class="contact-info">
                <div class="contact-item">
                    <span>📧</span> <a href="mailto:${d.profile.contact.email}">${d.profile.contact.email}</a>
                </div>
                <div class="contact-item">
                    <span>📱</span> <span>${d.profile.contact.phone}</span>
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

            <div class="skills-section">
                 <h3 class="section-title">Certifications</h3>
                 <ul class="skills-list">
                    ${d.certifications.map(cert => `
                        <li style="margin-bottom: 8px; font-size: 0.9rem; color: #424245;">• ${cert}</li>
                    `).join('')}
                 </ul>
            </div>
        `;
        sidebarEl.innerHTML = sidebarHTML;


        // --- Main Content Render ---
        let contentHTML = `
            <section class="about-section">
                <h2 class="section-title">${d.about.title}</h2>
                <p>${d.about.description}</p>
            </section>

            <section class="experience-section">
                <h2 class="section-title">${lang === 'en' ? 'Experience' : 'Experiencia'}</h2>
                ${d.experience.map(job => `
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
                `).join('')}
            </section>

            <section class="projects-section">
                <h2 class="section-title">${lang === 'en' ? 'Projects' : 'Proyectos'}</h2>
                ${d.projects.map(proj => `
                    <div class="project-item">
                        <div class="project-header">
                            <div class="project-name">${proj.name}</div>
                            <div class="tech-stack">${proj.tech.join(' • ')}</div>
                        </div>
                        <div class="company-name">${proj.summary}</div>
                        <div class="description-text">${proj.description}</div>
                    </div>
                `).join('')}
            </section>

            <section class="education-section">
                <h2 class="section-title">${lang === 'en' ? 'Education' : 'Educación'}</h2>
                ${d.education.map(edu => `
                    <div class="education-item">
                        <div class="education-header">
                            <div class="institution">${edu.institution}</div>
                            <div class="period">${edu.period}</div>
                        </div>
                        <div class="degree">${edu.degree}</div>
                        <div class="description-text">${edu.achievements}</div>
                    </div>
                `).join('')}
            </section>
        `;
        contentEl.innerHTML = contentHTML;
    }
});
