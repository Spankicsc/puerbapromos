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
    filename: "trasra chocolate angry birds Go_1761096270919.JPG",
    promotionId: "168a9a1b-1e18-4c02-a5dc-262e9740a3fd", // Angry Birds Go
    flavor: "Chocolate (trasera)"
  },
  {
    filename: "Lateral Chocolate  looney tunes 2009_1761096270920.JPG",
    promotionId: "3456129e-bbc1-452c-bc48-2ba43b9b546f", // El Show de los Looney Tunes
    flavor: "Chocolate (lateral)"
  },
  {
    filename: "The dog 2011 parte trasera Cajeta_1761096270920.JPG",
    promotionId: "757341e6-a3e0-406d-9e80-011c2dd1cec8", // The Dog 2011
    flavor: "Cajeta (trasera)"
  },
  {
    filename: "The dog 2011 Parte trasera Chocolate_1761096270920.JPG",
    promotionId: "757341e6-a3e0-406d-9e80-011c2dd1cec8", // The Dog 2011
    flavor: "Chocolate (trasera)"
  },
  {
    filename: "Traera Chocolate  looney tunes 2009_1761096270920.JPG",
    promotionId: "3456129e-bbc1-452c-bc48-2ba43b9b546f", // El Show de los Looney Tunes
    flavor: "Chocolate (trasera)"
  },
  {
    filename: "Trasera Bob esponja 2012_1761096270920.JPG",
    promotionId: "96a2bc53-7603-48c9-a91d-0c6cd1c5bd6e", // Bob Esponja 2012 Pega y Deco
    flavor: "Trasera"
  },
  {
    filename: "Trasera cajeta el futbol de huevos cajeta_1761096270921.JPG",
    promotionId: "564c9da3-27b1-43e3-ad85-7c21ce4bf7c5", // Vive el futbol con huevos
    flavor: "Cajeta (trasera)"
  },
  {
    filename: "trasera cajeta funki punky xtremo 2011_1761096270921.JPG",
    promotionId: "0d29de3b-50ee-45d7-b541-046dabd261ca", // Funki Punky Extremo
    flavor: "Cajeta (trasera)"
  },
  {
    filename: "Trasera cajeta looney tunes 2009_1761096270921.JPG",
    promotionId: "3456129e-bbc1-452c-bc48-2ba43b9b546f", // El Show de los Looney Tunes
    flavor: "Cajeta (trasera)"
  },
  {
    filename: "Trasera cajeta rebeldes con causa funky punki_1761096270921.JPG",
    promotionId: "ffd7d36a-c32c-4375-9b7a-5d9f99e037e3", // Funky Rebeldes con causa
    flavor: "Cajeta (trasera)"
  },
  {
    filename: "Trasera chocolate cartoon network 2018_1761096270921.JPG",
    promotionId: "60e00610-f63b-4d64-b172-47e7e5b84310", // Cartoon Network
    flavor: "Chocolate (trasera)"
  },
  {
    filename: "trasera chocolate steven universe_1761096270922.JPG",
    promotionId: "7f25ea73-de92-4cac-923c-80e0a70d2774", // Steven Universe
    flavor: "Chocolate (trasera)"
  },
  {
    filename: "Trasera corazones 2017 chocolate_1761096270922.JPG",
    promotionId: "f743086e-7b2b-4439-89c3-8c361bfcfc8c", // Corazones Vualá
    flavor: "Chocolate (trasera)"
  },
  {
    filename: "trasera el hcavo 2012 chocolate_1761096270922.JPG",
    promotionId: "7f208cc2-a324-4da2-ac54-4248d3411aac", // El Chavo Plateado y Dorado
    flavor: "Chocolate (trasera)"
  },
  {
    filename: "Trasera la era del hielo 2012 chocolate_1761096270922.JPG",
    promotionId: "4407146e-68d6-45eb-9eff-5a0e9972e478", // La Era del Hielo 4
    flavor: "Chocolate (trasera)"
  },
  {
    filename: "trasera vainilla angry birds go_1761096270922.JPG",
    promotionId: "168a9a1b-1e18-4c02-a5dc-262e9740a3fd", // Angry Birds Go
    flavor: "Vainilla (trasera)"
  },
  {
    filename: "trasera vainilla Avengers_1761096270923.JPG",
    promotionId: "53653ed0-43ff-45f5-9e4f-772d9895c3a5", // Avengers Era de Ultrón
    flavor: "Vainilla (trasera)"
  },
  {
    filename: "trasera vainilla looney tunes 2009_1761096270923.JPG",
    promotionId: "3456129e-bbc1-452c-bc48-2ba43b9b546f", // El Show de los Looney Tunes
    flavor: "Vainilla (trasera)"
  },
  {
    filename: "trasera vainilla teen titans go_1761096270923.JPG",
    promotionId: "9778afc2-fc3b-45a3-bd3e-fef5bf67fa22", // Teen Titans GO
    flavor: "Vainilla (trasera)"
  },
  {
    filename: "Trasera vainilla tortugas ninja_1761096270923.JPG",
    promotionId: "3af8d9f4-01bd-4d38-b30a-188bde94ed83", // Las Tortugas Ninja
    flavor: "Vainilla (trasera)"
  }
];

async function uploadWrapperImages() {
  const objectStorageService = new ObjectStorageService();
  const privateObjectDir = objectStorageService.getPrivateObjectDir();
  
  console.log("📦 Iniciando subida masiva de imágenes de envolturas (Lote 2)...");
  console.log(`📍 Directorio privado: ${privateObjectDir}\n`);

  // Agrupar imágenes por promoción
  const promotionGroups = new Map<string, Array<{filename: string, flavor: string, uploadedUrl: string}>>();
  
  for (const image of imagesToUpload) {
    try {
      const imagePath = `attached_assets/${image.filename}`;
      console.log(`📤 Subiendo: ${image.filename}`);
      console.log(`   Descripción: ${image.flavor}`);
      
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
          contentType: 'image/jpeg',
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
