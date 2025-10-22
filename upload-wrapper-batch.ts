import { storage } from "./server/storage";
import { ObjectStorageService, objectStorageClient } from "./server/objectStorage";
import { readFileSync } from "fs";

// Helper function to parse object paths
function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}

// Mapeo de imágenes a sus promociones correspondientes
const imagesToUpload = [
  {
    filename: "Spiderman 2009 Vainilla_1761095248265.png",
    promotionId: "6e463c40-d38c-499a-a2dd-0fcd60cb534a", // Spiderman 3 (2007)
    flavor: "Vainilla"
  },
  {
    filename: "Teen tiatns Go Vainilla_1761095248265.png",
    promotionId: "9778afc2-fc3b-45a3-bd3e-fef5bf67fa22", // Teen Titans GO (2020)
    flavor: "Vainilla"
  },
  {
    filename: "Teen titans Go Vainilla_1761095248265.png",
    promotionId: "9778afc2-fc3b-45a3-bd3e-fef5bf67fa22", // Teen Titans GO (2020)
    flavor: "Vainilla"
  },
  {
    filename: "The dog 2010 Vainilla_1761095248266.png",
    promotionId: "6e9e3b65-8b6f-473c-8103-4be0a471093c", // The Dog 2010 (2010)
    flavor: "Vainilla"
  },
  {
    filename: "The Dog Cajeta 2010_1761095248266.png",
    promotionId: "6e9e3b65-8b6f-473c-8103-4be0a471093c", // The Dog 2010 (2010)
    flavor: "Cajeta"
  },
  {
    filename: "The Dog y the Cat 2007 Chocolate_1761095248266.png",
    promotionId: "07de8451-b68c-48cb-811d-1711d5dee8a0", // The Dog y the Cat (2007)
    flavor: "Chocolate"
  },
  {
    filename: "Tortugas ninja Cajeta_1761095248267.png",
    promotionId: "3af8d9f4-01bd-4d38-b30a-188bde94ed83", // Las Tortugas Ninja (2014)
    flavor: "Cajeta"
  },
  {
    filename: "Tortugas ninja Vainilla_1761095248267.png",
    promotionId: "3af8d9f4-01bd-4d38-b30a-188bde94ed83", // Las Tortugas Ninja (2014)
    flavor: "Vainilla"
  },
  {
    filename: "Vive el futbol con huevos 2010 Chocolate_1761095248267.png",
    promotionId: "564c9da3-27b1-43e3-ad85-7c21ce4bf7c5", // Vive el futbol con huevos (2010)
    flavor: "Chocolate"
  },
  {
    filename: "Vive el Futbol con huevos 2010 Vainilla_1761095248268.png",
    promotionId: "564c9da3-27b1-43e3-ad85-7c21ce4bf7c5", // Vive el futbol con huevos (2010)
    flavor: "Vainilla"
  }
];

async function uploadWrapperImages() {
  const objectStorageService = new ObjectStorageService();
  const privateObjectDir = objectStorageService.getPrivateObjectDir();
  
  console.log("📦 Iniciando subida masiva de imágenes de envolturas...");
  console.log(`📍 Directorio privado: ${privateObjectDir}\n`);

  // Agrupar imágenes por promoción
  const promotionGroups = new Map<string, Array<{filename: string, flavor: string, uploadedUrl: string}>>();
  
  for (const image of imagesToUpload) {
    try {
      const imagePath = `attached_assets/${image.filename}`;
      console.log(`📤 Subiendo: ${image.filename} (${image.flavor})`);
      
      // Leer archivo
      const fileBuffer = readFileSync(imagePath);
      
      // Generar ruta única en object storage
      const timestamp = Date.now();
      const sanitizedFilename = image.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const objectPath = `${privateObjectDir}/uploads/wrappers_${timestamp}_${sanitizedFilename}`;
      const { bucketName, objectName } = parseObjectPath(objectPath);
      
      // Subir archivo
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      
      await file.save(fileBuffer, {
        metadata: {
          contentType: 'image/png',
        },
      });
      
      // URL normalizada
      const uploadedUrl = `/objects/uploads/wrappers_${timestamp}_${sanitizedFilename}`;
      console.log(`✅ Subido: ${uploadedUrl}\n`);
      
      // Agrupar por promoción
      if (!promotionGroups.has(image.promotionId)) {
        promotionGroups.set(image.promotionId, []);
      }
      promotionGroups.get(image.promotionId)!.push({
        filename: image.filename,
        flavor: image.flavor,
        uploadedUrl
      });
      
    } catch (error) {
      console.error(`❌ Error subiendo ${image.filename}:`, error);
    }
  }
  
  // Actualizar cada promoción
  console.log("\n📝 Actualizando promociones en la base de datos...\n");
  
  for (const [promotionId, images] of promotionGroups.entries()) {
    try {
      const promotion = await storage.getPromotionById(promotionId);
      if (!promotion) {
        console.error(`❌ Promoción no encontrada: ${promotionId}`);
        continue;
      }
      
      console.log(`🔄 Actualizando: ${promotion.name} (${promotion.startYear})`);
      console.log(`   Imágenes a agregar: ${images.length}`);
      
      const existingUrls = Array.isArray(promotion.wrapperPhotosUrls) ? promotion.wrapperPhotosUrls : [];
      const newUrls = images.map(img => img.uploadedUrl);
      const updatedUrls = [...existingUrls, ...newUrls];
      
      await storage.updatePromotion(promotionId, {
        wrapperPhotosUrls: updatedUrls
      });
      
      console.log(`✅ ${promotion.name}: ${newUrls.length} nuevas envolturas agregadas`);
      for (const img of images) {
        console.log(`   - ${img.flavor}`);
      }
      console.log("");
      
    } catch (error) {
      console.error(`❌ Error actualizando promoción ${promotionId}:`, error);
    }
  }
  
  console.log("\n🎉 ¡Proceso completado!");
  console.log(`📊 Total de imágenes procesadas: ${imagesToUpload.length}`);
  console.log(`📊 Total de promociones actualizadas: ${promotionGroups.size}`);
}

uploadWrapperImages().catch(console.error);
