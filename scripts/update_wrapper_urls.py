#!/usr/bin/env python3
"""
Update promotion wrapper URLs with newly processed images
"""

import json
import re
from pathlib import Path

def load_wrapper_data():
    """Load the organized wrapper data"""
    wrapper_json_path = Path("attached_assets/vuala_wrappers_organized.json")
    if wrapper_json_path.exists():
        with open(wrapper_json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def generate_promotion_updates():
    """Generate the wrapper URL updates for server/storage.ts"""
    wrapper_data = load_wrapper_data()
    updates = []
    
    for promotion_name, data in wrapper_data.items():
        if 'images' in data and data['images']:
            # Get all wrapper photos for this promotion
            wrapper_urls = []
            for image in data['images']:
                if 'rotated_path' in image:
                    wrapper_urls.append(image['rotated_path'])
                else:
                    wrapper_urls.append(image['path'])
            
            # Remove duplicates while preserving order
            seen = set()
            unique_urls = []
            for url in wrapper_urls:
                if url not in seen:
                    seen.add(url)
                    unique_urls.append(url)
            
            if unique_urls:
                updates.append({
                    'promotion': promotion_name,
                    'wrapper_urls': unique_urls,
                    'total_images': len(unique_urls)
                })
    
    return updates

def main():
    """Generate wrapper URL updates"""
    updates = generate_promotion_updates()
    
    print("=== WRAPPER PHOTO UPDATES FOR PROMOTIONS ===\n")
    
    for update in updates:
        print(f"// {update['promotion']} - {update['total_images']} wrapper photos")
        print(f"wrapperPhotosUrls: [")
        for url in update['wrapper_urls']:
            print(f'  "{url}",')
        print("],\n")
    
    print("\n=== SUMMARY ===")
    print(f"Total promotions with wrapper photos: {len(updates)}")
    for update in updates:
        print(f"- {update['promotion']}: {update['total_images']} photos")

if __name__ == "__main__":
    main()