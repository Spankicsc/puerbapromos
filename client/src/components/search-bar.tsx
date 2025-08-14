import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        type="text"
        placeholder="Buscar promocionales, marcas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-promo-yellow focus:border-transparent"
        data-testid="input-search"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1 h-8 px-2 text-gray-400 hover:text-promo-yellow"
        data-testid="button-search"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
