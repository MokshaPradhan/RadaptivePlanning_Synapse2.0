
// pages/IndexPage.js
'use client'
import React, { useEffect, useState } from 'react';
import WeatherMap from '../../../components/SolarMap';
import axios from 'axios';
const IndexPage = ({ params }) => {
  const [lat, setLat] = useState(59.45);  // Default latitude
  const [lng, setLng] = useState(30.33);  // Default longitude

  useEffect(() => {
    if (params.slug) {
      const decodedSlug = decodeURIComponent(params.slug);
      const parts = decodedSlug.split('&');
      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key === 'lat') {
          setLat(parseFloat(value));
        } else if (key === 'lng') {
          setLng(parseFloat(value));
        }
      });
    }
  }, [params.slug]);

  if (!lat || !lng) {
    return <p>Loading...</p>;
  }
console.log(lat,lng)
  const center = { lat, lng };
  const zoom = 11; // You can adjust zoom level as needed
  const weatherData = [
    { lat, lng, temperature: '10°C' },
    // Add more data points here if necessary
  ];

  return <WeatherMap center={center} zoom={zoom} weatherData={weatherData} />;
};

export default IndexPage;