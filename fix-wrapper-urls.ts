import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Esta función replica la lógica de normalizeObjectEntityPath del servidor
function normalizeObjectEntityPath(rawPath: string): string {
  if (!rawPath.startsWith("https://storage.googleapis.com/")) {
    return rawPath;
  }

  // Extraer la ruta de la URL removiendo los parámetros de query y el dominio
  const url = new URL(rawPath);
  const rawObjectPath = url.pathname;

  // El PRIVATE_OBJECT_DIR es algo como: /bucket-name/.private/uploads
  // Necesitamos extraer solo el UUID final
  const parts = rawObjectPath.split('/');
  const uuid = parts[parts.length - 1]; // Tomar el último segmento (el UUID)
  
  return `/objects/${uuid}`;
}

async function fixWrapperUrls() {
  console.log('🔧 Iniciando corrección de URLs de wrappers...\n');
  
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
      
      let hasSignedUrls = false;
      const normalizedUrls: string[] = [];
      const normalizedDescriptions: Record<string, string> = {};
      
      for (const url of wrapperUrls) {
        if (!url) continue; // Skip null/undefined URLs
        
        if (url.includes('X-Goog-Signature')) {
          hasSignedUrls = true;
          const normalized = normalizeObjectEntityPath(url);
          normalizedUrls.push(normalized);
          
          // Transferir la descripción a la URL normalizada
          if (descriptions[url]) {
            normalizedDescriptions[normalized] = descriptions[url];
          }
          
          fixedCount++;
        } else {
          normalizedUrls.push(url);
          if (descriptions[url]) {
            normalizedDescriptions[url] = descriptions[url];
          }
        }
      }
      
      if (hasSignedUrls) {
        console.log(`📝 Corrigiendo ${promo.slug}:`);
        console.log(`   URLs antes: ${wrapperUrls.length}`);
        console.log(`   URLs normalizadas: ${normalizedUrls.length}`);
        
        await axios.put(`${API_URL}/api/promotions/${promo.id}`, {
          wrapperPhotosUrls: normalizedUrls,
          promotionImageDescriptions: normalizedDescriptions
        });
        
        promotionsFixed++;
        console.log(`   ✅ Actualizado`);
      }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ URLs corregidas: ${fixedCount}`);
    console.log(`   📦 Promociones actualizadas: ${promotionsFixed}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

fixWrapperUrls().catch(console.error);
