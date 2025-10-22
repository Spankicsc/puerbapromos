import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function fixUploadsPaths() {
  console.log('🔧 Corrigiendo rutas de uploads...\n');
  
  try {
    // Obtener todas las promociones
    const response = await axios.get(`${API_URL}/api/promotions`);
    const promotions = response.data;
    
    let fixedCount = 0;
    let promotionsFixed = 0;
    
    for (const promo of promotions) {
      const wrapperUrls = promo.wrapperPhotosUrls || [];
      const descriptions = promo.promotionImageDescriptions || {};
      
      if (wrapperUrls.length === 0) {
        continue;
      }
      
      let hasWrongPaths = false;
      const fixedUrls: string[] = [];
      const fixedDescriptions: Record<string, string> = {};
      
      for (const url of wrapperUrls) {
        if (!url) continue;
        
        // Si la URL es /objects/UUID (sin /uploads/), corregirla
        if (url.match(/^\/objects\/[0-9a-f-]+$/)) {
          hasWrongPaths = true;
          const uuid = url.replace('/objects/', '');
          const fixedUrl = `/objects/uploads/${uuid}`;
          fixedUrls.push(fixedUrl);
          
          // Transferir la descripción a la URL corregida
          if (descriptions[url]) {
            fixedDescriptions[fixedUrl] = descriptions[url];
          }
          
          fixedCount++;
          console.log(`   Corrigiendo: ${url} → ${fixedUrl}`);
        } else {
          fixedUrls.push(url);
          if (descriptions[url]) {
            fixedDescriptions[url] = descriptions[url];
          }
        }
      }
      
      if (hasWrongPaths) {
        console.log(`\n📝 Actualizando ${promo.slug}`);
        
        await axios.put(`${API_URL}/api/promotions/${promo.id}`, {
          wrapperPhotosUrls: fixedUrls,
          promotionImageDescriptions: fixedDescriptions
        });
        
        promotionsFixed++;
        console.log(`   ✅ Actualizado\n`);
      }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ URLs corregidas: ${fixedCount}`);
    console.log(`   📦 Promociones actualizadas: ${promotionsFixed}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

fixUploadsPaths().catch(console.error);
