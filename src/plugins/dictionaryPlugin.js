import axios from 'axios';

const dictionaryPlugin = {
  name: 'dictionary',
  description: 'Get word definitions',

  naturalLanguagePatterns: [
    {
      regex: /(?:define|meaning of|definition of)\s+(.+)/i,
      extractArgs: (message) => {
        const match = message.match(/(?:define|meaning of|definition of)\s+(.+)/i);
        return match ? match[1] : message;
      }
    },
    {
      regex: /what\s+(?:does|is|do)\s+(.+?)\s+mean/i,
      extractArgs: (message) => {
        const match = message.match(/what\s+(?:does|is|do)\s+(.+?)\s+mean/i);
        return match ? match[1] : message;
      }
    }
  ],

  async execute(word) {
    if (!word) {
      throw new Error('Please provide a word to define');
    }

    const cleanWord = word.trim().toLowerCase();
    if (!cleanWord) {
      throw new Error('Invalid word');
    }

    try {
      console.log('Fetching definition for:', cleanWord);
      const response = await axios.get(`${import.meta.env.VITE_DICTIONARY_BASE_URL}/${encodeURIComponent(cleanWord)}`);
      console.log('Dictionary API response:', response.data);
      
      const [result] = response.data;
      if (!result || !result.meanings || !result.meanings.length) {
        throw new Error('No definition found');
      }

      const definitions = result.meanings.map(meaning => ({
        partOfSpeech: meaning.partOfSpeech,
        definition: meaning.definitions[0].definition,
      }));

      return {
        word: result.word,
        phonetic: result.phonetic || '',
        definitions,
        summary: `${result.word}: ${definitions[0].definition}`,
      };
    } catch (error) {
      console.error('Dictionary error:', error);
      if (error.response?.status === 404) {
        throw new Error('Word not found');
      }
      throw new Error('Failed to fetch definition');
    }
  },
};

export default dictionaryPlugin; 