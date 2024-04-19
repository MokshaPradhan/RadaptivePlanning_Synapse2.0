import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios'; 

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const WeatherMap = ({ center, zoom, weatherData }) => {
  const [mapsApi, setMapsApi] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [dataLayers, setDataLayers] = useState(null); // State to store data layers

  console.log("Current weather data:", weatherData);
  console.log("Center:", center);

  // Function to fetch data layers
  const fetchDataLayers = async (latitude, longitude) => {
    console.log("heys",latitude,longitude)
    const url = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${latitude}&location.longitude=${longitude}&radiusMeters=2&view=FULL_LAYERS&key=AIzaSyBjirZCl2bHU4ilAtNU7AuxQDN3m5MG8cA`;
  console.log(url)
    try {
      const response = await axios.get(url);
      setDataLayers(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error message:', error.message);
      }
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  
 
  useEffect(() => {
    console.log('center',center)
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
          key: 'AIzaSyBjirZCl2bHU4ilAtNU7AuxQDN3m5MG8cA',
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
