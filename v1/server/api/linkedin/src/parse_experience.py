import re
import base64
import asyncio
import aiohttp
from io import BytesIO
from PIL import Image
from bs4 import BeautifulSoup, Tag
import json
from typing import List, Dict, Any, Union, Optional

async def convert_image_url_to_base64(image_url: str, session: aiohttp.ClientSession) -> str:
    """
    Download an image from URL and convert it to base64 string.
    
    Args:
        image_url (str): URL of the image to download
        session (aiohttp.ClientSession): HTTP session for making requests
        
    Returns:
        str: Base64 encoded string of the image, or empty string if failed
    """
    if not image_url:
        return ''
    
    try:
        async with session.get(image_url) as response:
            if response.status == 200:
                image_data = await response.read()
                
                # Optional: Compress/resize image using PIL
                try:
                    img = Image.open(BytesIO(image_data))
                    # Resize image if it's too large (max 200x200 for profile images)
                    img.thumbnail((200, 200), Image.Resampling.LANCZOS)
                    
                    # Convert to RGB if necessary (removes alpha channel)
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img = img.convert('RGB')
                    
                    # Save compressed image to bytes
                    output = BytesIO()
                    img.save(output, format='JPEG', quality=85, optimize=True)
                    compressed_data = output.getvalue()
                    
                    # Convert to base64
                    base64_string = base64.b64encode(compressed_data).decode('utf-8')
                    return f"data:image/jpeg;base64,{base64_string}"
                    
                except Exception as pil_error:
                    print(f"PIL processing failed, using raw image data: {pil_error}")
                    # Fallback: use original image data
                    base64_string = base64.b64encode(image_data).decode('utf-8')
                    content_type = response.headers.get('content-type', 'image/jpeg')
                    return f"data:{content_type};base64,{base64_string}"
            else:
                print(f"Failed to download image: {response.status}")
                return ''
                
    except Exception as e:
        print(f"Error downloading/converting image from {image_url}: {e}")
        return ''

async def parse_linkedin_experience_async(html_content: str) -> List[Dict[str, Any]]:
    """
    Parse LinkedIn experience HTML content and extract structured data with base64 images.
    
    Args:
        html_content (str): HTML content from LinkedIn experience page
        
    Returns:
        list: Array of experience dictionaries with base64 encoded images
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    experiences = []
    
    # Create HTTP session for downloading images
    async with aiohttp.ClientSession() as session:
        # Find all experience list items
        experience_items = soup.find_all('li', class_='pvs-list__paged-list-item')
        
        for item in experience_items:
            if not isinstance(item, Tag):
                continue
                
            try:
                experience: Dict[str, Any] = {}
                
                # Extract company logo/image
                img_tag = item.find('img', class_='ivm-view-attr__img--centered')  # type: ignore
                image_url = ''
                if img_tag and isinstance(img_tag, Tag):
                    image_url = str(img_tag.get('src', '') or '')
                
                # Convert image URL to base64
                experience['image'] = await convert_image_url_to_base64(image_url, session)
                
                # Find the main content container
                content_container = item.find('div', attrs={'class': 'display-flex flex-column align-self-center flex-grow-1'})  # type: ignore
                if not content_container or not isinstance(content_container, Tag):
                    continue
                    
                # Extract title (job position) - look for the first bold text element
                title_element = content_container.find('div', attrs={'class': 'display-flex align-items-center mr1 hoverable-link-text t-bold'})  # type: ignore
                if title_element and isinstance(title_element, Tag):
                    title_span = title_element.find('span', {'aria-hidden': 'true'})  # type: ignore
                    if title_span and isinstance(title_span, Tag):
                        experience['title'] = title_span.get_text(strip=True)
                    else:
                        continue
                else:
                    continue
                
                # Extract company and employment type from t-14 t-normal spans
                company_spans = content_container.find_all('span', attrs={'class': 't-14 t-normal'})  # type: ignore
                if company_spans:
                    # First span should contain company info
                    first_span = company_spans[0]
                    if isinstance(first_span, Tag):
                        company_text = first_span.find('span', {'aria-hidden': 'true'})  # type: ignore
                        if company_text and isinstance(company_text, Tag):
                            company_full = company_text.get_text(strip=True)
                            if '·' in company_full:
                                parts = [p.strip() for p in company_full.split('·')]
                                experience['company'] = parts[0]
                                experience['employment_type'] = parts[1] if len(parts) > 1 else ''
                            else:
                                experience['company'] = company_full
                                experience['employment_type'] = ''
                        else:
                            experience['company'] = ''
                            experience['employment_type'] = ''
                    else:
                        experience['company'] = ''
                        experience['employment_type'] = ''
                
                # Extract duration and location from t-black--light spans
                duration_location_spans = content_container.find_all('span', attrs={'class': 't-14 t-normal t-black--light'})  # type: ignore
                
                experience['duration'] = ''
                experience['location'] = ''
                
                for span in duration_location_spans:
                    if isinstance(span, Tag):
                        text_span = span.find('span', {'aria-hidden': 'true'})  # type: ignore
                        if text_span and isinstance(text_span, Tag):
                            text = text_span.get_text(strip=True)
                            # Duration typically contains months/years patterns
                            if any(word in text.lower() for word in ['mos', 'months', 'yrs', 'years', 'present', '-']):
                                if not experience['duration']:  # Take first duration match
                                    experience['duration'] = text
                            # Location typically contains location indicators
                            elif any(word in text.lower() for word in ['remote', 'hybrid', 'on-site', 'canada', 'united states', 'ontario', 'florida']):
                                if not experience['location']:  # Take first location match
                                    experience['location'] = text
                
                # Extract description and skills from sub-components
                sub_components = item.find('div', attrs={'class': 'pvs-entity__sub-components'})  # type: ignore
                experience['description'] = ''
                experience['skills'] = []
                
                if sub_components and isinstance(sub_components, Tag):
                    # Find all text elements in sub-components
                    all_spans = sub_components.find_all('span', {'aria-hidden': 'true'})  # type: ignore
                    
                    for span in all_spans:
                        if isinstance(span, Tag):
                            text = span.get_text(strip=True)
                            
                            # Check if this is a skills section
                            if text.startswith('Skills:'):
                                skills_text = text.replace('Skills:', '').strip()
                                # Split by · and clean up each skill
                                skills = [skill.strip() for skill in skills_text.split('·') if skill.strip()]
                                experience['skills'] = skills
                            elif text and not text.startswith('Skills:') and 'Skills:' not in text:
                                # This is likely the description - take the longest non-skills text
                                if len(text) > len(experience['description']):
                                    experience['description'] = text
                
                # Only add if we have essential information
                if experience.get('title') and experience.get('company'):
                    experiences.append(experience)
                    
            except Exception as e:
                print(f"Error parsing experience item: {e}")
                continue
    
    return experiences

# Keep the original synchronous function for backward compatibility
def parse_linkedin_experience(html_content: str) -> List[Dict[str, Any]]:
    """
    Synchronous wrapper that calls the async function.
    This maintains backward compatibility while defaulting to no image conversion.
    """
    return asyncio.run(parse_linkedin_experience_async(html_content))

def clean_html_entities(text: str) -> str:
    """Clean HTML entities from text"""
    if not text:
        return text
    
    # Replace common HTML entities
    replacements = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' '
    }
    
    for entity, replacement in replacements.items():
        text = text.replace(entity, replacement)
    
    return text

def format_experience_data(experiences: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Clean and format the extracted experience data"""
    formatted_experiences = []
    
    for exp in experiences:
        formatted_exp = {}
        
        # Clean all text fields
        for key, value in exp.items():
            if isinstance(value, str):
                formatted_exp[key] = clean_html_entities(value)
            elif isinstance(value, list):
                formatted_exp[key] = [clean_html_entities(item) for item in value]
            else:
                formatted_exp[key] = value
        
        formatted_experiences.append(formatted_exp)
    
    return formatted_experiences

# Example usage
if __name__ == "__main__":
    # Assuming html_content is your LinkedIn HTML content
    html_content = """
    <!-- Your LinkedIn HTML content goes here -->
    """
    
    # Parse the experiences
    experiences = parse_linkedin_experience(html_content)
    
    # Format and clean the data
    formatted_experiences = format_experience_data(experiences)
    
    # Print as JSON
    print(json.dumps(formatted_experiences, indent=2, ensure_ascii=False))
