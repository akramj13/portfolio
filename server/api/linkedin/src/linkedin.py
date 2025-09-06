import asyncio
import time
from playwright.async_api import async_playwright, Playwright

class LinkedIn:
    def __init__(self,
                 playwright,
                 profile_url,
                 email,
                 password):
        self.playwright = playwright
        self.profile_url = profile_url
        self.email = email
        self.password = password
    
    async def scrape_experience(self):
        browser = await self.playwright.chromium.launch()
        page = await browser.new_page()
        await page.goto("https://www.linkedin.com/login")
        await page.locator("#username").fill(self.email)
        await page.locator("#password").fill(self.password)
        await page.get_by_role("button", name="Sign in", exact=True).click()
        await page.goto(self.profile_url)
        
        # Wait for page to load
        time.sleep(10)
        await page.locator("#navigation-index-see-all-experiences").click()
        
        time.sleep(10)
        # Now get HTML content inside the main tag
        main_content = await page.locator('main').inner_html()
        # Create html file and write the content
        with open("linkedin_experience.html", "w", encoding="utf-8") as f:
            f.write(main_content)

        await browser.close()
    
    async def get_experience(self, content):
        # Placeholder for parsing logic
        # This function should parse the HTML content and extract experience details
        # For demonstration, returning a mock experience list
        return [
            {
                "title": "Software Engineer",
                "company": "Tech Company",
                "image": "base64imagestring",
                "duration": "Jan 2020 - Present",
                "location": "San Francisco, CA",
                "skills": ["Python", "Django", "React"],
                "description": "Working on developing web applications."
            }
        ]


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv

    load_dotenv()  # Load environment variables from .env file

    PROFILE_URL = os.getenv("PROFILE_URL")
    LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
    LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")

    async def main():
        async with async_playwright() as playwright:
            linkedin = LinkedIn(
                playwright,
                profile_url=PROFILE_URL,
                email=LINKEDIN_EMAIL,
                password=LINKEDIN_PASSWORD
            )
            await linkedin.scrape_experience()

    asyncio.run(main())
        



