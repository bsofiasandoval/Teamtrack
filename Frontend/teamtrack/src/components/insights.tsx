import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
    precip_mm: number;
  };
}

interface WeatherWidgetProps {
  city: string;
}

const Insights = ({ city }: WeatherWidgetProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
       
        const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
        
        if (!API_KEY) {
          throw new Error('API key is missing');
        }

        const cityQuery = encodeURIComponent(city.trim());
        
        if (!cityQuery) {
          throw new Error('City name is required');
        }

        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityQuery}&aqi=no`
        );
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Weather data not available (${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setWeatherData(data);
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
          
        
          if (retryCount < 2 && err instanceof Error && !err.message.includes('API key')) {
            setRetryCount(prev => prev + 1);
            const retryTimer = setTimeout(() => fetchWeather(), 2000);
            return () => clearTimeout(retryTimer);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWeather();
    
    return () => {
      isMounted = false;
    };
  }, [city, retryCount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md h-64 flex flex-col items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-red-500 text-center">{error}</p>
        <button 
          onClick={() => setRetryCount(prev => prev + 1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{weatherData.location.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{weatherData.location.region}, {weatherData.location.country}</p>
        
        <div className="flex items-center mb-4">
          <img 
            src={`https:${weatherData.current.condition.icon}`}
            alt={weatherData.current.condition.text}
            className="w-16 h-16"
          />
          <div className="flex flex-col ml-2">
            <span className="text-4xl font-bold text-gray-800">
              {Math.round(weatherData.current.temp_c)}°C
            </span>
            <span className="text-sm text-gray-600">
              Feels like {Math.round(weatherData.current.feelslike_c)}°C
            </span>
          </div>
        </div>

        <p className="text-gray-600 capitalize mb-4">
          {weatherData.current.condition.text}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 w-full">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
            <span>Humidity: {weatherData.current.humidity}%</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>Wind: {Math.round(weatherData.current.wind_kph)} km/h</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Precipitation: {weatherData.current.precip_mm} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;