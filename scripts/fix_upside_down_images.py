#!/usr/bin/env python3

import os
from PIL import Image

# List of images that need to be rotated 180 degrees (upside down)
upside_down_images = [
    "../attached_assets/rotated/Chocolate frontal spiderman 3_1755148526399_rotated.png",
    "../attached_assets/rotated/Chocolate conexion alien 2004 frontal_1755148526404_rotated.png",
    "../attached_assets/rotated/Askistix 2004 chocolate frontal_1755148526400_rotated.png"
]

def fix_upside_down_images():
    for image_path in upside_down_images:
        if os.path.exists(image_path):
            try:
                print(f"Rotating {image_path} 180 degrees...")
                
                # Open the image
                img = Image.open(image_path)
                
                # Rotate 180 degrees to fix upside down orientation
                rotated_img = img.rotate(180, expand=True)
                
                # Save the corrected image
                rotated_img.save(image_path, format='PNG', optimize=True)
                print(f"✓ Fixed {image_path}")
                
            except Exception as e:
                print(f"✗ Error processing {image_path}: {str(e)}")
        else:
            print(f"✗ File not found: {image_path}")

if __name__ == "__main__":
    fix_upside_down_images()
    print("Done fixing upside down images!")