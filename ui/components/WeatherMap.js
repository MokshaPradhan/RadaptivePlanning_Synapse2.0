// components/WeatherMap.js
import GoogleMapReact from 'google-map-react';
import React, { useEffect } from 'react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const WeatherMap = ({ center, zoom, weatherData }) => {
  const [mapsApi, setMapsApi] = React.useState(null);
  const [mapInstance, setMapInstance] = React.useState(null);

  console.log("Current weather data:", weatherData);
  console.log("Center:", center);

  // Heatmap data points
  let heatmapData = [];
  if (weatherData && mapsApi && mapInstance) {
    heatmapData = weatherData.map((data) => {
      console.log("Mapping data:", data.lat, data.lng);
      return new mapsApi.LatLng(data.lat, data.lng);
    });

    // Create a new heatmap overlay
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
          key: 'AIzaSyCQEjBzl2MSx3l7rvE6aTOGkJGaQBUzQvI', // Place your Google Maps API key here
          libraries: 'visualization',
        }}
        center={center} // Use passed center to immediately center the map
        zoom={zoom || 11} // Use passed zoom or default
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
