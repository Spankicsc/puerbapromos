#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of image filenames to collections and details
const imageMapping = {
  // Angry Birds Go Collection
  'trasera vainilla angry birds go': {
    collection: 'Angry Birds Go',
    flavor: 'Vainilla',
    side: 'Trasera',
    year: '2012'
  },

  // Ecoinvasores Collection
  'Ecoinvasores trasera cajeta': {
    collection: 'Ecoinvasores',
    flavor: 'Cajeta',
    side: 'Trasera',
    year: '2011'
  },

  // El Chavo Collection
  'El chavo 2012 Fontal Cajeta': {
    collection: 'El Chavo',
    flavor: 'Cajeta',
    side: 'Frontal',
    year: '2012'
  },
  'El chavo 2012 Trasera Vainilla': {
    collection: 'El Chavo',
    flavor: 'Vainilla',
    side: 'Trasera',
    year: '2012'
  },
  'El chavo 2012 Trasera cajeta': {
    collection: 'El Chavo',
    flavor: 'Cajeta',
    side: 'Trasera',
    year: '2012'
  },

  // El Fútbol de Huevos Collection
  'Frontal cajeta el futbol de huevos cajeta': {
    collection: 'El Fútbol de Huevos',
    flavor: 'Cajeta',
    side: 'Frontal',
    year: '2012'
  },
  'Trasera cajeta el futbol de huevos cajeta': {
    collection: 'El Fútbol de Huevos',
    flavor: 'Cajeta',
    side: 'Trasera',
    year: '2012'
  },

  // Looney Tunes Collection
  'Frontal Chocolate  looney tunes 2009': {
    collection: 'Looney Tunes',
    flavor: 'Chocolate',
    side: 'Frontal',
    year: '2009'
  },
  'Frontal cajeta looney tunes 2009': {
    collection: 'Looney Tunes',
    flavor: 'Cajeta',
    side: 'Frontal',
    year: '2009'
  },
  'Lateral Chocolate  looney tunes 2009': {
    collection: 'Looney Tunes',
    flavor: 'Chocolate',
    side: 'Lateral',
    year: '2009'
  },
  'Traera Chocolate  looney tunes 2009': {
    collection: 'Looney Tunes',
    flavor: 'Chocolate',
    side: 'Trasera',
    year: '2009'
  },
  'Trasera cajeta looney tunes 2009': {
    collection: 'Looney Tunes',
    flavor: 'Cajeta',
    side: 'Trasera',
    year: '2009'
  },

  // Bob Esponja Collection
  'Trasera Bob esponja 2012': {
    collection: 'Bob Esponja',
    flavor: 'Chocolate',
    side: 'Trasera',
    year: '2012'
  },

  // Funki Punky Collection
  'trasera cajeta funki punky xtremo 2011': {
    collection: 'Funki Punky Xtremo',
    flavor: 'Cajeta',
    side: 'Trasera',
    year: '2011'
  },
  'Trasera cajeta rebeldes con causa funky punki': {
    collection: 'Rebeldes con Causa Funky Punki',
    flavor: 'Cajeta',
    side: 'Trasera',
    year: '2011'
  },

  // Cartoon Network Collection
  'Trasera chocolate cartoon network 2018': {
    collection: 'Cartoon Network',
    flavor: 'Chocolate',
    side: 'Trasera',
    year: '2018'
  },

  // Steven Universe Collection
  'trasera chocolate steven universe': {
    collection: 'Steven Universe',
    flavor: 'Chocolate',
    side: 'Trasera',
    year: '2017'
  },

  // Corazones Collection
  'Trasera corazones 2017 chocolate': {
    collection: 'Corazones',
    flavor: 'Chocolate',
    side: 'Trasera',
    year: '2017'
  },

  // La Era del Hielo Collection
  'Trasera la era del hielo 2012 chocolate': {
    collection: 'La Era del Hielo',
    flavor: 'Chocolate',
    side: 'Trasera',
    year: '2012'
  },
  'trasera el hcavo 2012 chocolate': {
    collection: 'El Chavo',
    flavor: 'Chocolate',
    side: 'Trasera',
    year: '2012'
  }
};

// Function to find matching key for filename
function findMatchingKey(filename) {
  // Remove file extensions and timestamps
  const cleanName = filename.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '')
                           .replace(/_\d+$/g, '');
  
  for (const key of Object.keys(imageMapping)) {
    if (cleanName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(cleanName.toLowerCase())) {
      return key;
    }
  }
  
  // Try partial matches
  for (const key of Object.keys(imageMapping)) {
    const keyParts = key.toLowerCase().split(' ');
    const nameParts = cleanName.toLowerCase().split(' ');
    
    let matches = 0;
    for (const keyPart of keyParts) {
      if (nameParts.some(namePart => namePart.includes(keyPart) || keyPart.includes(namePart))) {
        matches++;
      }
    }
    
    if (matches >= Math.min(3, keyParts.length - 1)) {
      return key;
    }
  }
  
  return null;
}

// Create organized data structure
const organizedData = {};

console.log('🔍 Organizing Vualá wrapper images...\n');

// Read all files in attached_assets directory
const attachedAssetsDir = path.join(__dirname, '../attached_assets');
const files = fs.readdirSync(attachedAssetsDir);

// Filter image files
const imageFiles = files.filter(file => 
  /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(file) && 
  !file.includes('logo') && 
  !file.includes('Logo') &&
  !file.includes('IMG_') &&
  !file.includes('Pasted') &&
  file.toLowerCase().includes('trasera') ||
  file.toLowerCase().includes('frontal') ||
  file.toLowerCase().includes('lateral')
);

console.log(`📁 Found ${imageFiles.length} potential wrapper images\n`);

// Process each image file
imageFiles.forEach(filename => {
  const matchingKey = findMatchingKey(filename);
  
  if (matchingKey && imageMapping[matchingKey]) {
    const details = imageMapping[matchingKey];
    const collection = details.collection;
    
    if (!organizedData[collection]) {
      organizedData[collection] = {
        name: collection,
        year: details.year,
        flavors: {},
        images: []
      };
    }
    
    // Add to flavors
    if (!organizedData[collection].flavors[details.flavor]) {
      organizedData[collection].flavors[details.flavor] = [];
    }
    
    // Add image info
    const imageInfo = {
      filename,
      side: details.side,
      flavor: details.flavor,
      year: details.year,
      path: `/attached_assets/${filename}`
    };
    
    organizedData[collection].flavors[details.flavor].push(imageInfo);
    organizedData[collection].images.push(imageInfo);
    
    console.log(`✅ ${collection} (${details.year}) - ${details.flavor} ${details.side}: ${filename}`);
  } else {
    console.log(`❓ Could not categorize: ${filename}`);
  }
});

// Write organized data to JSON file
const outputPath = path.join(__dirname, '../attached_assets/vuala_wrappers_organized.json');
fs.writeFileSync(outputPath, JSON.stringify(organizedData, null, 2));

console.log(`\n📝 Organized data written to: ${outputPath}`);

// Summary
console.log('\n📊 SUMMARY:');
Object.entries(organizedData).forEach(([collection, data]) => {
  const totalImages = data.images.length;
  const flavors = Object.keys(data.flavors);
  console.log(`   ${collection} (${data.year}): ${totalImages} images, flavors: ${flavors.join(', ')}`);
});

console.log(`\n🎉 Successfully organized ${Object.keys(organizedData).length} collections!`);