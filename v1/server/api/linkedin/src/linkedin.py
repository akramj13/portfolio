import asyncio
import time
from playwright.async_api import async_playwright
from src.parse_experience import parse_linkedin_experience_async, format_experience_data

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
    
    async def __scrape_experience(self):
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

        await browser.close()

        return main_content
    
    async def get_experience(self):
        content = await self.__scrape_experience()
        experiences = await parse_linkedin_experience_async(content)
        formatted_experiences = format_experience_data(experiences)
        
        return formatted_experiences
