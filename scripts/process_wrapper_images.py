#!/usr/bin/env python3
"""
Script to process Vualá wrapper images:
1. Rotate sideways images 90 degrees upward
2. Remove backgrounds from all wrapper images using remove.bg API
3. Save processed images with "_processed" suffix
"""

import os
import sys
import requests
import json
from PIL import Image, ImageOps
import time

# Free background removal API - remove.bg
REMOVE_BG_API_KEY = None  # Will need user to provide API key

def get_image_orientation(image_path):
    """Determine if image needs rotation based on dimensions"""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            # If width > height, image is landscape (sideways)
            # Most wrapper photos should be portrait (height > width)
            if width > height:
                return "landscape"  # Needs rotation
            else:
                return "portrait"   # Correct orientation
    except Exception as e:
        print(f"Error checking orientation for {image_path}: {e}")
        return "unknown"

def rotate_image_90_degrees(image_path, output_path):
    """Rotate image 90 degrees counterclockwise (upward)"""
    try:
        with Image.open(image_path) as img:
            # Rotate 90 degrees counterclockwise to make sideways images upright
            rotated = img.rotate(90, expand=True)
            rotated.save(output_path, quality=95)
            print(f"Rotated: {image_path} -> {output_path}")
            return True
    except Exception as e:
        print(f"Error rotating {image_path}: {e}")
        return False

def remove_background_local(image_path, output_path):
    """Remove background using simple edge detection (fallback method)"""
    try:
        with Image.open(image_path) as img:
            # Convert to RGBA if not already
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # For now, just copy the image as-is since we need a proper background removal service
            # This is a placeholder - we'll need the user to provide remove.bg API key for proper background removal
            img.save(output_path, 'PNG')
            print(f"Processed (no bg removal): {image_path} -> {output_path}")
            return True
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return False

def remove_background_with_api(image_path, output_path, api_key):
    """Remove background using remove.bg API"""
    try:
        with open(image_path, 'rb') as image_file:
            response = requests.post(
                'https://api.remove.bg/v1.0/removebg',
                files={'image_file': image_file},
                data={'size': 'auto'},
                headers={'X-Api-Key': api_key},
                timeout=30
            )
        
        if response.status_code == 200:
            with open(output_path, 'wb') as out_file:
                out_file.write(response.content)
            print(f"Background removed: {image_path} -> {output_path}")
            return True
        else:
            print(f"API Error for {image_path}: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Error removing background for {image_path}: {e}")
        return False

def process_wrapper_images():
    """Main function to process all wrapper images"""
    
    # Define paths
    input_dir = "attached_assets"
    output_dir = "attached_assets/processed"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # List of wrapper image files from our database
    wrapper_images = [
        "El chavo 2012 Trasera cajeta_1755145664203.JPG",
        "Frontal cajeta looney tunes 2009_1755145664204.JPG",
        "trasera vainilla angry birds go_1755145664056.JPG",
        "Trasera Bob esponja 2012_1755145664205.JPG",
        "Ecoinvasores trasera cajeta_1755145664202.JPG",
        "trasera chocolate steven universe_1755145664206.JPG",
        "Trasera chocolate cartoon network 2018_1755145664206.JPG",
        "Trasera corazones 2017 chocolate_1755145664206.JPG",
        "Trasera la era del hielo 2012 chocolate_1755145664207.JPG",
        "trasera cajeta funki punky xtremo 2011_1755145664205.JPG",
        "Trasera cajeta rebeldes con causa funky punki_1755145664206.JPG"
    ]
    
    print(f"Processing {len(wrapper_images)} wrapper images...")
    print("=" * 50)
    
    for image_file in wrapper_images:
        input_path = os.path.join(input_dir, image_file)
        
        if not os.path.exists(input_path):
            print(f"Warning: {input_path} not found, skipping...")
            continue
            
        # Check orientation
        orientation = get_image_orientation(input_path)
        print(f"Processing: {image_file} (orientation: {orientation})")
        
        # Determine output filename
        name, ext = os.path.splitext(image_file)
        temp_path = os.path.join(output_dir, f"{name}_temp{ext}")
        final_path = os.path.join(output_dir, f"{name}_processed.png")
        
        # Step 1: Rotate if needed
        if orientation == "landscape":
            print(f"  -> Rotating {image_file} 90 degrees...")
            if rotate_image_90_degrees(input_path, temp_path):
                process_path = temp_path
            else:
                process_path = input_path
        else:
            process_path = input_path
        
        # Step 2: Remove background
        print(f"  -> Removing background from {image_file}...")
        if REMOVE_BG_API_KEY:
            success = remove_background_with_api(process_path, final_path, REMOVE_BG_API_KEY)
        else:
            success = remove_background_local(process_path, final_path)
        
        # Clean up temp file
        if os.path.exists(temp_path) and temp_path != input_path:
            os.remove(temp_path)
        
        if success:
            print(f"  ✅ Successfully processed: {final_path}")
        else:
            print(f"  ❌ Failed to process: {image_file}")
        
        print()
        
        # Rate limiting for API calls
        if REMOVE_BG_API_KEY:
            time.sleep(1)  # 1 second delay between API calls
    
    print("=" * 50)
    print("Processing complete!")
    print("\nProcessed images are saved in: attached_assets/processed/")
    print("\nTo use proper background removal:")
    print("1. Get a free API key from https://www.remove.bg/")
    print("2. Set REMOVE_BG_API_KEY in this script")
    print("3. Run the script again")

if __name__ == "__main__":
    print("Vualá Wrapper Image Processor")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--with-api":
        # User can provide API key as command line argument
        if len(sys.argv) > 2:
            REMOVE_BG_API_KEY = sys.argv[2]
            print(f"Using remove.bg API key: {REMOVE_BG_API_KEY[:8]}...")
        else:
            print("Error: --with-api requires API key as second argument")
            sys.exit(1)
    
    process_wrapper_images()