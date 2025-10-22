import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000';

// Esta función replica la lógica de normalizeObjectEntityPath del servidor
function normalizeObjectEntityPath(rawPath: string): string {
  if (!rawPath.startsWith("https://storage.googleapis.com/")) {
    return rawPath;
  }

  const url = new URL(rawPath);
  const rawObjectPath = url.pathname;
  const parts = rawObjectPath.split('/');
  const uuid = parts[parts.length - 1];
  
  return `/objects/${uuid}`;
}

interface WrapperUpload {
  promotionSlug: string;
  imagePath: string;
  description: string;
}

const wrappers: WrapperUpload[] = [
  // Angry Birds Go
  {
    promotionSlug: 'angry-birds-go',
    imagePath: 'attached_assets/Angrybirds Go Cajeta_1761098575346.png',
    description: 'Cajeta'
  },
  {
    promotionSlug: 'angry-birds-go',
    imagePath: 'attached_assets/Angrybirds Go Chocolate_1761098575347.png',
    description: 'Chocolate'
  },
  {
    promotionSlug: 'angry-birds-go',
    imagePath: 'attached_assets/Angrybirds Go Vainilla_1761098575347.png',
    description: 'Vainilla'
  },
  
  // Avengers Era de Ultrón 2015
  {
    promotionSlug: 'avengers-era-de-ultron',
    imagePath: 'attached_assets/Avengers Ultron 2015 Cajeta_1761098575347.png',
    description: 'Cajeta'
  },
  {
    promotionSlug: 'avengers-era-de-ultron',
    imagePath: 'attached_assets/Avengers Ultron 2015 Vainilla_1761098575348.png',
    description: 'Vainilla'
  },
  
  // Bob Esponja en Movimiento 2009
  {
    promotionSlug: 'bob-esponja-movimiento-2009',
    imagePath: 'attached_assets/Bob esponja 2009 Cajeta_1761098575348.png',
    description: 'Cajeta'
  },
  
  // Bob Esponja 2012 Pega y Deco
  {
    promotionSlug: 'bob-esponja-pega-deco-2012',
    imagePath: 'attached_assets/Bob esponja 2012 Cajeta_1761098575348.png',
    description: 'Cajeta'
  },
  {
    promotionSlug: 'bob-esponja-pega-deco-2012',
    imagePath: 'attached_assets/Bob esponja 2012 Chocolate_1761098575348.png',
    description: 'Chocolate'
  },
  {
    promotionSlug: 'bob-esponja-pega-deco-2012',
    imagePath: 'attached_assets/Bob esponja 2012 Vainilla_1761098575348.png',
    description: 'Vainilla'
  },
  
  // Bob Esponja 2024
  {
    promotionSlug: 'bob-esponja-2024',
    imagePath: 'attached_assets/Bob Esponja 2024 Cajeta_1761098575349.png',
    description: 'Cajeta'
  },
  {
    promotionSlug: 'bob-esponja-2024',
    imagePath: 'attached_assets/Bob esponja 2024 Piña_1761098575349.png',
    description: 'Piña'
  },
  {
    promotionSlug: 'bob-esponja-2024',
    imagePath: 'attached_assets/Bob Esponja 2024 Vainilla_1761098575349.png',
    description: 'Vainilla'
  },
  {
    promotionSlug: 'bob-esponja-2024',
    imagePath: 'attached_assets/Bob Esponja Vualá 2024 Chocolate_1761098575349.png',
    description: 'Chocolate'
  }
];

async function uploadWrappers() {
  console.log(`🚀 Iniciando carga de ${wrappers.length} wrappers con normalización de URLs...\n`);
  let successCount = 0;
  let errorCount = 0;

  for (const wrapper of wrappers) {
    try {
      console.log(`📤 Subiendo: ${wrapper.promotionSlug} - ${wrapper.description}`);
      
      // 1. Get promotion
      const promoResponse = await axios.get(`${API_URL}/api/promotions/${wrapper.promotionSlug}`);
      const promotion = promoResponse.data;
      
      if (!promotion) {
        console.error(`❌ Promoción no encontrada: ${wrapper.promotionSlug}`);
        errorCount++;
        continue;
      }

      // 2. Get upload URL
      const uploadUrlResponse = await axios.post(`${API_URL}/api/objects/upload`, {});
      const signedUploadURL = uploadUrlResponse.data.uploadURL;
      
      if (!signedUploadURL) {
        console.error(`❌ No se obtuvo URL de upload`);
        errorCount++;
        continue;
      }

      // 3. Read file
      const imagePath = path.join(process.cwd(), wrapper.imagePath);
      
      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Archivo no encontrado: ${imagePath}`);
        errorCount++;
        continue;
      }
      
      const fileBuffer = fs.readFileSync(imagePath);
      
      // 4. Upload file to the signed URL
      await axios.put(signedUploadURL, fileBuffer, {
        headers: {
          'Content-Type': 'image/png'
        }
      });

      console.log(`✅ Imagen subida a Google Cloud Storage`);

      // 5. IMPORTANTE: Normalizar la URL antes de guardar
      const permanentURL = normalizeObjectEntityPath(signedUploadURL);
      console.log(`🔄 URL normalizada: ${permanentURL}`);

      // 6. Add to promotion
      const currentWrappers = promotion.wrapperPhotosUrls || [];
      const currentDescriptions = promotion.promotionImageDescriptions || {};
      
      const updatedWrappers = [...currentWrappers, permanentURL];
      const updatedDescriptions = {
        ...currentDescriptions,
        [permanentURL]: wrapper.description
      };

      await axios.put(`${API_URL}/api/promotions/${promotion.id}`, {
        wrapperPhotosUrls: updatedWrappers,
        promotionImageDescriptions: updatedDescriptions
      });

      console.log(`✅ Wrapper agregado a ${wrapper.promotionSlug}: ${wrapper.description}\n`);
      successCount++;
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error: any) {
      console.error(`❌ Error subiendo ${wrapper.promotionSlug}:`, error.response?.data || error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Exitosas: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);
  console.log(`   📦 Total: ${wrappers.length}`);
}

uploadWrappers().catch(console.error);
