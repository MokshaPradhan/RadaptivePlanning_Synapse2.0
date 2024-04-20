require('dotenv').config();
const axios = require('axios');

const fetchGoogleWeatherData = async (location) => {
  const url = `https://maps.googleapis.com/maps/api/weather/json?address=${location}&key=${process.env.GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data from Google:', error);
    return null;
  }
};

module.exports = fetchGoogleWeatherData;
