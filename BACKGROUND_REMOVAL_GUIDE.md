# Guía para Eliminar Fondos de las Envolturas

## ✅ Completado
- ✅ **Imágenes giradas**: Todas las fotos de envolturas que estaban acostadas ya fueron giradas 90 grados hacia arriba
- ✅ **Ubicación corregida**: Las fotos de envolturas ahora están en la sección correcta (no en imágenes de promoción)
- ✅ **Base de datos actualizada**: Todas las promociones ahora usan las imágenes procesadas y giradas

## 🎯 Siguiente Paso: Eliminar Fondos

Para completar el procesamiento y eliminar los fondos de todas las envolturas, puedes usar **remove.bg** (servicio gratuito):

### Opción 1: Automática con API (Recomendada)

1. **Obtén una clave API gratuita**:
   - Ve a: https://www.remove.bg/users/sign_up
   - Regístrate con tu email
   - Ve a: https://www.remove.bg/users/
   - Copia tu API Key

2. **Ejecuta el script automático**:
   ```bash
   python3 scripts/process_wrapper_images.py --with-api TU_API_KEY_AQUI
   ```

### Opción 2: Manual (más trabajo pero 100% gratis)

1. Ve a: https://www.remove.bg/
2. Sube cada imagen una por una desde `attached_assets/processed/`
3. Descarga las imágenes sin fondo
4. Reemplaza las imágenes en la carpeta `attached_assets/processed/`

## 📁 Imágenes que Necesitan Procesamiento

Las siguientes 11 imágenes ya están rotadas y listas para eliminar fondo:

1. `El chavo 2012 Trasera cajeta_1755145664203_processed.png`
2. `Frontal cajeta looney tunes 2009_1755145664204_processed.png`
3. `trasera vainilla angry birds go_1755145664056_processed.png`
4. `Trasera Bob esponja 2012_1755145664205_processed.png`
5. `Ecoinvasores trasera cajeta_1755145664202_processed.png`
6. `trasera chocolate steven universe_1755145664206_processed.png`
7. `Trasera chocolate cartoon network 2018_1755145664206_processed.png`
8. `Trasera corazones 2017 chocolate_1755145664206_processed.png`
9. `Trasera la era del hielo 2012 chocolate_1755145664207_processed.png`
10. `trasera cajeta funki punky xtremo 2011_1755145664205_processed.png`
11. `Trasera cajeta rebeldes con causa funky punki_1755145664206_processed.png`

## 🔧 Beneficios del Servicio remove.bg

- **Gratis**: 50 imágenes gratis por mes (suficiente para este proyecto)
- **Alta calidad**: Reconocimiento IA profesional de objetos
- **Rápido**: Procesamiento automático en segundos
- **API disponible**: Para procesamiento por lotes

¡Una vez que tengas tu API key, el script procesará todas las imágenes automáticamente!