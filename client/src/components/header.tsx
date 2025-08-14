import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "@/components/search-bar";
// Using the updated official Promospedia logo
const promoLogo = "/attached_assets/IMG_7043_1755142043469.PNG";

const Header = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Marcas", href: "/marcas" },
    { name: "Promociones", href: "/promociones" },
  ];

  return (
    <header className="text-white sticky top-0 z-50 shadow-lg bg-[#fed801]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-promo-yellow rounded-full flex items-center justify-center overflow-hidden border-4 border-promo-black shadow-lg">
                <img 
                  src={promoLogo} 
                  alt="Promospedia Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-promo-yellow">Promospedia</h1>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase()}`}>
                <span
                  className={`text-sm font-medium transition-colors hover:text-promo-yellow ${
                    location === item.href ? "text-promo-yellow" : "text-white"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-promo-yellow"
              data-testid="button-mobile-search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-promo-yellow"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-promo-black border-gray-800">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-promo-yellow">Menú</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-promo-yellow"
                      data-testid="button-close-menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Mobile Search */}
                  <div className="w-full">
                    <SearchBar />
                  </div>
                  
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        data-testid={`link-mobile-${item.name.toLowerCase()}`}
                      >
                        <span
                          className={`text-base font-medium transition-colors hover:text-promo-yellow ${
                            location === item.href ? "text-promo-yellow" : "text-white"
                          }`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
