import os
import asyncio
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from playwright.async_api import async_playwright
from src.linkedin import LinkedIn
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = FastAPI(title="LinkedIn Profile API", description="API to scrape LinkedIn profile data")

# Security
security = HTTPBearer()

PROFILE_URL = os.getenv("PROFILE_URL")
LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")
API_TOKEN = os.getenv("API_TOKEN")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify the authorization token"""
    if not API_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API token not configured on server"
        )
    
    if credentials.credentials != API_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials

@app.get("/health")
async def health_check():
    """Health check endpoint - no authentication required"""
    return {"status": "healthy", "message": "LinkedIn Profile API is running"}

@app.get("/")
async def root(token: str = Depends(verify_token)):
    """Protected root endpoint"""
    return {"message": "LinkedIn Profile API is running", "authenticated": True}

@app.get("/experience")
async def get_experience(token: str = Depends(verify_token)):
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
