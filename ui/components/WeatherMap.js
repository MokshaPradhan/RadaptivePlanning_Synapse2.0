// components/WeatherMap.js
import GoogleMapReact from 'google-map-react';
import React from 'react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const WeatherMap = ({ center, zoom, weatherData }) => {
  const [mapsApi, setMapsApi] = React.useState(null);
  const [mapInstance, setMapInstance] = React.useState(null);

  // Print current weather data to console
  console.log(weatherData);

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

  // Callback function to run when the map is loaded
  const handleApiLoaded = ({ map, maps }) => {
    setMapsApi(maps);
    setMapInstance(map);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyCQEjBzl2MSx3l7rvE6aTOGkJGaQBUzQvI', // Place your Google Maps API key here
          libraries: 'visualization',
        }}
        defaultCenter={center || { lat: 59.95, lng: 30.33 }}  // Use passed center or default
        defaultZoom={zoom || 11}  // Use passed zoom or default
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
