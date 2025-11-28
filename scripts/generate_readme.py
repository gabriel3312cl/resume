import json
import re
import os

def get_cv_data(script_dir):
    """Reads and parses the cvData object from the javascript file."""
    data_file_path = os.path.join(script_dir, '..', 'assets', 'data', 'data.js')
    try:
        with open(data_file_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
    except FileNotFoundError:
        print(f"Error: {data_file_path} not found.")
        return None

    if 'window.cvData = ' in js_content:
        json_content = js_content.strip().replace('window.cvData = ', '')
        if json_content.endswith(';'):
            json_content = json_content[:-1]
    else:
        print("Error: 'window.cvData' not found in the JavaScript file.")
        return None
        
    try:
        return json.loads(json_content)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return None

def build_markdown_content(full_data, lang_code):
    """Builds the full markdown string for a given language."""
    
    lang_data = full_data.get(lang_code)
    if not lang_data:
        return None

    content = []

    # --- Language Switcher ---
    if lang_code == 'en':
        content.append("[Ver en español](README.es.md)\n")
    elif lang_code == 'es':
        content.append("[Read in English](README.md)\n")

    # --- Profile Section ---
    profile = lang_data.get('profile', {})
    if profile:
        content.append(f"# {profile.get('name', '')}\n")
        content.append(f"## {profile.get('title', '')}\n")
        content.append(f"_{profile.get('tagline', '')}_\n")
        
        contact = profile.get('contact', {})
        contact_links = []
        if contact.get('email'):
            contact_links.append(f"[Email](mailto:{contact.get('email')})")
        if contact.get('linkedin'):
            contact_links.append(f"[LinkedIn]({contact.get('linkedin')})")
        if contact.get('github'):
            contact_links.append(f"[GitHub]({contact.get('github')})")
        if contact.get('youtube'):
            contact_links.append(f"[YouTube]({contact.get('youtube')})")
        if contact.get('location'):
            contact_links.append(f"📍 {contact.get('location')}")
        content.append(" | ".join(contact_links) + "\n")

    # --- About Section ---
    about = lang_data.get('about', {})
    if about:
        title = about.get('title', 'About' if lang_code == 'en' else 'Sobre mí')
        content.append(f"## {title}\n")
        description = re.sub('<[^<]+?>', '', about.get('description', ''))
        content.append(f"{description}\n")

    # --- Experience Section ---
    experience = lang_data.get('experience', [])
    if experience:
        title = 'Experience' if lang_code == 'en' else 'Experiencia'
        content.append(f"## {title}\n")
        for job in experience:
            content.append(f"### {job.get('role', '')} at {job.get('company', '')}\n")
            content.append(f"*{job.get('period', '')}*\n")
            for resp in job.get('responsibilities', []):
                clean_resp = re.sub(r'</?strong>', '**', resp)
                content.append(f"- {clean_resp}")
            content.append("")

    # --- Projects Section ---
    projects = lang_data.get('projects', [])
    if projects:
        title = 'Projects' if lang_code == 'en' else 'Proyectos'
        content.append(f"## {title}\n")
        for proj in projects:
            content.append(f"### {proj.get('name', '')}\n")
            content.append(f"_{proj.get('summary', '')}_\n")
            if proj.get('tech'):
                tech_title = 'Technologies' if lang_code == 'en' else 'Tecnologías'
                content.append(f"**{tech_title}:** {', '.join(proj.get('tech'))}\n")
            content.append(f"{proj.get('description', '')}\n")
    
    # --- Skills Section ---
    skills = lang_data.get('skills', {})
    if skills:
        title = 'Skills' if lang_code == 'en' else 'Habilidades'
        content.append(f"## {title}\n")
        for category, skill_list in skills.items():
            content.append(f"- **{category}:** {', '.join(skill_list)}")
        content.append("\n")

    # --- Education Section ---
    education = lang_data.get('education', [])
    if education:
        title = lang_data.get('education_title', 'Education' if lang_code == 'en' else 'Educación')
        content.append(f"## {title}\n")
        for edu in education:
            content.append(f"### {edu.get('degree', '')}\n")
            content.append(f"*{edu.get('institution', '')} ({edu.get('period', '')})*\n")
            if edu.get('achievements'):
                content.append(f"- {edu.get('achievements')}\n")

    # --- Certifications Section ---
    certifications = lang_data.get('certifications', {})
    if certifications and certifications.get('list'):
        content.append(f"## {certifications.get('title', 'Certifications')}\n")
        for cert_group in certifications.get('list', []):
            content.append(f"### {cert_group.get('name')}")
            for item in cert_group.get('items', []):
                content.append(f"- {item}")
        content.append("\n")
        
    # --- Courses Section ---
    courses = lang_data.get('courses', {})
    if courses and courses.get('list'):
        content.append(f"## {courses.get('title', 'Courses')}\n")
        for course_group in courses.get('list', []):
            content.append(f"### {course_group.get('name')}")
            for item in course_group.get('items', []):
                content.append(f"- {item}")
        content.append("\n")
        
    return "\n".join(content)

def write_readme_file(script_dir, content, filename):
    """Writes content to a file in the root directory."""
    readme_path = os.path.join(script_dir, '..', filename)
    try:
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"{filename} generated successfully.")
    except IOError as e:
        print(f"Error writing to {filename}: {e}")

def main():
    """Main function to generate README files."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    full_data = get_cv_data(script_dir)
    if not full_data:
        return

    # Generate English README
    en_content = build_markdown_content(full_data, 'en')
    if en_content:
        write_readme_file(script_dir, en_content, 'README.md')

    # Generate Spanish README
    es_content = build_markdown_content(full_data, 'es')
    if es_content:
        write_readme_file(script_dir, es_content, 'README.es.md')

if __name__ == "__main__":
    main()