const express = require('express');
const fetchGoogleWeatherData = require('./fetchWeatherData');
const fetchGeminiReports = require('./fetchGeminiReport');

const app = express();
const port = 3000;

app.get('/weather/:location', async (req, res) => {
  const weatherData = await fetchGoogleWeatherData(req.params.location);
  const geminiReport = await fetchGeminiReports(weatherData);
  res.json(geminiReport);
});

app.get('/',(req,res)=>{
  res.json({message:"hello"})
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
