import { useEffect, useState } from "react";

interface WeatherBackgroundProps {
  condition?: string;
  isDay?: boolean;
}

export default function WeatherBackground({ condition = "", isDay = true }: WeatherBackgroundProps) {
  const [gradient, setGradient] = useState("bg-gradient-sunny");

  useEffect(() => {
    const lowerCondition = condition.toLowerCase();
    
    if (!isDay) {
      setGradient("bg-gradient-night");
    } else if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      setGradient("bg-gradient-rainy");
    } else if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast")) {
      setGradient("bg-gradient-cloudy");
    } else {
      setGradient("bg-gradient-sunny");
    }
  }, [condition, isDay]);

  return (
    <>
      <div className={`fixed inset-0 ${gradient} transition-all duration-1000 ease-in-out`} />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
      
      {/* Animated particles for atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            <div className="w-2 h-2 bg-white/10 rounded-full blur-sm" />
          </div>
        ))}
      </div>
    </>
  );
}