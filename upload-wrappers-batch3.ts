import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000';

interface WrapperUpload {
  promotionSlug: string;
  imagePath: string;
  description: string;
}

const wrappers: WrapperUpload[] = [
  // El Chavo 2010
  {
    promotionSlug: 'el-chavo-sorpresa',
    imagePath: 'attached_assets/El Chavo 2010_1761097101115.png',
    description: 'Vualá con Sorpresa'
  },
  
  // El Chavo mini 2015
  {
    promotionSlug: 'el-chavo-mini-2015',
    imagePath: 'attached_assets/El Chavo mini 2015 Chocolate_1761097101116.png',
    description: 'Chocolate'
  },
  {
    promotionSlug: 'el-chavo-mini-2015',
    imagePath: 'attached_assets/El Chavo mini 2015 Vainilla 2_1761097101116.png',
    description: 'Vainilla - variante 1'
  },
  {
    promotionSlug: 'el-chavo-mini-2015',
    imagePath: 'attached_assets/El Chavo mini 2015 Vainilla_1761097101116.png',
    description: 'Vainilla - variante 2'
  },
  
  // Fonomania 2.0
  {
    promotionSlug: 'fonomania-vuala-2008',
    imagePath: 'attached_assets/Fonomania Chocolate_1761097101117.png',
    description: 'Chocolate'
  },
  
  // Funki Punky Xtremo 2011
  {
    promotionSlug: 'funki-punky-extremo-vuala-2011',
    imagePath: 'attached_assets/Funki punky Xtremo 2011 Cajeta_1761097101117.png',
    description: 'Cajeta'
  },
  {
    promotionSlug: 'funki-punky-extremo-vuala-2011',
    imagePath: 'attached_assets/Funki punky Xtremo 2011 Chocolate_1761097101117.png',
    description: 'Chocolate'
  },
  {
    promotionSlug: 'funki-punky-extremo-vuala-2011',
    imagePath: 'attached_assets/Funki punky Xtremo 2011 Vainilla_1761097101117.png',
    description: 'Vainilla'
  },
  
  // Hora de Aventura 2014
  {
    promotionSlug: 'hora-aventura-vuala-2014',
    imagePath: 'attached_assets/Hora de Aventura 2018 Chocolate_1761097101118.png',
    description: 'Chocolate'
  },
  
  // Los Minions 2015
  {
    promotionSlug: 'minions-2015',
    imagePath: 'attached_assets/Los minions Chocolate_1761097101118.png',
    description: 'Chocolate'
  },
  
  // Los Simpson 2008
  {
    promotionSlug: 'los-simpson-2008',
    imagePath: 'attached_assets/Los simpson 2008 Chocolate_1761097101118.png',
    description: 'Chocolate'
  },
  
  // Funky Tubers 2021
  {
    promotionSlug: 'funky-tubers-2021',
    imagePath: 'attached_assets/Pinkipow Funkitubers 2020 Vainilla_1761097101118.png',
    description: 'Vainilla'
  },
  
  // Reyes de las Olas 2007
  {
    promotionSlug: 'reyes-de-las-olas-vuala-2007',
    imagePath: 'attached_assets/Reyes de la Olas 2007 Chocolate_1761097101119.png',
    description: 'Chocolate'
  },
  
  // Cartoon Network 2019
  {
    promotionSlug: 'cartoon-network-2019',
    imagePath: 'attached_assets/Cartoon network 2018 Chocolate_1761097167567.png',
    description: 'Chocolate - variante 1'
  },
  {
    promotionSlug: 'cartoon-network-2019',
    imagePath: 'attached_assets/Cartoon network 2018 Chocolate v2_1761097167569.png',
    description: 'Chocolate - variante 2'
  },
  
  // Conexión Alien 2004
  {
    promotionSlug: 'conexion-alien-2004',
    imagePath: 'attached_assets/Conexion alien 2004 chocolate_1761097167568.png',
    description: 'Chocolate'
  },
  
  // Dance Mania 2008
  {
    promotionSlug: 'dance-mania-2008',
    imagePath: 'attached_assets/Dance mania audition Vainilla_1761097167568.png',
    description: 'Vainilla'
  },
  {
    promotionSlug: 'dance-mania-2008',
    imagePath: 'attached_assets/Dancemania Audition chocolate_1761097167569.png',
    description: 'Chocolate'
  },
  
  // Ecolokitos 2009
  {
    promotionSlug: 'ecolokitos-2009',
    imagePath: 'attached_assets/Ecolokitos Cajeta 2009_1761097167569.png',
    description: 'Cajeta'
  },
  {
    promotionSlug: 'ecolokitos-2009',
    imagePath: 'attached_assets/Ecoloquitos Chocolate 2009_1761097167569.png',
    description: 'Chocolate'
  }
];

async function uploadWrappers() {
  console.log(`🚀 Iniciando carga de ${wrappers.length} wrappers...`);
  let successCount = 0;
  let errorCount = 0;

  for (const wrapper of wrappers) {
    try {
      console.log(`\n📤 Subiendo: ${wrapper.promotionSlug} - ${wrapper.description}`);
      
      // 1. Get promotion ID
      const promoResponse = await axios.get(`${API_URL}/api/promotions/${wrapper.promotionSlug}`);
      const promotion = promoResponse.data;
      
      if (!promotion) {
        console.error(`❌ Promoción no encontrada: ${wrapper.promotionSlug}`);
        errorCount++;
        continue;
      }

      // 2. Upload image
      const formData = new FormData();
      const imagePath = path.join(process.cwd(), wrapper.imagePath);
      
      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Archivo no encontrado: ${imagePath}`);
        errorCount++;
        continue;
      }
      
      formData.append('file', fs.createReadStream(imagePath));
      formData.append('entityId', promotion.id);
      formData.append('entityType', 'promotion_wrapper');

      const uploadResponse = await axios.post(`${API_URL}/api/object-storage/upload`, formData, {
        headers: formData.getHeaders()
      });

      const imageUrl = uploadResponse.data.url;
      console.log(`✅ Imagen subida: ${imageUrl}`);

      // 3. Add to promotion
      const currentWrappers = promotion.wrapperPhotosUrls || [];
      const currentDescriptions = promotion.promotionImageDescriptions || {};
      
      const updatedWrappers = [...currentWrappers, imageUrl];
      const updatedDescriptions = {
        ...currentDescriptions,
        [imageUrl]: wrapper.description
      };

      await axios.put(`${API_URL}/api/promotions/${promotion.id}`, {
        wrapperPhotosUrls: updatedWrappers,
        promotionImageDescriptions: updatedDescriptions
      });

      console.log(`✅ Wrapper agregado a ${wrapper.promotionSlug}: ${wrapper.description}`);
      successCount++;
      
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
