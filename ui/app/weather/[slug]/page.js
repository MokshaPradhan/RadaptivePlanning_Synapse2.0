// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import WeatherMap from "../../../components/WeatherMap";

// const IndexPage = ({params}) => {
//   const [lat,setlat]=useState(59.45)
//   const [lng,setlng]=useState(30.33)
//   console.log(params.slug)
//   useEffect(()=>{
//     if(params.slug){
// setlat(slug.lat)
// setlng(slud.lng)
//     }
//   },[params.slug])
//   const router = useRouter();

//   // Assuming you need to wait for the lat and lng to be available
//   if (!lat || !lng) {
//     return <p>Loading...</p>; // or any other loading state indication
//   }

//   // Now you can use these values dynamically, for example:
//   const weatherData = [
//     { lat: parseFloat(lat), lng: parseFloat(lng), temperature: '10°C' },
//     // You can add more data points if necessary
//   ];

//   return <WeatherMap weatherData={weatherData} />;
// };

// export default IndexPage;


import React from 'react';
import { useRouter } from 'next/router';
import WeatherMap from "../../../components/WeatherMap"

const IndexPage = () => {
  const router = useRouter();
  console.log(router.query)
  const { lat, lng } = router.query;

  // Example default data to use if parameters are not provided
  const defaultWeatherData = [
    { lat: 59.95, lng: 30.33, temperature: '10°C' },
    // Add more default data points here
  ];

  // Dynamic weather data based on URL parameters
  const weatherData = lat && lng ? [{ lat: parseFloat(lat), lng: parseFloat(lng), temperature: 'Loading...' }] : defaultWeatherData;

  return <WeatherMap weatherData={weatherData} />;
};

export default IndexPage;
