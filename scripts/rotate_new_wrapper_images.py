#!/usr/bin/env python3
"""
Script to rotate new Vualá wrapper images 90 degrees to the right
These images already have transparent backgrounds removed
"""

import os
from PIL import Image

def rotate_image_90_right(image_path, output_path):
    """Rotate image 90 degrees clockwise (to the right)"""
    try:
        with Image.open(image_path) as img:
            # Rotate 90 degrees clockwise (negative 90 degrees)
            rotated = img.rotate(-90, expand=True)
            rotated.save(output_path, 'PNG')
            print(f"Rotated right: {image_path} -> {output_path}")
            return True
    except Exception as e:
        print(f"Error rotating {image_path}: {e}")
        return False

def process_new_wrapper_images():
    """Process all new wrapper images"""
    
    input_dir = "attached_assets"
    output_dir = "attached_assets/rotated"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # List of new wrapper image files
    new_wrapper_images = [
        "Chocolate frontal spiderman 3_1755148526399.png",
        "Askistix 2004 chocolate frontal_1755148526400.png",
        "Avengers cajeta_1755148526400.png",
        "Avengers vainilla_1755148526400.png",
        "bob espona en movimiento 2009 frontal cajeta_1755148526401.png",
        "Bob esponja 2012 Cajeta frontal_1755148526401.png",
        "Bob esponja 2012 vainilla frontal_1755148526401.png",
        "bob esponja 2024 cajeta frontal_1755148526401.png",
        "Bob esponja 2024 piña frontal_1755148526402.png",
        "Cajeta angry birds Go_1755148526402.png",
        "Cajeta frontal ecolokitos_1755148526402.png",
        "Cajeta funki punky extremo_1755148526402.png",
        "Cajeta tortugas ninja_1755148526403.png",
        "Cartoon network chocolate_1755148526403.png",
        "Chocolate angry birds Go_1755148526403.png",
        "Chocolate Cartoon network_1755148526404.png",
        "Chocolate conexion alien 2004 frontal_1755148526404.png",
        "Chocolate frontal ecolokitos_1755148526404.png"
    ]
    
    print(f"Processing {len(new_wrapper_images)} new wrapper images...")
    print("=" * 50)
    
    for image_file in new_wrapper_images:
        input_path = os.path.join(input_dir, image_file)
        
        if not os.path.exists(input_path):
            print(f"Warning: {input_path} not found, skipping...")
            continue
            
        # Determine output filename
        name, ext = os.path.splitext(image_file)
        output_path = os.path.join(output_dir, f"{name}_rotated.png")
        
        # Rotate image 90 degrees to the right
        success = rotate_image_90_right(input_path, output_path)
        
        if success:
            print(f"  ✅ Successfully rotated: {image_file}")
        else:
            print(f"  ❌ Failed to rotate: {image_file}")
    
    print("=" * 50)
    print("Rotation complete!")
    print(f"Rotated images saved in: {output_dir}")

if __name__ == "__main__":
    print("New Vualá Wrapper Image Rotator")
    print("=" * 50)
    process_new_wrapper_images()