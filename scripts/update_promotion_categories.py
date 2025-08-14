#!/usr/bin/env python3
"""
Update promotion categories based on description content analysis
"""

import re

def extract_categories_from_description(description):
    """Extract categories based on keywords in the description"""
    categories = set()
    
    # Normalize description for analysis
    desc_lower = description.lower()
    
    # Category mapping based on keywords
    category_keywords = {
        'stickers': ['sticker', 'stix', 'calcomanías', 'pegajosos'],
        'figuras': ['figura', 'figuras', 'miniatura', 'miniaturas', 'muñeco', 'muñecos'],
        'colgantes': ['colgante', 'colgantes', 'colgar', 'para celular', 'para celulares'],
        'llaveros': ['llavero', 'llaveros', 'chain', 'llaver'],
        'tatuajes': ['tatuaje', 'tatuajes', 'tattoo', 'tattoo mania'],
        'spinners': ['spinner', 'spinners', 'lucha-attacks', 'girando', 'lanzar'],
        'tarjetas': ['tarjeta', 'tarjetas', 'carta', 'cartas'],
        'juguetes': ['juguete', 'juguetes', 'lanzador', 'lanzadiscos', 'juego'],
        'accesorios': ['accesorio', 'accesorios', 'decorativo', 'decorativos'],
        'caps': ['caps', 'cap', 'tapa', 'tapas'],
        'pins': ['pin', 'pins', 'broche', 'broches'],
        'imanes': ['imán', 'imanes', 'magnet', 'magnets'],
        'cupones': ['cupón', 'cupones', 'canjeable', 'canjeables'],
        'gomas': ['goma', 'gomas', 'borrador', 'borradores'],
        'lapices': ['lápiz', 'lápices', 'funki lápices'],
        'laser': ['laser', 'láser', 'holográfico', 'holográficos'],
        'ventosas': ['ventosa', 'ventosas', 'pegatronix', 'mordelones'],
        'navitrones': ['navitrón', 'navitrones', 'nave espacial']
    }
    
    # Check for keywords in description
    for category, keywords in category_keywords.items():
        if any(keyword in desc_lower for keyword in keywords):
            categories.add(category)
    
    # Special rules for complex descriptions
    if 'pokemon' in desc_lower and 'tarjeta' in desc_lower:
        categories.add('tarjetas')
    
    if 'plants vs zombies' in desc_lower or 'pvz' in desc_lower:
        if 'figuras' in desc_lower:
            categories.add('figuras')
        if 'caps' in desc_lower:
            categories.add('caps')
        if 'llavero' in desc_lower:
            categories.add('llaveros')
    
    # Return primary category or comma-separated multiple categories
    if not categories:
        return 'figuras'  # Default fallback
    elif len(categories) == 1:
        return list(categories)[0]
    else:
        # Return comma-separated for multiple categories
        return ','.join(sorted(categories))

def main():
    # Read the current storage file
    with open('server/storage.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract all Vualá promotions and their descriptions
    promotion_pattern = r'const (\w+): Promotion = \{[^}]+brandId: vuala\.id,[^}]+name: "([^"]+)",[^}]+slug: "([^"]+)",[^}]+description: "([^"]+)",[^}]+category: "([^"]+)"'
    
    promotions = re.findall(promotion_pattern, content, re.DOTALL)
    
    updates_made = 0
    
    for var_name, name, slug, description, current_category in promotions:
        # Clean up description (remove newlines and extra spaces)
        clean_description = ' '.join(description.split())
        
        # Get suggested categories
        suggested_categories = extract_categories_from_description(clean_description)
        
        print(f"\n=== {name} ({slug}) ===")
        print(f"Current: {current_category}")
        print(f"Suggested: {suggested_categories}")
        print(f"Description excerpt: {clean_description[:100]}...")
        
        # Update if different and makes sense
        if suggested_categories != current_category:
            # Replace the category in the content
            old_pattern = f'(const {var_name}: Promotion = \\{{[^}}]+category: )"{current_category}"'
            new_replacement = f'\\1"{suggested_categories}"'
            
            if re.search(old_pattern, content, re.DOTALL):
                content = re.sub(old_pattern, new_replacement, content, flags=re.DOTALL)
                updates_made += 1
                print(f"✓ Updated category to: {suggested_categories}")
            else:
                print(f"✗ Could not find pattern to update")
    
    # Write the updated content back
    if updates_made > 0:
        with open('server/storage.ts', 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"\n✓ Applied {updates_made} category updates!")
    else:
        print("\n• No updates needed - all categories are appropriate")

if __name__ == "__main__":
    main()