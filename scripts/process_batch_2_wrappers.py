#!/usr/bin/env python3
"""
Process batch 2 of wrapper photos (20 new images with timestamp 1755219298***)
Rotate, organize, and prepare JSON updates for integration
"""

import json
import os
from PIL import Image
import shutil

# Mapping of new images to promotions, flavors, and rotations needed
NEW_WRAPPER_MAPPING = {
    # El Chavo promotions
    "El chavo mini 2015 vainilla_1755219298610.png": {
        "promotion": "El Chavo Mini 2015",
        "flavor": "vainilla",
        "rotation": 0,  # Already properly oriented
        "filename": "el_chavo_mini_2015_vainilla_v3.png"
    },
    "El chavo mini chocolate_1755219298610.png": {
        "promotion": "El Chavo Mini 2015", 
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "el_chavo_mini_2015_chocolate_v3.png"
    },
    "el chavo chavitops chocolate_1755219298610.png": {
        "promotion": "El Chavo Chavitops",
        "flavor": "chocolate", 
        "rotation": 0,
        "filename": "el_chavo_chavitops_chocolate_v2.png"
    },
    "el chavo mini 2015 vainilla (2)_1755219298610.png": {
        "promotion": "El Chavo Mini 2015",
        "flavor": "vainilla",
        "rotation": 0,
        "filename": "el_chavo_mini_2015_vainilla_v4.png"
    },
    
    # Music/Dance promotions
    "Fonomania 2008 frontal chocolate_1755219298611.png": {
        "promotion": "Fonomania 2008",
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "fonomania_2008_chocolate_v2.png"
    },
    "Dancemania 2008 frontal chocolate_1755219298609.png": {
        "promotion": "Dancemania 2008",
        "flavor": "chocolate", 
        "rotation": 0,
        "filename": "dancemania_2008_chocolate_v2.png"
    },
    
    # Cartoon Network promotions
    "Frontal bob esponja 2012 chocolate_1755219298611.png": {
        "promotion": "Bob Esponja 2012",
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "bob_esponja_2012_chocolate_v2.png"
    },
    "Frontal chocolate hora de aventura 2018_1755219298611.png": {
        "promotion": "Hora de Aventura 2018",
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "hora_aventura_2018_chocolate_v2.png"
    },
    
    # Funki Punky
    "Funki punky extremo chocolate_1755219298611.png": {
        "promotion": "Funki Punky Extremo",
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "funki_punky_extremo_chocolate_v2.png"
    },
    
    # Vualá Croissant promotions  
    "IMG_4249-removebg-preview_1755219298607.png": {
        "promotion": "Vualá Croissant",
        "flavor": "vainilla",
        "rotation": 0,
        "filename": "vuala_croissant_vainilla_v2.png"
    },
    "IMG_4302-removebg-preview_1755219298609.png": {
        "promotion": "Vualá Croissant", 
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "vuala_croissant_chocolate_v2.png"
    },
    "IMG_4248-removebg-preview_1755219298612.png": {
        "promotion": "Vualá Croissant",
        "flavor": "mermelada",
        "rotation": 0,
        "filename": "vuala_croissant_mermelada.png"
    },
    
    # Vualá The Dog promotions
    "IMG_4257-removebg-preview_1755219298607.png": {
        "promotion": "The Dog 2004",
        "flavor": "vainilla",
        "rotation": 0,
        "filename": "the_dog_2004_vainilla_v2.png"
    },
    "IMG_4269-removebg-preview_1755219298608.png": {
        "promotion": "The Dog 2004",
        "flavor": "chocolate", 
        "rotation": 0,
        "filename": "the_dog_2004_chocolate.png"
    },
    
    # Vualá Mini Chocos
    "IMG_4303-removebg-preview_1755219298609.png": {
        "promotion": "Vualá Mini Chocos",
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "vuala_mini_chocos_chocolate.png"
    },
    
    # ChocoShok Gormiti
    "IMG_4298-removebg-preview_1755219298608.png": {
        "promotion": "ChocoShok Gormiti",
        "flavor": "vainilla",
        "rotation": 0,
        "filename": "chocoshok_gormiti_vainilla.png"
    },
    "IMG_4299-removebg-preview_1755219298608.png": {
        "promotion": "ChocoShok Gormiti", 
        "flavor": "vainilla",
        "rotation": 0,
        "filename": "chocoshok_gormiti_vainilla_v2.png"
    },
    "IMG_4300-removebg-preview_1755219298608.png": {
        "promotion": "ChocoShok Gormiti",
        "flavor": "vainilla",
        "rotation": 0,
        "filename": "chocoshok_gormiti_vainilla_v3.png"
    },
    
    # ChocoShok Punki Punky
    "IMG_4301-removebg-preview (1)_1755219298609.png": {
        "promotion": "ChocoShok Punki Punky",
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "chocoshok_punki_punky_chocolate.png"
    },
    
    # El Chavo Sorpresa
    "IMG_4296-removebg-preview_1755219298608.png": {
        "promotion": "El Chavo Sorpresa",
        "flavor": "chocolate",
        "rotation": 0,
        "filename": "el_chavo_sorpresa_chocolate.png"
    }
}

def rotate_image(input_path, output_path, rotation_degrees):
    """Rotate image by specified degrees"""
    try:
        with Image.open(input_path) as img:
            if rotation_degrees != 0:
                # Convert to RGBA to preserve transparency
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')
                rotated = img.rotate(rotation_degrees, expand=True)
                rotated.save(output_path, 'PNG')
                print(f"✓ Rotated {os.path.basename(input_path)} by {rotation_degrees}°")
            else:
                # Copy without rotation
                shutil.copy2(input_path, output_path)
                print(f"✓ Copied {os.path.basename(input_path)} (no rotation needed)")
        return True
    except Exception as e:
        print(f"✗ Error processing {input_path}: {e}")
        return False

def process_batch_2_wrappers():
    """Process all batch 2 wrapper photos"""
    base_dir = "attached_assets"
    rotated_dir = os.path.join(base_dir, "rotated")
    
    # Ensure rotated directory exists
    os.makedirs(rotated_dir, exist_ok=True)
    
    processed_count = 0
    updates = []
    
    print("🔄 Processing Batch 2 wrapper photos...")
    print(f"Found {len(NEW_WRAPPER_MAPPING)} new wrapper images to process\n")
    
    for original_filename, mapping in NEW_WRAPPER_MAPPING.items():
        input_path = os.path.join(base_dir, original_filename)
        
        if not os.path.exists(input_path):
            print(f"⚠️  File not found: {original_filename}")
            continue
            
        # Create rotated filename
        rotated_filename = f"{os.path.splitext(original_filename)[0]}_rotated.png"
        output_path = os.path.join(rotated_dir, rotated_filename)
        
        # Rotate image
        if rotate_image(input_path, output_path, mapping["rotation"]):
            processed_count += 1
            
            # Create update entry
            update_entry = {
                "original_file": original_filename,
                "rotated_file": rotated_filename,
                "promotion": mapping["promotion"],
                "flavor": mapping["flavor"],
                "target_filename": mapping["filename"],
                "description": f"Wrapper del sabor {mapping['flavor']}"
            }
            updates.append(update_entry)
            
            print(f"   → {mapping['promotion']} ({mapping['flavor']})")
    
    # Save processing results
    results_file = os.path.join(base_dir, "batch_2_wrapper_updates.json")
    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump({
            "batch": 2,
            "processed_date": "2024-08-15",
            "total_processed": processed_count,
            "updates": updates
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Batch 2 processing complete!")
    print(f"📊 Processed: {processed_count}/{len(NEW_WRAPPER_MAPPING)} images")
    print(f"📋 Results saved to: {results_file}")
    
    return updates

if __name__ == "__main__":
    process_batch_2_wrappers()