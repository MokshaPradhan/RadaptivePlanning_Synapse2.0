import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios'; // Import axios here

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const WeatherMap = ({ center, zoom, weatherData }) => {
  const [mapsApi, setMapsApi] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [dataLayers, setDataLayers] = useState(null); // State to store data layers

  console.log("Current weather data:", weatherData);
  console.log("Center:", center);

  // Function to fetch data layers
const fetchDataLayers = async (latitude, longitude) => {
  const apiKey = 'AIzaSyBIJOPH26-9JVs6rw8801a4IGyB65ZUtQQ'; // Replace with your actual API key
  const url = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${latitude}&location.longitude=${longitude}&radiusMeters=10000&view=FULL_LAYERS&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    setDataLayers(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      // Handle specific status codes
      if (error.response.status === 403) {
        console.error('Access denied. Check API key and permissions.');
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error fetching data:', error);
  }
};

  // Effect to fetch data layers when center changes
  useEffect(() => {
    if (center) {
      fetchDataLayers(center.lat, center.lng);
    }
  }, [center]);

  // Heatmap data points
  let heatmapData = [];
  if (weatherData && mapsApi && mapInstance) {
    heatmapData = weatherData.map((data) => {
      console.log("Mapping data:", data.lat, data.lng);
      return new mapsApi.LatLng(data.lat, data.lng);
    });

    new mapsApi.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstance,
    });
  }

  // Callback function to run when the map and APIs are loaded
  const handleApiLoaded = ({ map, maps }) => {
    setMapsApi(maps);
    setMapInstance(map);
  };

  // Listen for changes in the center prop and update the map instance
  useEffect(() => {
    if (mapInstance && center) {
      mapInstance.panTo(new mapsApi.LatLng(center.lat, center.lng));
    }
  }, [center, mapsApi, mapInstance]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'YOUR_GOOGLE_MAPS_API_KEY',
          libraries: 'visualization',
        }}
        center={center}
        zoom={zoom || 11}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      >
        {weatherData &&
          weatherData.map((data, index) => (
            <AnyReactComponent
              key={index}
              lat={data.lat}
              lng={data.lng}
              text={data.temperature}
            />
          ))}
      </GoogleMapReact>
    </div>
  );
};

export default WeatherMap;
