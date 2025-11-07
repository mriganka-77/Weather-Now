import { useState } from "react";
import { Search, MapPin, Scan } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "@/styles/jarvis-theme.css";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const popularCities = ["London", "New York", "Tokyo", "Paris", "Sydney", "Dubai"];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 jarvis-icon" />
            <Input
              type="text"
              placeholder="Enter location coordinates or city name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-lg jarvis-card bg-transparent text-jarvis-text placeholder:text-jarvis-text/50 focus:ring-2 focus:ring-[hsl(var(--jarvis-primary))]"
              disabled={isLoading}
            />
            <Scan className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 jarvis-icon animate-pulse" />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="jarvis-button px-6 py-6 font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            Analyze
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {popularCities.map((city) => (
          <Button
            key={city}
            variant="ghost"
            size="sm"
            onClick={() => onSearch(city)}
            disabled={isLoading}
            className="jarvis-card hover:jarvis-border-glow transition-all duration-300"
          >
            <MapPin className="w-4 h-4 mr-2 jarvis-icon" />
            {city}
          </Button>
        ))}
      </div>
    </div>
  );
}