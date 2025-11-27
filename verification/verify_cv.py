from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the index.html file
        # Since I'm in the root, I can use absolute path
        cwd = os.getcwd()
        url = f"file://{cwd}/index.html"
        print(f"Navigating to {url}")
        page.goto(url)

        # Wait for the JS to hydrate the content
        page.wait_for_selector("#cv-name")

        # Verify initial English content
        expect(page.locator("#cv-name")).to_have_text("Gabriel Serra")
        expect(page.locator("#section-experience .section-title")).to_have_text("Experience")

        # Take screenshot of English version
        page.screenshot(path="verification/cv_en.png", full_page=True)
        print("Screenshot EN taken")

        # Switch to Spanish
        page.click("button[data-lang='es']")

        # Verify Spanish content
        expect(page.locator("#section-experience .section-title")).to_have_text("Experiencia Laboral")
        expect(page.locator("#cv-title")).to_have_text("Desarrollador de Software e Ingeniero DevOps")

        # Take screenshot of Spanish version
        page.screenshot(path="verification/cv_es.png", full_page=True)
        print("Screenshot ES taken")

        browser.close()

if __name__ == "__main__":
    run()
