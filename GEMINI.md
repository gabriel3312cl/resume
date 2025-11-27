# GEMINI.md - Directory Analysis

## Directory Overview

This directory serves as a professional portfolio for Gabriel Serra, a Full Stack software developer. It contains his curriculum vitae (CV) and a collection of detailed technical summaries of his software projects. The structure suggests a system for maintaining and generating tailored CV content based on deep analysis of his past work.

## Key Files

*   **`CV_Gabriel_Serra.pdf` & `CV_Gabriel_Serra_EN.pdf`**: These are the main CV files, likely in Spanish and English respectively. They represent the final output of the information gathered in this directory.

*   **`repos/resumen_global.md`**: This is a crucial summary document. It consolidates the technical competencies, technologies, and architectural patterns from 27 different repositories, painting a comprehensive picture of a Senior Full Stack developer. It covers languages (TypeScript, Python, Go, Kotlin, Swift), architectures (Clean Architecture, Microservices, Event-Driven), and a wide range of technologies across Backend, Frontend, Mobile, and DevOps.

*   **`repos/*.txt`**: Each text file in this directory is a deep-dive analysis of a specific project (e.g., `citec-web.txt`, `mascotaweb.txt`). These analyses break down:
    *   **Tech Stack:** Specific frameworks, libraries, and versions used.
    *   **Architecture:** Design patterns (MVC, Container/Presentational), SOLID principles, and architectural decisions.
    *   **DevOps & CI/CD:** Use of Docker, Azure Pipelines, and deployment strategies.
    *   **Code Quality & Seniority Assessment:** Evaluation of the code to determine the developer's level (e.g., Mid-Level, Senior) and suggests specific bullet points for a CV.

## Usage

This directory is intended for managing and curating a professional software development portfolio. The workflow appears to be:

1.  **Analyze Projects:** Individual projects are analyzed, and their technical details are saved into separate `.txt` files within the `repos` directory.
2.  **Consolidate Skills:** The information from all projects is aggregated into `repos/resumen_global.md` to provide a high-level, comprehensive skill summary.
3.  **Generate CV:** The detailed analyses and the global summary are used to create and update the main CV files (`CV_Gabriel_Serra.pdf` and its variations). The `.txt` files provide specific, evidence-backed bullet points that can be used to tailor the CV for different job applications.
