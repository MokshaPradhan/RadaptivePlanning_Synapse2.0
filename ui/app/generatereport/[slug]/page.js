'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportPage = ({ params }) => {
  const [lat, setLat] = useState(59.45);  // Default latitude
  const [lng, setLng] = useState(30.33);  // Default longitude
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered');
    if (params.slug) {
      const decodedSlug = decodeURIComponent(params.slug);
      const parts = decodedSlug.split('&');
      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key === 'lat') {
          setLat(parseFloat(value));
          console.log('Latitude set to:', value);
        } else if (key === 'lng') {
          setLng(parseFloat(value));
          console.log('Longitude set to:', value);
        }
      });
    }
  }, [params.slug]);
  const fetchAirQualityData = async (latitude, longitude) => {
    const postData = {
      location: {
        latitude: latitude,
        longitude: longitude
      }
    };
  
    const apiKey = 'AIzaSyBjirZCl2bHU4ilAtNU7AuxQDN3m5MG8cA'; // Replace 'YOUR_API_KEY' with your actual API key
    const apiUrl = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`;
  
    try {
      const response = await axios.post(apiUrl, postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Air Quality Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
      // Handle errors appropriately in your application
      return null;
    }
  };
  const handleGenerateReport = async () => {
    console.log('handleGenerateReport initiated');
    if (!lat || !lng) {
      setError('Latitude and longitude are required.');
      console.log('Error: Latitude and longitude are required');
      return;
    }

    setLoading(true);
    setError(null);
    console.log('Fetching data...');

    try {
      const solarApi = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=37.4450&location.longitude=-122.1390&requiredQuality=HIGH&key=AIzaSyBjirZCl2bHU4ilAtNU7AuxQDN3m5MG8cA`;
      const weatherApi = 'https://apjoy-weather-forecast.p.rapidapi.com/forecast?location=London&days=3';
      console.log(solarApi)
      const responses = await Promise.all([
        axios.get(solarApi),
        fetchAirQualityData(lat, lng), 
        axios.get(weatherApi, {
          headers: { 'X-RapidAPI-Key': '0680fa91dcmsh1d22c304dfd3200p127ddfjsn35b5771e2ff9', 'X-RapidAPI-Host': 'apjoy-weather-forecast.p.rapidapi.com' }
        })
      ]);

      console.log('Data fetched:', responses);
      setReportData({
        solar: responses[0].data,
        airQuality: responses[1],
        weather: responses[2].data  // Fix: Index should be corrected based on actual response order
      });
    } catch (err) {
      setError('Failed to fetch data. Please check the console for more details.');
      console.error('Fetch error:', err);
    }

    setLoading(false);
  };
  useEffect(() => {
    console.log('Latitude or Longitude changed, generating report...');
    handleGenerateReport();
  }, [lat, lng]); // Only re-run the effect if lat or lng changes
  
  return (
    <div>
      <h1>Environmental Report</h1>
      <button onClick={handleGenerateReport} disabled={loading || !lat || !lng}>
        {loading ? 'Loading...' : 'Generate Report'}
      </button>
      {error && <p>Error: {error}</p>}
      {reportData && (
        <div>
          <h2>Report Details</h2>
          <div>
            <h3>Solar Data:</h3>
            <pre>{JSON.stringify(reportData.solar, null, 2)}</pre>
          </div>
          <div>
            <h3>Wind Data:</h3>
            <pre>{JSON.stringify(reportData.wind, null, 2)}</pre>
          </div>
          <div>
            <h3>Air Quality Data:</h3>
            <pre>{JSON.stringify(reportData.airQuality, null, 2)}</pre>
          </div>
          <div>
            <h3>Weather Data:</h3>
            <pre>{JSON.stringify(reportData.weather, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
