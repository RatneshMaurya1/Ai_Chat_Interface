import axios from 'axios';

const weatherPlugin = {
  name: 'weather',
  description: 'Get current weather for a location',
  
  naturalLanguagePatterns: [
    {
      regex: /weather\s+(?:in|at|for)?\s*(.+)/i,
      extractArgs: (message) => {
        const match = message.match(/weather\s+(?:in|at|for)?\s*(.+)/i);
        return match ? match[1] : message;
      }
    },
    {
      regex: /(?:what'?s|what\s+is)\s+(?:the\s+)?weather\s+(?:like\s+)?(?:in|at|for)?\s*(.+)/i,
      extractArgs: (message) => {
        const match = message.match(/(?:what'?s|what\s+is)\s+(?:the\s+)?weather\s+(?:like\s+)?(?:in|at|for)?\s*(.+)/i);
        return match ? match[1] : message;
      }
    }
  ],

  async execute(location) {
    if (!location) {
      throw new Error('Please provide a location');
    }

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key is not configured');
    }

    try {
      const response = await axios.get(import.meta.env.VITE_OPENWEATHER_BASE_URL, {
        params: {
          q: location,
          appid: apiKey,
          units: 'metric',
        },
      });

      const { main, weather, name } = response.data;
      
      return {
        location: name,
        temperature: Math.round(main.temp),
        description: weather[0].description,
        humidity: main.humidity,
        summary: `${name}: ${Math.round(main.temp)}°C, ${weather[0].description}`,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Location not found');
      }
      throw new Error('Failed to fetch weather data');
    }
  },
};

export default weatherPlugin; 