const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-promo-yellow to-yellow-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-promo-black mb-4">
          ¡Revive tu nostalgia!
        </h2>
        <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto">
          La enciclopedia más completa de promocionales mexicanos. Desde Tazos hasta Funki Punky, 
          descubre todas las promociones que marcaron tu infancia.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="bg-promo-black text-promo-yellow px-6 py-2 rounded-full font-semibold">
            Tazos
          </span>
          <span className="bg-promo-black text-promo-yellow px-6 py-2 rounded-full font-semibold">
            Stickers
          </span>
          <span className="bg-promo-black text-promo-yellow px-6 py-2 rounded-full font-semibold">
            Spinners
          </span>
          <span className="bg-promo-black text-promo-yellow px-6 py-2 rounded-full font-semibold">
            Funki Punky
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
