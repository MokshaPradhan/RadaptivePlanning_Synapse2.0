// components/WeatherMap.js

import GoogleMapReact from 'google-map-react';
import React, { useState, useEffect } from 'react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const WeatherMap = ({ center, zoom, weatherData }) => {
  const [mapsApi, setMapsApi] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Heatmap data points
  let heatmapData = [];
  if (weatherData && mapsApi && mapInstance) {
    heatmapData = weatherData.map((data) => {
      return new mapsApi.LatLng(data.lat, data.lng);
    });

    // Create a new heatmap overlay
    const heatmap = new mapsApi.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstance,
    });
  }

  // Callback function to run when the map is loaded
  const handleApiLoaded = ({ map, maps }) => {
    setMapsApi(maps);
    setMapInstance(map);
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your Google Maps API key
          libraries: 'visualization', // To use the Heatmap Layer
        }}
        defaultCenter={center}
        defaultZoom={zoom}
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

WeatherMap.defaultProps = {
  center: {
    lat: 59.95,
    lng: 30.33,
  },
  zoom: 11,
};

export default WeatherMap;
