#!/usr/bin/env python3
"""
Apply batch 3 wrapper updates to storage.ts
Updates existing promotions and creates new ones as needed.
"""

import re

def update_storage_file():
    with open('server/storage.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Add imports for new wrapper images at the top after other imports
    new_imports = '''
import teenTitansVainilla1 from "@assets/rotated/Teen titans vainilla version 1_1755219753444_rotated.png";
import teenTitansVainilla2 from "@assets/rotated/Teen titans vainilla version 2_1755219753444_rotated.png";
import theDog2004Vainilla from "@assets/rotated/The dog 2004 vainilla frontal_1755219753444_rotated.png";
import theDogCat2007Chocolate from "@assets/rotated/The dog y the cat 2007 chocolate_1755219753445_rotated.png";
import spidermanVainilla from "@assets/rotated/Vainilla  frontal spiderman 3_1755219753445_rotated.png";
import angryBirdsVainilla from "@assets/rotated/vainilla angry birds GO_1755219753445_rotated.png";
import bobEsponja2024Vainilla from "@assets/rotated/Vainilla bob esponja 2024_1755219753445_rotated.png";
import futbolHuevosChocolate from "@assets/rotated/Vive el futbol con huevos 2010 frontal chocolate_1755219753446_rotated.png";
import funkiPunkyVainilla from "@assets/rotated/vainilla funki punky extremo_1755219753446_rotated.png";
import tortugasNinjaVainilla from "@assets/rotated/vainilla tortugas ninja_1755219753446_rotated.png";
import simpsonsChocolate from "@assets/rotated/Los simpson 2008 chocolate frontal_1755219753443_rotated.png";
import minionsChocolate from "@assets/rotated/minions chocolate_1755219753443_rotated.png";
import pinkiPowPunksVainilla from "@assets/rotated/Pinki pow punks funki tubers vainilla 2020_1755219753444_rotated.png";
import tattomaniaChocolate from "@assets/rotated/Tattomania 2003 chocolate_1755219753444_rotated.png";
'''

    # Find the last import and add new imports
    last_import_match = re.search(r'(import [^;]+;)\n', content)
    if last_import_match:
        insert_pos = last_import_match.end()
        content = content[:insert_pos] + new_imports + content[insert_pos:]

    # 1. Update Teen Titans GO 2020 (existing promotion)
    teen_titans_pattern = r'(const teen_titans_go_2020: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    teen_titans_replacement = r'\1\2,\n        teenTitansVainilla1,\n        teenTitansVainilla2\3'
    content = re.sub(teen_titans_pattern, teen_titans_replacement, content, flags=re.DOTALL)

    # 2. Update Spider-Man 3 2007 (existing promotion)
    spiderman_pattern = r'(const spiderman_3_2007: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    spiderman_replacement = r'\1\2,\n        spidermanVainilla\3'
    content = re.sub(spiderman_pattern, spiderman_replacement, content, flags=re.DOTALL)

    # 3. Update Angry Birds GO (existing promotion)
    angry_birds_pattern = r'(const angry_birds_go_2014: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    angry_birds_replacement = r'\1\2,\n        angryBirdsVainilla\3'
    content = re.sub(angry_birds_pattern, angry_birds_replacement, content, flags=re.DOTALL)

    # 4. Update Bob Esponja 2024 Enhanced (existing promotion)
    bob_esponja_pattern = r'(const bob_esponja_2024_enhanced: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    bob_esponja_replacement = r'\1\2,\n        bobEsponja2024Vainilla\3'
    content = re.sub(bob_esponja_pattern, bob_esponja_replacement, content, flags=re.DOTALL)

    # 5. Update Funki Punky Extremo (existing promotion)
    funki_punky_pattern = r'(const funki_punky_extremo_chocolate: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    funki_punky_replacement = r'\1\2,\n        funkiPunkyVainilla\3'
    content = re.sub(funki_punky_pattern, funki_punky_replacement, content, flags=re.DOTALL)

    # 6. Update Tortugas Ninja 2014 (existing promotion)
    tortugas_pattern = r'(const tortugas_ninja_2014: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    tortugas_replacement = r'\1\2,\n        tortugasNinjaVainilla\3'
    content = re.sub(tortugas_pattern, tortugas_replacement, content, flags=re.DOTALL)

    # 7. Update Los Simpson 2008 (existing promotion)
    simpson_pattern = r'(const simpsons_2008: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    simpson_replacement = r'\1\2,\n        simpsonsChocolate\3'
    content = re.sub(simpson_pattern, simpson_replacement, content, flags=re.DOTALL)

    # 8. Update Minions (existing promotion)
    minions_pattern = r'(const minions: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    minions_replacement = r'\1\2,\n        minionsChocolate\3'
    content = re.sub(minions_pattern, minions_replacement, content, flags=re.DOTALL)

    # 9. Update Tattomania 2003 (existing promotion)
    tattomania_pattern = r'(const tattomania_2003: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    tattomania_replacement = r'\1\2,\n        tattomaniaChocolate\3'
    content = re.sub(tattomania_pattern, tattomania_replacement, content, flags=re.DOTALL)

    # Now add NEW promotions that don't exist yet
    new_promotions = '''
    const the_dog_y_the_cat_2007: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "The Dog y The Cat 2007",
      slug: "the-dog-y-the-cat-2007",
      description: "Promoción de Vualá inspirada en la serie fotográfica 'The Dog' y 'The Cat', presentando adorables imágenes de perros y gatos en productos de panadería.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 2007,
      endYear: 2008,
      category: "fotografía",
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        theDogCat2007Chocolate
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(the_dog_y_the_cat_2007.id, the_dog_y_the_cat_2007);

    const vive_el_futbol_con_huevos_2010: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Vive el Fútbol con Huevos 2010",
      slug: "vive-el-futbol-con-huevos-2010",
      description: "Promoción de Vualá basada en la película 'El Libro de la Vida' y 'Huevos: Little Rooster's Egg-cellent Adventure', combinando fútbol con humor mexicano.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 2010,
      endYear: 2011,
      category: "películas",
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        futbolHuevosChocolate
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(vive_el_futbol_con_huevos_2010.id, vive_el_futbol_con_huevos_2010);

    const pinki_pow_punks_funki_tubers_2020: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Pinki Pow Punks Funki Tubers 2020",
      slug: "pinki-pow-punks-funki-tubers-2020",
      description: "Promoción moderna de Vualá combinando la estética Funki Punky con personajes de YouTube y influencers digitales, dirigida a la nueva generación.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 2020,
      endYear: 2021,
      category: "stickers",
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        pinkiPowPunksVainilla
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(pinki_pow_punks_funki_tubers_2020.id, pinki_pow_punks_funki_tubers_2020);

'''

    # Find the last promotion definition and add new promotions after it
    # Look for the pattern where promotions are added to the map
    last_promotion_pattern = r'(this\.promotions\.set\([^;]+;\s*\n)'
    matches = list(re.finditer(last_promotion_pattern, content))
    if matches:
        last_match = matches[-1]
        insert_pos = last_match.end()
        content = content[:insert_pos] + new_promotions + content[insert_pos:]

    # Also update the existing The Dog 2004 promotion to add the new wrapper
    the_dog_2004_pattern = r'(const the_dog_2004: Promotion = \{[^}]+wrapperPhotosUrls: \[)([^\]]*?)(\])'
    the_dog_2004_replacement = r'\1\2,\n        theDog2004Vainilla\3'
    content = re.sub(the_dog_2004_pattern, the_dog_2004_replacement, content, flags=re.DOTALL)

    # Write the updated content back to the file
    with open('server/storage.ts', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated server/storage.ts with batch 3 wrapper updates")
    print("\nUPDATED EXISTING PROMOTIONS:")
    print("- Teen Titans GO 2020: Added 2 vainilla wrappers")
    print("- Spider-Man 3 2007: Added 1 vainilla wrapper")
    print("- Angry Birds GO: Added 1 vainilla wrapper")
    print("- Bob Esponja 2024: Added 1 vainilla wrapper")
    print("- Funki Punky Extremo: Added 1 vainilla wrapper")
    print("- Tortugas Ninja 2014: Added 1 vainilla wrapper")
    print("- Los Simpson 2008: Added 1 chocolate wrapper")
    print("- Minions: Added 1 chocolate wrapper")
    print("- Tattomania 2003: Added 1 chocolate wrapper")
    print("- The Dog 2004: Added 1 vainilla wrapper")
    print("\nCREATED NEW PROMOTIONS:")
    print("- The Dog y The Cat 2007: New promotion with chocolate wrapper")
    print("- Vive el Fútbol con Huevos 2010: New promotion with chocolate wrapper")
    print("- Pinki Pow Punks Funki Tubers 2020: New promotion with vainilla wrapper")

if __name__ == "__main__":
    update_storage_file()