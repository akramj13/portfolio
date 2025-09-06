import re
from bs4 import BeautifulSoup, Tag
import json
from typing import List, Dict, Any, Union, Optional

def parse_linkedin_experience(html_content: str) -> List[Dict[str, Any]]:
    """
    Parse LinkedIn experience HTML content and extract structured data.
    
    Args:
        html_content (str): HTML content from LinkedIn experience page
        
    Returns:
        list: Array of experience dictionaries
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    experiences = []
    
    # Find all experience list items
    experience_items = soup.find_all('li', class_='pvs-list__paged-list-item')
    
    for item in experience_items:
        if not isinstance(item, Tag):
            continue
            
        try:
            experience: Dict[str, Any] = {}
            
            # Extract company logo/image
            img_tag = item.find('img', class_='ivm-view-attr__img--centered')  # type: ignore
            if img_tag and isinstance(img_tag, Tag):
                experience['image'] = img_tag.get('src', '') or ''
            else:
                experience['image'] = ''
            
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
