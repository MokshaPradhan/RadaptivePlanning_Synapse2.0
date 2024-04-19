import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const WeatherMap = ({ center, zoom, weatherData }) => {
  const [mapsApi, setMapsApi] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [dataLayers, setDataLayers] = useState(null); // State to store data layers

  // Function to fetch data layers
  const fetchDataLayers = async (latitude, longitude) => {
    const url = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${latitude}&location.longitude=${longitude}&radiusMeters=100&view=FULL_LAYERS&requiredQuality=HIGH&pixelSizeMeters=0.5&key=AIzaSyBjirZCl2bHU4ilAtNU7AuxQDN3m5MG8cA`;
    try {
      const response = await axios.get(url);
      setDataLayers(response.data);
    } catch (error) {
      console.error('Error fetching data layers:', error);
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
    heatmapData = weatherData.map((data) => new mapsApi.LatLng(data.lat, data.lng));

    new mapsApi.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstance,
    });
  }

  // Callback function to run when the map and APIs are loaded
  const handleApiLoaded = ({ map, maps }) => {
    setMapsApi(maps);
    setMapInstance(map);
    if (center) {
      fetchDataLayers(center.lat, center.lng);
    }
  };

  // Listen for changes in the center prop and update the map instance
  useEffect(() => {
    if (mapInstance && center && mapsApi) {
      mapInstance.panTo(new mapsApi.LatLng(center.lat, center.lng));
    }
  }, [center, mapsApi, mapInstance]);

  // Map options for satellite view
  const createMapOptions = (maps) => ({
    mapTypeId: maps.MapTypeId.SATELLITE,
    mapTypeControl: true
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyBjirZCl2bHU4ilAtNU7AuxQDN3m5MG8cA', // Insert your API key here
          libraries: 'visualization',
        }}
        center={center}
        zoom={zoom || 11}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
        options={createMapOptions}
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
