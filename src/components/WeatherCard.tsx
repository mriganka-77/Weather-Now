import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Thermometer, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeatherData } from "@/types/weather";
import useStore from "@/store/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { favorites, addToFavorites, removeFromFavorites, settings } = useStore();
  const isFavorite = favorites.includes(weather.location.name);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(weather.location.name);
    } else {
      addToFavorites(weather.location.name);
    }
  };
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("rain")) return <CloudRain className="w-24 h-24" />;
    if (lowerCondition.includes("cloud")) return <Cloud className="w-24 h-24" />;
    return <Sun className="w-24 h-24" />;
  };

  const temperature = settings.temperatureUnit === 'C' 
    ? Math.round(weather.current.temp_c) 
    : Math.round(weather.current.temp_f);

  const feelsLike = settings.temperatureUnit === 'C'
    ? Math.round(weather.current.feelslike_c)
    : Math.round(weather.current.feelslike_f);

  return (
    <div className="jarvis-card p-8 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="jarvis-hud px-4 py-2">
              <h2 className="text-3xl font-bold jarvis-text-glow">
                {weather.location.name}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`jarvis-button ${isFavorite ? 'jarvis-pulse' : ''}`}
              onClick={toggleFavorite}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <p className="jarvis-status">
            {weather.location.region}, {weather.location.country}
          </p>
          <p className="text-sm opacity-60 mt-1">
            {new Date(weather.location.localtime).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-center relative">
          <div className="jarvis-radar mb-4 p-8">
            {getWeatherIcon(weather.current.condition.text)}
          </div>
          <div className="jarvis-hud px-4 py-2">
            <p className="text-lg font-medium jarvis-text-glow">
              {weather.current.condition.text}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-8 jarvis-card p-6 relative">
        <div className="absolute inset-0 jarvis-radar opacity-20"></div>
        <div className="relative z-10">
          <div className="text-6xl font-bold jarvis-text-glow mb-2">
            {temperature}°{settings.temperatureUnit}
          </div>
          <div className="flex items-center justify-center gap-2 opacity-80">
            <Thermometer className="w-4 h-4 jarvis-icon" />
            <span>Thermal Analysis: {feelsLike}°{settings.temperatureUnit}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="jarvis-status">Processing</div>
            <div className="jarvis-status success">Verified</div>
            <div className="jarvis-status">Real-time</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="jarvis-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 jarvis-icon" />
            <span className="text-sm opacity-80">Wind Speed Analysis</span>
          </div>
          <p className="text-xl font-semibold jarvis-text-glow">
            {weather.current.wind_kph} km/h
          </p>
          <div className="mt-2 h-1 bg-[hsl(var(--jarvis-primary)/0.2)] rounded">
            <div 
              className="h-full bg-[hsl(var(--jarvis-primary))] rounded jarvis-pulse"
              style={{ width: `${Math.min(100, (weather.current.wind_kph / 100) * 100)}%` }}
            />
          </div>
        </div>

        <div className="jarvis-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 jarvis-icon" />
            <span className="text-sm opacity-80">Humidity Level</span>
          </div>
          <p className="text-xl font-semibold jarvis-text-glow">
            {weather.current.humidity}%
          </p>
          <div className="mt-2 h-1 bg-[hsl(var(--jarvis-primary)/0.2)] rounded">
            <div 
              className="h-full bg-[hsl(var(--jarvis-primary))] rounded jarvis-pulse"
              style={{ width: `${weather.current.humidity}%` }}
            />
          </div>
        </div>

        <div className="jarvis-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 jarvis-icon" />
            <span className="text-sm opacity-80">Visibility Range</span>
          </div>
          <p className="text-xl font-semibold jarvis-text-glow">
            {weather.current.vis_km} km
          </p>
          <div className="mt-2 h-1 bg-[hsl(var(--jarvis-primary)/0.2)] rounded">
            <div 
              className="h-full bg-[hsl(var(--jarvis-primary))] rounded jarvis-pulse"
              style={{ width: `${Math.min(100, (weather.current.vis_km / 10) * 100)}%` }}
            />
          </div>
        </div>

        <div className="jarvis-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-5 h-5 jarvis-icon" />
            <span className="text-sm opacity-80">UV Radiation</span>
          </div>
          <p className="text-xl font-semibold jarvis-text-glow">
            {weather.current.uv}
          </p>
          <div className="mt-2 h-1 bg-[hsl(var(--jarvis-primary)/0.2)] rounded">
            <div 
              className="h-full bg-[hsl(var(--jarvis-primary))] rounded jarvis-pulse"
              style={{ width: `${Math.min(100, (weather.current.uv / 11) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}