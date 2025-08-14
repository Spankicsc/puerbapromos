import { Link } from "wouter";
// Using direct path since vite asset handling
const promoLogo = "/attached_assets/IMG_7043_1755136743423.PNG";

const Footer = () => {
  return (
    <footer className="bg-promo-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-promo-yellow rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={promoLogo} 
                  alt="Promospedia Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-promo-yellow">Promospedia</span>
            </div>
            <p className="text-gray-400 text-sm">
              La enciclopedia más completa de promocionales mexicanos. 
              Preservando la nostalgia de toda una generación.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-promo-yellow mb-4">Marcas</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/marcas/sabritas" data-testid="link-footer-sabritas" className="hover:text-white">Sabritas</Link></li>
              <li><Link href="/marcas/gamesa" data-testid="link-footer-gamesa" className="hover:text-white">Gamesa</Link></li>
              <li><Link href="/marcas/barcel" data-testid="link-footer-barcel" className="hover:text-white">Barcel</Link></li>
              <li><Link href="/marcas/bimbo" data-testid="link-footer-bimbo" className="hover:text-white">Bimbo</Link></li>
              <li><Link href="/marcas/marinela" data-testid="link-footer-marinela" className="hover:text-white">Marinela</Link></li>
              <li><Link href="/marcas/vuala" data-testid="link-footer-vuala" className="hover:text-white">Vualá</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-promo-yellow mb-4">Promociones</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/promociones/tazos" data-testid="link-footer-tazos" className="hover:text-white">Tazos</Link></li>
              <li><Link href="/promociones/funki-punky" data-testid="link-footer-funki-punky" className="hover:text-white">Funki Punky</Link></li>
              <li><Link href="/promociones/spinners-chokas" data-testid="link-footer-spinners" className="hover:text-white">Spinners</Link></li>
              <li><span className="hover:text-white cursor-pointer">Stickers</span></li>
              <li><span className="hover:text-white cursor-pointer">Juguetes</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-promo-yellow mb-4">Comunidad</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-white cursor-pointer">Contribuir</span></li>
              <li><span className="hover:text-white cursor-pointer">Contacto</span></li>
              <li><span className="hover:text-white cursor-pointer">Sobre Nosotros</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacidad</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Promospedia. Hecho con ❤️ para preservar la nostalgia mexicana.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
