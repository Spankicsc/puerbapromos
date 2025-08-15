#!/usr/bin/env python3
"""
Manually add missing promotions and wrapper photo updates for batch 2
"""

import re

def read_storage_file():
    """Read the current storage.ts file"""
    with open('server/storage.ts', 'r', encoding='utf-8') as f:
        return f.read()

def write_storage_file(content):
    """Write the updated storage.ts file"""
    with open('server/storage.ts', 'w', encoding='utf-8') as f:
        f.write(content)

def add_missing_promotions_and_updates():
    """Add missing promotions and wrapper photo updates"""
    content = read_storage_file()
    
    # Missing promotions to add
    missing_promotions = {
        "Dancemania 2008": {
            "variable": "dancemania2008",
            "brand": "vuala",
            "definition": '''
    const dancemania2008: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Dancemania 2008",
      slug: "dancemania-2008",
      description: "Promoción de Vualá con música y baile, presentando figuras y accesorios inspirados en la cultura dance de finales de los 2000s.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 2008,
      endYear: 2008,
      category: "figuras",
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Dancemania 2008 frontal chocolate_1755219298609_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(dancemania2008.id, dancemania2008);
'''
        },
        "Vualá Croissant": {
            "variable": "vuala_croissant",
            "brand": "vuala", 
            "definition": '''
    const vuala_croissant: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Vualá Croissant",
      slug: "vuala-croissant",
      description: "Una probada de Europa. En 2002, Vualá introdujo al mercado mexicano una línea de croissants inspirados en la repostería europea. Disponibles en sabores vainilla, chocolate y mermelada.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 2002,
      endYear: 2010,
      category: "croissants",
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/IMG_4249-removebg-preview_1755219298607_rotated.png",
        "/attached_assets/rotated/IMG_4302-removebg-preview_1755219298609_rotated.png",
        "/attached_assets/rotated/IMG_4248-removebg-preview_1755219298612_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(vuala_croissant.id, vuala_croissant);
'''
        },
        "The Dog 2004": {
            "variable": "the_dog_2004",
            "brand": "vuala",
            "definition": '''
    const the_dog_2004: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "The Dog 2004", 
      slug: "the-dog-2004",
      description: "Primera aparición de The Dog en México. Colección de figuras y accesorios con perritos de diferentes razas en estilo kawaii, disponible en sabores vainilla y chocolate.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 2004,
      endYear: 2004,
      category: "figuras",
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/IMG_4257-removebg-preview_1755219298607_rotated.png",
        "/attached_assets/rotated/IMG_4269-removebg-preview_1755219298608_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(the_dog_2004.id, the_dog_2004);
'''
        }
    }
    
    # Find insertion point after vuala brand definition
    vuala_brand_end = content.find('this.brands.set(vuala.id, vuala);')
    if vuala_brand_end != -1:
        insertion_point = content.find('\n', vuala_brand_end) + 1
        
        # Add all missing promotions
        for promo_name, promo_data in missing_promotions.items():
            content = content[:insertion_point] + promo_data['definition'] + content[insertion_point:]
            print(f"✓ Added missing promotion: {promo_name}")
    
    # Wrapper photo updates for existing promotions
    wrapper_updates = [
        {
            "promotion": "El Chavo Mini 2015",
            "new_photos": [
                "/attached_assets/rotated/El chavo mini 2015 vainilla_1755219298610_rotated.png",
                "/attached_assets/rotated/El chavo mini chocolate_1755219298610_rotated.png", 
                "/attached_assets/rotated/el chavo mini 2015 vainilla (2)_1755219298610_rotated.png"
            ]
        },
        {
            "promotion": "El Chavo Chavitops",
            "new_photos": [
                "/attached_assets/rotated/el chavo chavitops chocolate_1755219298610_rotated.png"
            ]
        },
        {
            "promotion": "Fonomania 2008", 
            "new_photos": [
                "/attached_assets/rotated/Fonomania 2008 frontal chocolate_1755219298611_rotated.png"
            ]
        },
        {
            "promotion": "Bob Esponja 2012",
            "new_photos": [
                "/attached_assets/rotated/Frontal bob esponja 2012 chocolate_1755219298611_rotated.png"
            ]
        },
        {
            "promotion": "Hora de Aventura 2018",
            "new_photos": [
                "/attached_assets/rotated/Frontal chocolate hora de aventura 2018_1755219298611_rotated.png"
            ]
        },
        {
            "promotion": "Funki Punky Extremo",
            "new_photos": [
                "/attached_assets/rotated/Funki punky extremo chocolate_1755219298611_rotated.png"
            ]
        }
    ]
    
    # Apply wrapper photo updates to existing promotions
    updated_count = 0
    for update in wrapper_updates:
        promotion_name = update["promotion"]
        new_photos = update["new_photos"]
        
        # Find the promotion definition by name
        pattern = rf'(const\s+\w+:\s*Promotion\s*=\s*\{{[^}}]*name:\s*["\']({re.escape(promotion_name)})["\'][^}}]*wrapperPhotosUrls:\s*)(\[[^\]]*\]|null)([^}}]*\}};)'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            before_array = match.group(1)
            existing_array = match.group(3)
            after_array = match.group(4)
            
            if existing_array == 'null':
                # Replace null with new array
                new_array_str = '[\n        "' + '",\n        "'.join(new_photos) + '"\n      ]'
            else:
                # Parse existing array and add new photos
                import json
                try:
                    # Clean the existing array string for parsing
                    clean_array = existing_array.strip()
                    if clean_array.startswith('[') and clean_array.endswith(']'):
                        # Extract photo URLs from the array
                        existing_photos = []
                        for line in clean_array.split('\n'):
                            line = line.strip()
                            if line.startswith('"') and line.endswith('"') or line.endswith('",'):
                                photo_url = line.strip(' ",')
                                if photo_url.startswith('"'):
                                    photo_url = photo_url[1:]
                                if photo_url:
                                    existing_photos.append(photo_url)
                        
                        # Combine with new photos
                        all_photos = existing_photos + new_photos
                        # Remove duplicates while preserving order
                        seen = set()
                        unique_photos = []
                        for photo in all_photos:
                            if photo not in seen:
                                seen.add(photo)
                                unique_photos.append(photo)
                        
                        new_array_str = '[\n        "' + '",\n        "'.join(unique_photos) + '"\n      ]'
                    else:
                        new_array_str = '[\n        "' + '",\n        "'.join(new_photos) + '"\n      ]'
                except:
                    new_array_str = '[\n        "' + '",\n        "'.join(new_photos) + '"\n      ]'
            
            # Replace the entire match with updated version
            new_match = before_array + new_array_str + after_array
            content = content.replace(match.group(0), new_match)
            updated_count += 1
            print(f"✓ Updated wrapper photos for '{promotion_name}' with {len(new_photos)} new photos")
        else:
            print(f"⚠️  Could not find promotion '{promotion_name}' for update")
    
    # Write updated content
    write_storage_file(content)
    
    print(f"\n✅ Manual additions complete!")
    print(f"📊 Added {len(missing_promotions)} missing promotions")
    print(f"📊 Updated {updated_count} existing promotions with wrapper photos")

if __name__ == "__main__":
    add_missing_promotions_and_updates()