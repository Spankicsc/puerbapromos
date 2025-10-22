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
  // Reyes de las Olas 2007
  {
    promotionSlug: 'reyes-de-las-olas-vuala-2007',
    imagePath: 'attached_assets/Reyes de la Olas 2007 Chocolate_1761098731931.png',
    description: 'Chocolate - variante 2'
  },
  
  // Cartoon Network 2019
  {
    promotionSlug: 'cartoon-network-2019',
    imagePath: 'attached_assets/Cartoon network 2018 Chocolate v2_1761098731931.png',
    description: 'Chocolate - variante 3'
  },
  {
    promotionSlug: 'cartoon-network-2019',
    imagePath: 'attached_assets/Cartoon network 2018 Chocolate_1761098731932.png',
    description: 'Chocolate - variante 4'
  },
  
  // Conexión Alien 2004
  {
    promotionSlug: 'conexion-alien-2004',
    imagePath: 'attached_assets/Conexion alien 2004 chocolate_1761098731932.png',
    description: 'Chocolate - variante 2'
  },
  
  // Dance Mania 2008
  {
    promotionSlug: 'dance-mania-2008',
    imagePath: 'attached_assets/Dance mania audition Vainilla_1761098731932.png',
    description: 'Vainilla - variante 2'
  },
  {
    promotionSlug: 'dance-mania-2008',
    imagePath: 'attached_assets/Dancemania Audition chocolate_1761098731933.png',
    description: 'Chocolate - variante 2'
  },
  
  // Ecolokitos 2009
  {
    promotionSlug: 'ecolokitos-2009',
    imagePath: 'attached_assets/Ecolokitos Cajeta 2009_1761098731933.png',
    description: 'Cajeta - variante 2'
  },
  {
    promotionSlug: 'ecolokitos-2009',
    imagePath: 'attached_assets/Ecoloquitos Chocolate 2009_1761098731933.png',
    description: 'Chocolate - variante 2'
  },
  
  // El Chavo Sorpresa 2010
  {
    promotionSlug: 'el-chavo-sorpresa',
    imagePath: 'attached_assets/El Chavo 2010_1761098731934.png',
    description: 'Vualá con Sorpresa - variante 2'
  },
  
  // El Chavo Mini 2015
  {
    promotionSlug: 'el-chavo-mini-2015',
    imagePath: 'attached_assets/El Chavo mini 2015 Chocolate_1761098731934.png',
    description: 'Chocolate - variante 2'
  },
  {
    promotionSlug: 'el-chavo-mini-2015',
    imagePath: 'attached_assets/El Chavo mini 2015 Vainilla 2_1761098731934.png',
    description: 'Vainilla - variante 3'
  },
  {
    promotionSlug: 'el-chavo-mini-2015',
    imagePath: 'attached_assets/El Chavo mini 2015 Vainilla_1761098731935.png',
    description: 'Vainilla - variante 4'
  },
  
  // Fonomania 2.0
  {
    promotionSlug: 'fonomania-vuala-2008',
    imagePath: 'attached_assets/Fonomania Chocolate_1761098731935.png',
    description: 'Chocolate - variante 2'
  },
  
  // Funki Punky Extremo 2011
  {
    promotionSlug: 'funki-punky-extremo-vuala-2011',
    imagePath: 'attached_assets/Funki punky Xtremo 2011 Cajeta_1761098731935.png',
    description: 'Cajeta - variante 2'
  },
  {
    promotionSlug: 'funki-punky-extremo-vuala-2011',
    imagePath: 'attached_assets/Funki punky Xtremo 2011 Chocolate_1761098731936.png',
    description: 'Chocolate - variante 2'
  },
  {
    promotionSlug: 'funki-punky-extremo-vuala-2011',
    imagePath: 'attached_assets/Funki punky Xtremo 2011 Vainilla_1761098731936.png',
    description: 'Vainilla - variante 2'
  },
  
  // Hora de Aventura 2014
  {
    promotionSlug: 'hora-aventura-vuala-2014',
    imagePath: 'attached_assets/Hora de Aventura 2018 Chocolate_1761098731936.png',
    description: 'Chocolate - variante 2'
  },
  
  // Los Minions 2015
  {
    promotionSlug: 'minions-2015',
    imagePath: 'attached_assets/Los minions Chocolate_1761098731936.png',
    description: 'Chocolate - variante 2'
  },
  
  // Los Simpson 2008
  {
    promotionSlug: 'los-simpson-2008',
    imagePath: 'attached_assets/Los simpson 2008 Chocolate_1761098731937.png',
    description: 'Chocolate - variante 2'
  },
  
  // Funky Tubers 2021
  {
    promotionSlug: 'funky-tubers-2021',
    imagePath: 'attached_assets/Pinkipow Funkitubers 2020 Vainilla_1761098731937.png',
    description: 'Vainilla - variante 2'
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
