// Brand logos mapping
import sabritasLogo from '@assets/sabritas-37258_1755143611549.png';
import bimboLogo from '@assets/Logo_Bimbo_2000_1755143611549.png';
import marinelaLogo from '@assets/Marinela-Logo-Vector.svg-_1755143611550.png';
import barcelLogo from '@assets/Barcel_1755143611550.png';
import gamesaLogo from '@assets/Gamesa2008_1755143611550.webp';
import vualaLogo from '@assets/Vuala_1755143611550.png';

export const brandLogos: Record<string, string> = {
  'sabritas': sabritasLogo,
  'bimbo': bimboLogo,
  'marinela': marinelaLogo,
  'barcel': barcelLogo,
  'gamesa': gamesaLogo,
  'vuala': vualaLogo,
  'vualá': vualaLogo, // Alternative spelling
};

export const getBrandLogo = (brandSlug: string): string | null => {
  return brandLogos[brandSlug.toLowerCase()] || null;
};