#!/usr/bin/env python3
"""
Apply batch 2 wrapper updates to the promotion data in storage.ts
This script updates existing promotions with new wrapper photos and adds new promotions as needed
"""

import json
import re
import os

def load_batch_2_updates():
    """Load the batch 2 processing results"""
    with open('attached_assets/batch_2_wrapper_updates.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def read_storage_file():
    """Read the current storage.ts file"""
    with open('server/storage.ts', 'r', encoding='utf-8') as f:
        return f.read()

def write_storage_file(content):
    """Write the updated storage.ts file"""
    with open('server/storage.ts', 'w', encoding='utf-8') as f:
        f.write(content)

def find_promotion_by_name(content, promotion_name):
    """Find a promotion block in the storage file by name"""
    # Look for promotion with the specified name
    pattern = rf'const\s+\w+:\s*Promotion\s*=\s*\{{[^}}]*name:\s*["\']({re.escape(promotion_name)})["\'][^}}]*\}};'
    match = re.search(pattern, content, re.DOTALL)
    return match

def get_promotion_variable_name(content, promotion_name):
    """Get the variable name for a promotion"""
    pattern = rf'const\s+(\w+):\s*Promotion\s*=\s*\{{[^}}]*name:\s*["\']({re.escape(promotion_name)})["\']'
    match = re.search(pattern, content, re.DOTALL)
    return match.group(1) if match else None

def update_wrapper_photos_in_promotion(content, promotion_name, new_photos):
    """Update wrapper photos for an existing promotion"""
    # Find the promotion definition
    promotion_match = find_promotion_by_name(content, promotion_name)
    if not promotion_match:
        print(f"⚠️  Promotion '{promotion_name}' not found in storage")
        return content
    
    promotion_block = promotion_match.group(0)
    
    # Check if wrapperPhotosUrls exists and update it
    if 'wrapperPhotosUrls:' in promotion_block:
        # Find the existing array or null value
        wrapper_pattern = r'wrapperPhotosUrls:\s*(\[.*?\]|null)'
        wrapper_match = re.search(wrapper_pattern, promotion_block, re.DOTALL)
        
        if wrapper_match:
            existing_value = wrapper_match.group(1)
            if existing_value == 'null':
                # Replace null with new array
                new_array = json.dumps(new_photos, indent=10, ensure_ascii=False)
                new_value = f'wrapperPhotosUrls: {new_array}'
            else:
                # Parse existing array and add new photos
                try:
                    existing_photos = json.loads(existing_value)
                    combined_photos = existing_photos + new_photos
                    # Remove duplicates while preserving order
                    seen = set()
                    unique_photos = []
                    for photo in combined_photos:
                        if photo not in seen:
                            seen.add(photo)
                            unique_photos.append(photo)
                    new_array = json.dumps(unique_photos, indent=10, ensure_ascii=False)
                    new_value = f'wrapperPhotosUrls: {new_array}'
                except:
                    # If parsing fails, just append
                    new_array = json.dumps(new_photos, indent=10, ensure_ascii=False)
                    new_value = f'wrapperPhotosUrls: {new_array}'
            
            # Replace in the promotion block
            updated_block = re.sub(
                r'wrapperPhotosUrls:\s*(\[.*?\]|null)',
                new_value,
                promotion_block,
                flags=re.DOTALL
            )
            
            # Replace the entire promotion block in content
            content = content.replace(promotion_block, updated_block)
            print(f"✓ Updated wrapper photos for '{promotion_name}' with {len(new_photos)} new photos")
        
    return content

def create_new_promotion(brand_variable, promotion_data):
    """Create a new promotion definition"""
    promotion_var = promotion_data['slug'].replace('-', '_').lower()
    
    wrapper_photos = promotion_data.get('wrapper_photos', [])
    wrapper_photos_str = json.dumps(wrapper_photos, indent=10, ensure_ascii=False) if wrapper_photos else 'null'
    
    return f'''
    const {promotion_var}: Promotion = {{
      id: randomUUID(),
      brandId: {brand_variable}.id,
      name: "{promotion_data['name']}",
      slug: "{promotion_data['slug']}",
      description: "{promotion_data['description']}",
      imageUrl: "{promotion_data.get('imageUrl', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300')}",
      startYear: {promotion_data.get('startYear', 2000)},
      endYear: {promotion_data.get('endYear', 2010)},
      category: "{promotion_data['category']}",
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: {wrapper_photos_str},
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      createdAt: new Date(),
    }};
    this.promotions.set({promotion_var}.id, {promotion_var});
'''

def apply_batch_2_updates():
    """Apply all batch 2 wrapper updates to storage.ts"""
    print("🔄 Applying Batch 2 wrapper updates to storage.ts...")
    
    # Load update data
    updates_data = load_batch_2_updates()
    updates = updates_data['updates']
    
    # Read current storage
    content = read_storage_file()
    
    # Group updates by promotion
    promotion_updates = {}
    for update in updates:
        promotion_name = update['promotion']
        if promotion_name not in promotion_updates:
            promotion_updates[promotion_name] = []
        
        # Create wrapper photo URL
        wrapper_url = f"/attached_assets/rotated/{update['rotated_file']}"
        promotion_updates[promotion_name].append(wrapper_url)
    
    print(f"📊 Processing {len(promotion_updates)} promotions with new wrapper photos...")
    
    # Define new promotions that need to be created
    new_promotions = {
        "ChocoShok Gormiti": {
            "name": "ChocoShok Gormiti",
            "slug": "chocoshok-gormiti", 
            "description": "Promoción de ChocoShok con figuras coleccionables de Gormiti, los guardianes de los elementos.",
            "category": "figuras",
            "startYear": 2010,
            "endYear": 2012,
            "brand_variable": "gamesa"
        },
        "ChocoShok Punki Punky": {
            "name": "ChocoShok Punki Punky",
            "slug": "chocoshok-punki-punky",
            "description": "Promoción especial de ChocoShok con elementos de Punki Punky incluidos.",
            "category": "stickers", 
            "startYear": 2010,
            "endYear": 2011,
            "brand_variable": "gamesa"
        },
        "El Chavo Sorpresa": {
            "name": "El Chavo Sorpresa", 
            "slug": "el-chavo-sorpresa",
            "description": "Promoción de sorpresas del Chavo del Ocho con figuras y accesorios coleccionables.",
            "category": "figuras",
            "startYear": 2010,
            "endYear": 2012,
            "brand_variable": "vuala"
        },
        "Vualá Mini Chocos": {
            "name": "Vualá Mini Chocos",
            "slug": "vuala-mini-chocos", 
            "description": "Pequeños croissants de chocolate de Vualá con promociones especiales incluidas.",
            "category": "croissants",
            "startYear": 2008,
            "endYear": 2012,
            "brand_variable": "vuala"
        }
    }
    
    # Apply updates for each promotion
    updated_count = 0
    created_count = 0
    
    for promotion_name, wrapper_photos in promotion_updates.items():
        # Check if this is a new promotion that needs to be created
        if promotion_name in new_promotions:
            # Add wrapper photos to the new promotion data
            new_promotions[promotion_name]['wrapper_photos'] = wrapper_photos
            continue
            
        # Update existing promotion
        original_content = content
        content = update_wrapper_photos_in_promotion(content, promotion_name, wrapper_photos)
        
        if content != original_content:
            updated_count += 1
        else:
            print(f"⚠️  Could not update promotion: {promotion_name}")
    
    # Add new promotions to the file
    for promotion_name, wrapper_photos in promotion_updates.items():
        if promotion_name in new_promotions:
            promo_data = new_promotions[promotion_name]
            promo_data['wrapper_photos'] = wrapper_photos
            
            # Find the end of the vuala brand definition to add after it
            if promo_data['brand_variable'] == 'vuala':
                insert_point = content.find('this.brands.set(vuala.id, vuala);')
                if insert_point != -1:
                    insert_point = content.find('\n', insert_point) + 1
                    new_promotion_code = create_new_promotion('vuala', promo_data)
                    content = content[:insert_point] + new_promotion_code + content[insert_point:]
                    created_count += 1
                    print(f"✓ Created new promotion: {promotion_name}")
            
            elif promo_data['brand_variable'] == 'gamesa':
                insert_point = content.find('this.brands.set(gamesa.id, gamesa);')
                if insert_point != -1:
                    insert_point = content.find('\n', insert_point) + 1
                    new_promotion_code = create_new_promotion('gamesa', promo_data)
                    content = content[:insert_point] + new_promotion_code + content[insert_point:]
                    created_count += 1
                    print(f"✓ Created new promotion: {promotion_name}")
    
    # Write updated content
    write_storage_file(content)
    
    print(f"\n✅ Batch 2 updates applied successfully!")
    print(f"📊 Updated {updated_count} existing promotions")
    print(f"🆕 Created {created_count} new promotions")
    print(f"📋 Total wrapper photos added: {len(updates)}")

if __name__ == "__main__":
    apply_batch_2_updates()