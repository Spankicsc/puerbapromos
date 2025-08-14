#!/usr/bin/env python3
"""
Process new Vualá wrapper photos: rotate, classify, and organize them
"""

import json
import os
import re
from PIL import Image
from pathlib import Path

def extract_info_from_filename(filename):
    """Extract promotion name, flavor, and side from filename"""
    filename_lower = filename.lower()
    
    # Extract flavor
    flavor = "Unknown"
    if "chocolate" in filename_lower:
        flavor = "Chocolate"
    elif "cajeta" in filename_lower:
        flavor = "Cajeta"
    elif "vainilla" in filename_lower:
        flavor = "Vainilla"
    elif "piña" in filename_lower:
        flavor = "Piña"
    
    # Extract side
    side = "Frontal"
    if "trasera" in filename_lower:
        side = "Trasera"
    elif "lateral" in filename_lower:
        side = "Lateral"
    elif "frontal" in filename_lower:
        side = "Frontal"
    
    # Extract promotion name and year
    promotion_map = {
        "askistix": ("Askistix", "2004"),
        "avengers": ("Avengers", "2012"),
        "bob esponja 2012": ("Bob Esponja", "2012"),
        "bob esponja 2024": ("Bob Esponja 25 Años", "2024"),
        "angry birds go": ("Angry Birds Go", "2014"),
        "ecolokitos": ("Ecolokitos", "2012"),
        "funki punky extremo": ("Funki Punky Extremo", "2011"),
        "tortugas ninja": ("Tortugas Ninja", "2014"),
        "cartoon network": ("Cartoon Network", "2019"),
        "conexion alien": ("Conexión Alien", "2004"),
        "spiderman 3": ("Spiderman 3", "2007"),
        "reyes de las olas": ("Reyes de las Olas", "2011"),
        "dance mania": ("Dance Mania", "2008"),
        "dancemania": ("Dance Mania", "2008")
    }
    
    promotion_name = "Unknown"
    year = "Unknown"
    
    for key, (name, yr) in promotion_map.items():
        if key in filename_lower:
            promotion_name = name
            year = yr
            break
    
    return {
        "promotion": promotion_name,
        "year": year,
        "flavor": flavor,
        "side": side
    }

def rotate_image_if_needed(image_path, output_path):
    """Rotate image based on orientation and save to output path"""
    try:
        with Image.open(image_path) as img:
            # Get image dimensions
            width, height = img.size
            
            # Check if image needs rotation (sideways = width < height)
            if width < height:
                # Rotate 90 degrees clockwise for new images
                img_rotated = img.rotate(-90, expand=True)
            else:
                # Keep as is for landscape images
                img_rotated = img
            
            # Save the rotated image
            img_rotated.save(output_path, quality=95)
            return True
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return False

def main():
    # Get all files with timestamp _1755196507570 and newer (the 20 new files)
    attached_assets_dir = Path("attached_assets")
    new_files = []
    
    # Find files with the newer timestamps
    for file_path in attached_assets_dir.glob("*_1755196507*.png"):
        if file_path.is_file():
            new_files.append(file_path)
    
    print(f"Found {len(new_files)} new wrapper photos to process")
    
    # Load existing wrapper organization
    wrapper_json_path = attached_assets_dir / "vuala_wrappers_organized.json"
    if wrapper_json_path.exists():
        with open(wrapper_json_path, 'r', encoding='utf-8') as f:
            wrapper_data = json.load(f)
    else:
        wrapper_data = {}
    
    # Create rotated directory if it doesn't exist
    rotated_dir = attached_assets_dir / "rotated"
    rotated_dir.mkdir(exist_ok=True)
    
    processed_count = 0
    
    for file_path in new_files:
        print(f"Processing: {file_path.name}")
        
        # Extract information from filename
        info = extract_info_from_filename(file_path.name)
        
        # Create rotated image
        rotated_filename = file_path.stem + "_rotated.png"
        rotated_path = rotated_dir / rotated_filename
        
        if rotate_image_if_needed(file_path, rotated_path):
            print(f"  - Rotated and saved to: {rotated_path}")
            
            # Add to wrapper organization
            promotion_name = info["promotion"]
            if promotion_name != "Unknown":
                if promotion_name not in wrapper_data:
                    wrapper_data[promotion_name] = {
                        "name": promotion_name,
                        "year": info["year"],
                        "flavors": {},
                        "images": []
                    }
                
                # Add to flavors
                flavor = info["flavor"]
                if flavor not in wrapper_data[promotion_name]["flavors"]:
                    wrapper_data[promotion_name]["flavors"][flavor] = []
                
                # Create wrapper entry
                wrapper_entry = {
                    "filename": file_path.name,
                    "side": info["side"],
                    "flavor": flavor,
                    "year": info["year"],
                    "path": f"/attached_assets/{file_path.name}",
                    "rotated_path": f"/attached_assets/rotated/{rotated_filename}"
                }
                
                # Add to both flavors and images arrays
                wrapper_data[promotion_name]["flavors"][flavor].append(wrapper_entry)
                wrapper_data[promotion_name]["images"].append(wrapper_entry)
                
                print(f"  - Added to {promotion_name} collection as {flavor} {info['side']}")
                processed_count += 1
            else:
                print(f"  - Could not identify promotion for {file_path.name}")
    
    # Save updated wrapper organization
    with open(wrapper_json_path, 'w', encoding='utf-8') as f:
        json.dump(wrapper_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nProcessed {processed_count} wrapper photos successfully!")
    print(f"Updated wrapper organization saved to: {wrapper_json_path}")

if __name__ == "__main__":
    main()