import os
import asyncio
from fastapi import FastAPI, HTTPException
from playwright.async_api import async_playwright
from src.linkedin import LinkedIn
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = FastAPI(title="LinkedIn Profile API", description="API to scrape LinkedIn profile data")

PROFILE_URL = os.getenv("PROFILE_URL")
LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")

@app.get("/")
async def root():
    return {"message": "LinkedIn Profile API is running"}

@app.get("/experience")
async def get_experience():
    """Get experience section from LinkedIn profile"""
    try:
        async with async_playwright() as playwright:
            linkedin = LinkedIn(
                playwright,
                profile_url=PROFILE_URL,
                email=LINKEDIN_EMAIL,
                password=LINKEDIN_PASSWORD
            )
            experience_data = await linkedin.get_experience()
            return experience_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping experience data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
