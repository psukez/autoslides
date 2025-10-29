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

    def generate_slides(self, content: str, slide_count: int = 5, template: str = "default", language: str = "english") -> Dict[str, Any]:
        """
        Generate structured slide data from content.

        Args:
            content: Raw text content
            slide_count: Number of slides to generate
            template: Slide template style

        Returns:
            Dict containing slides with text, images, tables
        """
        prompt = f"""
        Create {slide_count} presentation slides in {language} from the following content.
        Each slide should have:
        - Title
        - Key points (3-5 bullet points)
        - Optional: Image description or table data

        Content: {content[:4000]}  # Limit content length

        Format as JSON with structure:
        {{
            "slides": [
                {{
                    "title": "Slide Title",
                    "content": ["Point 1", "Point 2", "Point 3"],
                    "image": "image description or null",
                    "table": {{"headers": ["Col1", "Col2"], "rows": [["data1", "data2"]]}} or null
                }}
            ]
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

    def generate_summary(self, content: str, max_length: int = 50) -> str:
        """
        Generate a brief summary of the content.

        Args:
            content: Text content to summarize
            max_length: Maximum length of summary

        Returns:
            Brief summary string
        """
        prompt = f"""
        Summarize the following text in a brief, concise manner (max {max_length} characters).
        Focus on the main topic and key points.

        Text: {content[:2000]}  # Limit content length

        Return only the summary text, no additional formatting.
        """

        try:
            response = self.model.generate_content(prompt)
            summary = response.text.strip()

            # Truncate if too long
            if len(summary) > max_length:
                summary = summary[:max_length - 3] + "..."

            return summary

        except Exception as e:
            # Fallback to simple truncation
            truncated = content[:max_length - 3] + "..." if len(content) > max_length else content
            return truncated

def main():
    if len(sys.argv) < 2:
        print("Usage: python ai_agent.py <content_file> [slide_count] [template]")
        sys.exit(1)

    content_file = sys.argv[1]
    slide_count = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    template = sys.argv[3] if len(sys.argv) > 3 else "default"

    # Read content
    with open(content_file, 'r') as f:
        content = f.read()

    # Initialize agent
    agent = AutoSlidesAgent()

    # Generate slides
    result = agent.generate_slides(content, slide_count, template)

    # Output JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()