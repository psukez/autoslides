#!/usr/bin/env python3
"""
AutoSlides AI Agent

This script processes extracted content from various sources and generates
structured slide data with text, images, and tables.
"""

import os
import json
import sys
from typing import Dict, List, Any
import google.generativeai as genai  # Requires: pip install google-generativeai

class AutoSlidesAgent:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('GOOGLE_AI_API_KEY')
        if not self.api_key:
            raise ValueError("Google AI API key required")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('models/gemini-2.5-pro')  # Using Gemini 2.5 Pro

    def generate_slides(self, sources: List[Dict[str, str]], slide_count: int = 5, template: str = "default", language: str = "english") -> Dict[str, Any]:
        """
        Generate structured slide data from multiple sources.

        Args:
            sources: List of source dicts with 'type' and 'value'
            slide_count: Number of slides to generate
            template: Slide template style
            language: Language for slides

        Returns:
            Dict containing slides, source_usage percentages, and error if any
        """
        # Process sources
        combined_content = ""
        source_descriptions = []
        for i, source in enumerate(sources):
            if source['type'] == 'text':
                content_text = source['value']
            else:
                content_text = f"{source['type']}: {source['value']}"
            combined_content += f"Source {i}: {content_text}\n"
            source_descriptions.append(f"Source {i}: {source['type']} content")

        prompt = f"""
        Create {slide_count} presentation slides in {language} from the following sources.
        Each slide should have:
        - Title
        - Key points (3-5 bullet points)
        - Optional: Image description or table data

        Sources:
        {combined_content[:4000]}  # Limit content length

        After generating the slides, provide the percentage contribution from each source (e.g., {{"source_0": 40.0, "source_1": 60.0}}).

        Format as JSON with structure:
        {{
            "slides": [
                {{
                    "title": "Slide Title",
                    "content": ["Point 1", "Point 2", "Point 3"],
                    "image": "image description or null",
                    "table": {{"headers": ["Col1", "Col2"], "rows": [["data1", "data2"]]}} or null
                }}
            ],
            "source_usage": {{"source_0": 50.0, "source_1": 50.0}}
        }}

        Return only valid JSON, no additional text.
        """

        try:
            response = self.model.generate_content(prompt)
            result = response.text.strip()

            # Clean up response if it has markdown code blocks
            if result.startswith('```json'):
                result = result[7:]
            if result.endswith('```'):
                result = result[:-3]
            result = result.strip()

            # Parse JSON response
            slide_data = json.loads(result)
            # Ensure source_usage is present
            if 'source_usage' not in slide_data:
                # Fallback: equal distribution
                num_sources = len(sources)
                equal_usage = 100.0 / num_sources if num_sources > 0 else 0
                slide_data['source_usage'] = {f"source_{i}": equal_usage for i in range(num_sources)}
            return slide_data

        except Exception as e:
            return {
                "error": str(e),
                "slides": [{
                    "title": "Error Generating Slides",
                    "content": ["Failed to process content", str(e)],
                    "image": None,
                    "table": None
                }]
            }

    def generate_title(self, content: str) -> str:
        """
        Generate a concise title (max 5 words) for the content.

        Args:
            content: Text content to generate title for

        Returns:
            Concise title string (max 5 words)
        """
        prompt = f"""
        Generate a concise title (maximum 5 words) for the following content.
        Focus on the main topic.

        Content: {content[:2000]}  # Limit content length

        Return only the title text, no additional formatting.
        """

        try:
            response = self.model.generate_content(prompt)
            title = response.text.strip()

            # Limit to 10 words with smooth truncation
            words = title.split()
            if len(words) > 10:
                title = ' '.join(words[:10]) + '...'

            return title

        except Exception as e:
            # Fallback to first 10 words of content with ellipsis
            words = content.split()[:10]
            title = ' '.join(words)
            if len(content.split()) > 10:
                title += '...'
            return title

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 ai_agent.py <content_file> [slide_count] [template]")
        sys.exit(1)

    content_file = sys.argv[1]
    slide_count = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    template = sys.argv[3] if len(sys.argv) > 3 else "default"

    # Read content
    with open(content_file, 'r') as f:
        content = f.read()

    # Simulate sources for compatibility
    sources = [{"type": "text", "value": content}]

    # Initialize agent
    agent = AutoSlidesAgent()

    # Generate slides
    result = agent.generate_slides(sources, slide_count, template, "english")

    # Output JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()