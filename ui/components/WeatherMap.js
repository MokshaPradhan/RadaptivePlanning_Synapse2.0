// components/WeatherMap.js
import GoogleMapReact from 'google-map-react';
import React from 'react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const WeatherMap = ({ center, zoom, weatherData }) => {
  const [mapsApi, setMapsApi] = React.useState(null);
  const [mapInstance, setMapInstance] = React.useState(null);
console.log(weatherData)
  // Heatmap data points
  let heatmapData = [];
  if (weatherData && mapsApi && mapInstance) {
    heatmapData = weatherData.map((data) => {
        console.log("hiii",data.lat,data.lng)
      return new mapsApi.LatLng(data.lat, data.lng);
    });

    // Create a new heatmap overlay
    new mapsApi.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstance,
    });
  }

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
  center: { lat: 59.95, lng: 30.33 },
  zoom: 11,
};

export default WeatherMap;
