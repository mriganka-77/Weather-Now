import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import WeatherCard from "@/components/WeatherCard";
import SearchBar from "@/components/SearchBar";
import WeatherBackground from "@/components/WeatherBackground";
import { CloudOff, Loader2, Star, Power, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/store/weather";
import "@/styles/jarvis-theme.css";

import { WeatherData } from "@/types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_BASE_URL = `${import.meta.env.VITE_WEATHER_API_BASE_URL}/current.json`;

if (!API_KEY) {
  throw new Error("Weather API key is not configured");
}

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    currentWeather: weatherData,
    setCurrentWeather,
    addToSearchHistory,
    addToFavorites,
    removeFromFavorites,
    favorites,
    searchHistory,
    clearSearchHistory,
    settings,
    updateSettings,
  } = useStore();

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}?key=${API_KEY}&q=${city}&aqi=no`
      );
      
      if (!response.ok) {
        throw new Error("City not found");
      }
      
      const data = await response.json();
      setCurrentWeather(data);
      addToSearchHistory(city);
      
      toast({
        title: "Success",
        description: `Weather data for ${data.location.name} loaded successfully!`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Try to auto-detect location via Geolocation API, otherwise fallback to London
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // weatherapi accepts lat,lon as q parameter
          fetchWeather(`${latitude},${longitude}`);
        },
        (err) => {
          // permission denied or other error -> fallback
          console.warn("Geolocation failed, falling back to default city:", err.message);
          fetchWeather("London");
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather("London");
    }
  }, []);

  const isDay = weatherData ? !weatherData.current.is_day === false : true;

  return (
    <div className="min-h-screen relative overflow-hidden jarvis-theme">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-jarvis-surface to-jarvis-overlay opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8 jarvis-card bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-2">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-jarvis-primary/10 flex items-center justify-center">
                    <Power className="w-8 h-8 jarvis-icon jarvis-pulse" />
                    <div className="jarvis-radar absolute inset-0"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold jarvis-text-glow tracking-wider text-center md:text-left">
                    J.A.R.V.I.S
                  </h1>
                  <p className="text-sm md:text-base jarvis-status mt-2">
                    Weather Analysis Protocol: Active
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="jarvis-hud p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="jarvis-status success flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      Satellites
                    </p>
                    <p className="jarvis-status flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                      Neural Net
                    </p>
                    <p className="jarvis-status warning flex items-center">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
                      Data Flow
                    </p>
                    <p className="jarvis-status success flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      System
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    const newTheme = settings.theme === "light" ? "dark" : "light";
                    updateSettings({ theme: newTheme });
                    if (typeof document !== "undefined") {
                      document.documentElement.classList.toggle("dark", newTheme === "dark");
                    }
                  }}
                  className="jarvis-button hover:jarvis-border-glow transition-all duration-300"
                >
                  {settings.theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span className="ml-2">{settings.theme === "light" ? "Light Mode" : "Dark Mode"}</span>
                </Button>
              </div>
            </div>
            <div className="jarvis-divider my-6" />
            <p className="text-lg md:text-xl text-center md:text-left opacity-80 tracking-wider font-light">
              Advanced Meteorological Analysis and Response System
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-8">
            <div className="jarvis-card p-8">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2 jarvis-text-glow">Location Analysis</h2>
                  <p className="text-sm opacity-80">Enter coordinates or city name for weather analysis</p>
                </div>
                
                <SearchBar onSearch={fetchWeather} isLoading={isLoading} />
                
                {searchHistory.length > 0 && (
                  <div className="jarvis-hud rounded-lg p-4">
                    <p className="text-sm opacity-80 mb-3">Recent Analyses:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {searchHistory.map((city) => (
                        <Button
                          key={city}
                          variant="outline"
                          size="sm"
                          className="jarvis-button"
                          onClick={() => fetchWeather(city)}
                        >
                          {city}
                          {favorites.includes(city) && (
                            <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {isLoading && (
              <div className="jarvis-card p-12 text-center">
                <div className="relative">
                  <div className="jarvis-radar w-24 h-24 mx-auto">
                    <Loader2 className="w-12 h-12 text-white animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <p className="mt-4 text-sm opacity-80">Analyzing Weather Patterns...</p>
              </div>
            )}
            
            {error && !isLoading && (
              <div className="max-w-2xl mx-auto">
                <div className="jarvis-card p-8 border-error">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <CloudOff className="w-16 h-16 text-error mx-auto" />
                      <div className="absolute inset-0 bg-error/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-error mb-2">
                      System Alert: Data Retrieval Failed
                    </h3>
                    <p className="text-error/80">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {weatherData && !isLoading && !error && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <WeatherCard weather={weatherData} />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="jarvis-divider" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <p className="text-white/60 text-sm">
                  Real-time Weather Analysis System
                </p>
              </div>
              <p className="text-white/80 text-sm">
                <span className="jarvis-text-glow">JARVIS</span> • Powered by WeatherAPI.com
              </p>
              <Button 
                variant="ghost" 
                className="jarvis-button hover:jarvis-border-glow text-sm"
                onClick={() => window.open('https://github.com/mriganka-77', '_blank')}
              >
                Developed by Mriganka Chakraborty
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}