import { useState, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useStore from '@/store/weather';

interface VoiceResponse {
  message: string;
  type: 'info' | 'success' | 'error';
}

export default function VoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const { fetchWeather } = useStore();

  const processVoiceCommand = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Extract city name after "weather in" or "weather for"
    const weatherInMatch = lowerTranscript.match(/weather (?:in|for) (.*)/i);
    if (weatherInMatch) {
      const city = weatherInMatch[1].trim();
      setResponse({ message: `Analyzing weather data for ${city}...`, type: 'info' });
      fetchWeather(city);
      return;
    }

    setResponse({ 
      message: 'Command not recognized. Try "weather in [city name]"', 
      type: 'error' 
    });
  }, [fetchWeather]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setResponse({ 
        message: 'Voice recognition not supported in this browser', 
        type: 'error' 
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setResponse({ message: 'Voice recognition active...', type: 'info' });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setResponse({ message: `Processing: "${transcript}"`, type: 'info' });
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      setResponse({ message: `Error: ${event.error}`, type: 'error' });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [processVoiceCommand]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (response) {
      timeout = setTimeout(() => {
        setResponse(null);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [response]);

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-4">
      {response && (
        <div className={`jarvis-card p-3 flex items-center gap-2 animate-in slide-in-from-right-4 ${
          response.type === 'error' ? 'border-red-500' :
          response.type === 'success' ? 'border-green-500' : ''
        }`}>
          {response.type === 'info' && <Radio className="w-4 h-4 jarvis-icon animate-pulse" />}
          {response.type === 'success' && <Volume2 className="w-4 h-4 jarvis-icon text-green-500" />}
          {response.type === 'error' && <MicOff className="w-4 h-4 jarvis-icon text-red-500" />}
          <span className="text-sm">{response.message}</span>
        </div>
      )}
      <Button
        className={`jarvis-button rounded-full w-12 h-12 p-0 ${
          isListening ? 'jarvis-pulse border-red-500' : ''
        }`}
        onClick={startListening}
      >
        <Mic className={`w-6 h-6 ${isListening ? 'text-red-500' : ''}`} />
      </Button>
    </div>
  );
}