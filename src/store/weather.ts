import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherData, ForecastData } from '@/types/weather';

interface WeatherStore {
  // Current weather
  currentWeather: WeatherData | null;
  setCurrentWeather: (weather: WeatherData) => void;
  fetchWeather: (city: string) => Promise<void>;
  
  // Forecast data
  forecast: ForecastData | null;
  setForecast: (forecast: ForecastData) => void;
  
  // Search history
  searchHistory: string[];
  addToSearchHistory: (city: string) => void;
  clearSearchHistory: () => void;
  
  // Favorites
  favorites: string[];
  addToFavorites: (city: string) => void;
  removeFromFavorites: (city: string) => void;
  
  // Settings
  settings: {
    temperatureUnit: 'C' | 'F';
    theme: 'light' | 'dark';
  };
  updateSettings: (settings: Partial<WeatherStore['settings']>) => void;
  
  // System status
  systemStatus: {
    isOnline: boolean;
    satelliteConnection: boolean;
    neuralNetworkStatus: boolean;
    lastUpdate: string;
  };
  updateSystemStatus: (status: Partial<WeatherStore['systemStatus']>) => void;
}

const useStore = create<WeatherStore>()(
  persist(
    (set) => ({
      // Current weather
      currentWeather: null,
      setCurrentWeather: (weather) => set({ currentWeather: weather }),
      fetchWeather: async (city) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
          );
          if (!response.ok) throw new Error('Weather data fetch failed');
          const data = await response.json();
          set((state) => ({
            currentWeather: data,
            systemStatus: {
              ...state.systemStatus,
              lastUpdate: new Date().toISOString(),
            },
          }));
        } catch (error) {
          console.error('Error fetching weather:', error);
          throw error;
        }
      },
      
      // Forecast data
      forecast: null,
      setForecast: (forecast) => set({ forecast }),
      
      // Search history
      searchHistory: [],
      addToSearchHistory: (city) =>
        set((state) => ({
          searchHistory: [
            city,
            ...state.searchHistory.filter((c) => c !== city)
          ].slice(0, 5), // Keep only last 5 searches
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      // Favorites
      favorites: [],
      addToFavorites: (city) =>
        set((state) => ({
          favorites: state.favorites.includes(city)
            ? state.favorites
            : [...state.favorites, city],
        })),
      removeFromFavorites: (city) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c !== city),
        })),
      
      // Settings
      settings: {
        temperatureUnit: 'C',
        theme: 'light',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      // System status
      systemStatus: {
        isOnline: true,
        satelliteConnection: true,
        neuralNetworkStatus: true,
        lastUpdate: new Date().toISOString(),
      },
      updateSystemStatus: (status) =>
        set((state) => ({
          systemStatus: { ...state.systemStatus, ...status },
        })),
    }),
    {
      name: 'weather-storage',
    }
  )
);

export default useStore;