#!/usr/bin/env python3
"""
Apply all wrapper photo updates to server/storage.ts efficiently
"""

import re

def main():
    # Read the current storage file
    with open('server/storage.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Define updates as (promotion_slug, new_wrapper_urls_to_add)
    wrapper_updates = {
        'cartoon-network-2019': [
            '"/attached_assets/rotated/Cartoon network chocolate_1755196507571_rotated.png"',
            '"/attached_assets/rotated/Chocolate Cartoon network_1755196507572_rotated.png"'
        ],
        'ecolokitos-2012': [
            '"/attached_assets/rotated/Cajeta frontal ecolokitos_1755196507570_rotated.png"',
            '"/attached_assets/rotated/Chocolate frontal ecolokitos_1755196507572_rotated.png"'
        ],
        'funki-punky-extremo-2011': [
            '"/attached_assets/rotated/Cajeta funki punky extremo_1755196507570_rotated.png"'
        ],
        'tortugas-ninja-2014': [
            '"/attached_assets/rotated/Cajeta tortugas ninja_1755196507571_rotated.png"'
        ],
        'conexion-alien-2004': [
            '"/attached_assets/rotated/Chocolate conexion alien 2004 frontal_1755196507572_rotated.png"'
        ],
        'spiderman-3-2007': [
            '"/attached_assets/rotated/Chocolate frontal spiderman 3_1755196507572_rotated.png"'
        ],
        'reyes-de-las-olas-2011': [
            '"/attached_assets/rotated/Chocolate frontalreyes de las olas_1755196507573_rotated.png"'
        ],
        'dance-mania-2008': [
            '"/attached_assets/rotated/Dance mania 2008 vainilla frontal_1755196507566_rotated.png"'
        ],
        'askistix-2004': [
            '"/attached_assets/rotated/Askistix 2004 chocolate frontal_1755196507567_rotated.png"'
        ],
        'avengers-2012': [
            '"/attached_assets/rotated/Avengers cajeta_1755196507567_rotated.png"',
            '"/attached_assets/rotated/Avengers vainilla_1755196507568_rotated.png"'
        ]
    }
    
    # Apply updates
    for slug, new_urls in wrapper_updates.items():
        # Find the promotion with this slug
        pattern = rf'(slug: "{slug}".*?wrapperPhotosUrls: \[)(.*?)(\])'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            prefix = match.group(1)
            current_urls = match.group(2)
            suffix = match.group(3)
            
            # If wrapperPhotosUrls is null, initialize it
            if 'null' in current_urls:
                new_urls_str = '\n        ' + ',\n        '.join(new_urls) + '\n      '
            else:
                # Add to existing URLs
                new_urls_str = current_urls.rstrip() + ',\n        ' + ',\n        '.join(new_urls) + '\n      '
            
            replacement = prefix + new_urls_str + suffix
            content = content.replace(match.group(0), replacement)
            print(f"Updated {slug} with {len(new_urls)} new wrapper photos")
        else:
            print(f"Could not find promotion with slug: {slug}")
    
    # Also update imageUrl for promotions that didn't have images
    image_updates = {
        'cartoon-network-2019': '"/attached_assets/rotated/Cartoon network chocolate_1755196507571_rotated.png"',
        'ecolokitos-2012': '"/attached_assets/rotated/Cajeta frontal ecolokitos_1755196507570_rotated.png"',
        'funki-punky-extremo-2011': '"/attached_assets/rotated/Cajeta funki punky extremo_1755196507570_rotated.png"',
        'tortugas-ninja-2014': '"/attached_assets/rotated/Cajeta tortugas ninja_1755196507571_rotated.png"',
        'conexion-alien-2004': '"/attached_assets/rotated/Chocolate conexion alien 2004 frontal_1755196507572_rotated.png"',
        'spiderman-3-2007': '"/attached_assets/rotated/Chocolate frontal spiderman 3_1755196507572_rotated.png"',
        'reyes-de-las-olas-2011': '"/attached_assets/rotated/Chocolate frontalreyes de las olas_1755196507573_rotated.png"',
        'dance-mania-2008': '"/attached_assets/rotated/Dance mania 2008 vainilla frontal_1755196507566_rotated.png"',
        'askistix-2004': '"/attached_assets/rotated/Askistix 2004 chocolate frontal_1755196507567_rotated.png"',
        'avengers-2012': '"/attached_assets/rotated/Avengers cajeta_1755196507567_rotated.png"'
    }
    
    for slug, image_url in image_updates.items():
        # Update imageUrl from null to the new image
        pattern = rf'(slug: "{slug}".*?imageUrl: )null'
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, rf'\1{image_url}', content, flags=re.DOTALL)
            print(f"Updated imageUrl for {slug}")
    
    # Write the updated content back
    with open('server/storage.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\nAll wrapper photo updates applied successfully!")

if __name__ == "__main__":
    main()