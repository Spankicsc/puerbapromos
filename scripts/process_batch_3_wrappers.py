#!/usr/bin/env python3
"""
Process third batch of wrapper images (timestamp 1755219753***)
Rotate images and create organized data structure for database updates.
"""

import json
from PIL import Image
import os

def rotate_image(input_path, output_path, rotation_angle):
    """Rotate image by specified angle and save to output path"""
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            rotated = img.rotate(rotation_angle, expand=True)
            rotated.save(output_path, 'PNG', quality=95)
            print(f"Rotated {input_path} by {rotation_angle}° -> {output_path}")
            return True
    except Exception as e:
        print(f"Error rotating {input_path}: {e}")
        return False

def main():
    # Third batch images (timestamp 1755219753***)
    batch_3_images = [
        # Teen Titans wrappers
        {
            "original": "Teen titans vainilla version 1_1755219753444.png",
            "rotation": 0,  # Correct orientation
            "promotion": "teen-titans",
            "flavor": "vainilla",
            "description": "Envoltorio frontal Vualá Teen Titans sabor vainilla versión 1"
        },
        {
            "original": "Teen titans vainilla version 2_1755219753444.png", 
            "rotation": 0,  # Correct orientation
            "promotion": "teen-titans",
            "flavor": "vainilla",
            "description": "Envoltorio frontal Vualá Teen Titans sabor vainilla versión 2"
        },
        # The Dog series
        {
            "original": "The dog 2004 vainilla frontal_1755219753444.png",
            "rotation": 90,  # Needs rotation to upright
            "promotion": "the-dog-2004",
            "flavor": "vainilla", 
            "description": "Envoltorio frontal Vualá The Dog 2004 sabor vainilla"
        },
        {
            "original": "The dog y the cat 2007 chocolate_1755219753445.png",
            "rotation": 0,  # Correct orientation
            "promotion": "the-dog-y-the-cat-2007",
            "flavor": "chocolate",
            "description": "Envoltorio frontal Vualá The Dog y The Cat 2007 sabor chocolate"
        },
        # Spider-Man
        {
            "original": "Vainilla  frontal spiderman 3_1755219753445.png",
            "rotation": 90,  # Needs rotation to upright
            "promotion": "spiderman-3",
            "flavor": "vainilla",
            "description": "Envoltorio frontal Vualá Spider-Man 3 sabor vainilla"
        },
        # Angry Birds
        {
            "original": "vainilla angry birds GO_1755219753445.png",
            "rotation": 0,  # Correct orientation
            "promotion": "angry-birds-go",
            "flavor": "vainilla",
            "description": "Envoltorio frontal Vualá Angry Birds GO sabor vainilla"
        },
        # SpongeBob 2024
        {
            "original": "Vainilla bob esponja 2024_1755219753445.png",
            "rotation": 0,  # Correct orientation
            "promotion": "bob-esponja-2024",
            "flavor": "vainilla",
            "description": "Envoltorio frontal Vualá Bob Esponja 2024 sabor vainilla"
        },
        # El Fútbol de Huevos
        {
            "original": "Vive el futbol con huevos 2010 frontal chocolate_1755219753446.png",
            "rotation": 0,  # Correct orientation
            "promotion": "vive-el-futbol-con-huevos-2010",
            "flavor": "chocolate",
            "description": "Envoltorio frontal Vualá Vive el Fútbol con Huevos 2010 sabor chocolate"
        },
        # Funki Punky Extremo
        {
            "original": "vainilla funki punky extremo_1755219753446.png",
            "rotation": 0,  # Correct orientation
            "promotion": "funki-punky-extremo",
            "flavor": "vainilla",
            "description": "Envoltorio frontal Vualá Funki Punky Extremo sabor vainilla"
        },
        # Tortugas Ninja
        {
            "original": "vainilla tortugas ninja_1755219753446.png",
            "rotation": 0,  # Correct orientation
            "promotion": "tortugas-ninja-mutantes-adolescentes",
            "flavor": "vainilla",
            "description": "Envoltorio frontal Vualá Tortugas Ninja sabor vainilla"
        },
        # Los Simpson
        {
            "original": "Los simpson 2008 chocolate frontal_1755219753443.png",
            "rotation": 0,  # Correct orientation
            "promotion": "los-simpson-2008",
            "flavor": "chocolate",
            "description": "Envoltorio frontal Vualá Los Simpson 2008 sabor chocolate"
        },
        # Minions
        {
            "original": "minions chocolate_1755219753443.png",
            "rotation": 0,  # Correct orientation
            "promotion": "minions",
            "flavor": "chocolate",
            "description": "Envoltorio frontal Vualá Minions sabor chocolate"
        },
        # Pinki Pow Punks
        {
            "original": "Pinki pow punks funki tubers vainilla 2020_1755219753444.png",
            "rotation": 0,  # Correct orientation
            "promotion": "pinki-pow-punks-funki-tubers-2020",
            "flavor": "vainilla",
            "description": "Envoltorio frontal Vualá Pinki Pow Punks Funki Tubers 2020 sabor vainilla"
        },
        # Tattomania 2003
        {
            "original": "Tattomania 2003 chocolate_1755219753444.png",
            "rotation": 90,  # Needs rotation to upright
            "promotion": "tattomania-2003",
            "flavor": "chocolate",
            "description": "Envoltorio frontal Vualá Tattomania 2003 sabor chocolate"
        }
    ]

    # Create directories
    os.makedirs("attached_assets/rotated", exist_ok=True)
    
    # Process each image
    processed_data = {
        "batch": 3,
        "timestamp": "1755219753",
        "processed_images": [],
        "promotion_updates": {},
        "new_promotions": []
    }
    
    for img_data in batch_3_images:
        original_path = f"attached_assets/{img_data['original']}"
        rotated_filename = img_data['original'].replace('.png', '_rotated.png')
        rotated_path = f"attached_assets/rotated/{rotated_filename}"
        
        # Rotate image if needed
        if img_data['rotation'] != 0:
            success = rotate_image(original_path, rotated_path, img_data['rotation'])
            if success:
                img_data['rotated_path'] = rotated_path
        else:
            # Copy to rotated folder even if no rotation needed for consistency
            try:
                with Image.open(original_path) as img:
                    img.save(rotated_path, 'PNG', quality=95)
                img_data['rotated_path'] = rotated_path
                print(f"Copied {original_path} -> {rotated_path}")
            except Exception as e:
                print(f"Error copying {original_path}: {e}")
        
        processed_data['processed_images'].append(img_data)
        
        # Group by promotion for updates
        promotion_slug = img_data['promotion']
        if promotion_slug not in processed_data['promotion_updates']:
            processed_data['promotion_updates'][promotion_slug] = []
        
        processed_data['promotion_updates'][promotion_slug].append({
            "original_path": original_path,
            "rotated_path": img_data.get('rotated_path'),
            "flavor": img_data['flavor'],
            "description": img_data['description']
        })
    
    # Save processing results
    with open('attached_assets/batch_3_wrapper_updates.json', 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nProcessed {len(batch_3_images)} wrapper images from batch 3")
    print(f"Results saved to: attached_assets/batch_3_wrapper_updates.json")
    
    # Print summary by promotion
    print("\n=== BATCH 3 SUMMARY ===")
    for promotion, wrappers in processed_data['promotion_updates'].items():
        print(f"{promotion}: {len(wrappers)} wrapper(s)")
        for wrapper in wrappers:
            print(f"  - {wrapper['flavor']}: {wrapper['description']}")

if __name__ == "__main__":
    main()