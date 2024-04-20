require('dotenv').config();
const axios = require('axios');

const fetchGeminiReports = async (weatherData) => {
  const url = 'https://api.gemini.com/reports/data';  // Use the actual API endpoint
  try {
    const response = await axios.post(url, weatherData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports from Gemini:', error);
    return null;
  }
};

module.exports = fetchGeminiReports;


