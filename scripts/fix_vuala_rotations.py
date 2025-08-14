#!/usr/bin/env python3
"""
Script para corregir la rotación de las imágenes de Vualá que están de cabeza
y procesar las nuevas imágenes subidas.
"""

import os
from PIL import Image
import sys

def rotate_image(input_path, output_path, degrees):
    """Rota una imagen el número especificado de grados."""
    try:
        with Image.open(input_path) as img:
            # Rotar la imagen
            rotated = img.rotate(degrees, expand=True)
            
            # Guardar la imagen rotada
            rotated.save(output_path)
            print(f"✓ Rotada {os.path.basename(input_path)} -> {os.path.basename(output_path)}")
            return True
    except Exception as e:
        print(f"✗ Error rotando {input_path}: {e}")
        return False

def main():
    base_dir = "attached_assets"
    rotated_dir = os.path.join(base_dir, "rotated")
    
    # Crear directorio rotated si no existe
    os.makedirs(rotated_dir, exist_ok=True)
    
    # Imágenes existentes de Vualá que están de cabeza (necesitan 180 grados)
    existing_images_to_fix = [
        "Askistix 2004 chocolate frontal_1755148526400.png",
        "Avengers cajeta_1755148526400.png", 
        "Avengers vainilla_1755148526400.png",
        "Cajeta frontal ecolokitos_1755148526402.png",
        "Chocolate frontal ecolokitos_1755148526404.png",
        "Chocolate conexion alien 2004 frontal_1755148526404.png",
        "bob esponja 2024 cajeta frontal_1755148526401.png",
        "Bob esponja 2024 piña frontal_1755148526402.png"
    ]
    
    # Nuevas imágenes que necesitan rotación (90 grados a la derecha)
    new_images = [
        "Teen titans vainilla version 1_1755149294895.png",
        "Chocolate frontalreyes de las olas_1755149294895.png", 
        "Dance mania 2008 vainilla frontal_1755149294896.png",
        "Dancemania 2008 frontal chocolate_1755149294896.png",
        "el chavo chavitops chocolate_1755149294896.png",
        "el chavo mini 2015 vainilla (2)_1755149294897.png",
        "El chavo mini 2015 vainilla_1755149294897.png",
        "El chavo mini chocolate_1755149294897.png",
        "Fonomania 2008 frontal chocolate_1755149294898.png",
        "Frontal bob esponja 2012 chocolate_1755149294898.png",
        "Frontal chocolate hora de aventura 2018_1755149294899.png",
        "Funki punky extremo chocolate_1755149294899.png",
        "Los simpson 2008 chocolate frontal_1755149294899.png",
        "minions chocolate_1755149294899.png",
        "Pinki pow punks funki tubers vainilla 2020_1755149294899.png",
        "Tattomania 2003 chocolate_1755149294900.png"
    ]
    
    print("🔄 Corrigiendo imágenes existentes que están de cabeza...")
    
    # Corregir imágenes existentes (180 grados)
    for img_name in existing_images_to_fix:
        input_path = os.path.join(base_dir, img_name)
        if os.path.exists(input_path):
            # Sobrescribir las imágenes originales rotadas existentes
            original_rotated = os.path.join(rotated_dir, img_name.replace('.png', '_rotated.png'))
            if os.path.exists(original_rotated):
                rotate_image(original_rotated, original_rotated, 180)
        else:
            print(f"⚠ No encontrada: {img_name}")
    
    print("\n🔄 Procesando nuevas imágenes...")
    
    # Procesar nuevas imágenes (90 grados a la derecha)
    for img_name in new_images:
        input_path = os.path.join(base_dir, img_name) 
        output_path = os.path.join(rotated_dir, img_name.replace('.png', '_rotated.png'))
        
        if os.path.exists(input_path):
            rotate_image(input_path, output_path, -90)  # -90 para rotar a la derecha
        else:
            print(f"⚠ No encontrada: {img_name}")
    
    print(f"\n✅ Proceso completado. Imágenes rotadas guardadas en: {rotated_dir}/")

if __name__ == "__main__":
    main()