import GoogleMapReact from 'google-map-react';
import React, { useEffect, useState } from 'react';

const AnyReactComponent = ({ text }) => <div style={{ padding: '5px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>{text}</div>;

const WeatherMap = ({ center, zoom, weatherData }) => {
  const [mapsApi, setMapsApi] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [airQuality, setAirQuality] = useState(null);

  // Function to fetch air quality data
  const fetchAirQualityData = async (lat, lng) => {
    try {
      const response = await fetch('https://airquality.googleapis.com/v1/currentConditions:lookup?key=AIzaSyBjirZCl2bHU4ilAtNU7AuxQDN3m5MG8cA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          universalAqi: true,
          location: {
            latitude: lat,
            longitude: lng
          },
          extraComputations: [
            "HEALTH_RECOMMENDATIONS",
            "DOMINANT_POLLUTANT_CONCENTRATION",
            "POLLUTANT_CONCENTRATION",
            "LOCAL_AQI",
            "POLLUTANT_ADDITIONAL_INFO"
          ],
          languageCode: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAirQuality(data);
    } catch (error) {
      console.error("Error fetching air quality data:", error);
    }
  };

  useEffect(() => {
    const latitude = center.lat;
    const longitude = center.lng;

    if (latitude && longitude) {
      fetchAirQualityData(latitude, longitude);
    }
  }, [center]);

  const handleApiLoaded = ({ map, maps }) => {
    setMapsApi(maps);
    setMapInstance(map);
  };

  useEffect(() => {
    if (mapInstance && center && mapsApi) {
      const centerLatLng = new mapsApi.LatLng(center.lat, center.lng);
      mapInstance.panTo(centerLatLng);
      mapInstance.setZoom(zoom || 11);
    }
  }, [center, zoom, mapsApi, mapInstance]);

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex' }}>
      <div style={{ width: '75%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'YOUR_API_KEY', // Use your actual Google Maps API key
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
      <div style={{ width: '25%', padding: '20px', background: '#f4f4f4', overflowY: 'auto' }}>
        {airQuality ? (
          <>
            <h4 style={{ color: '#333', margin: '0 0 10px 0' }}>Air Quality Details:</h4>
            <div style={{ marginBottom: '20px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h5>Indexes:</h5>
              {airQuality.indexes.map((index, idx) => (
                <p key={idx} style={{ margin: '5px 0' }}>
                  <strong>{index.displayName}:</strong> {index.aqi} 
                  <span style={{ color: index.color.color, fontWeight: 'bold', marginLeft: '10px' }}>Color: {index.color.color}</span>
                </p>
              ))}
            </div>
            <div style={{ marginBottom: '20px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h5>Pollutant Levels:</h5>
              {airQuality.pollutants.map((pollutant, idx) => (
                <p key={idx} style={{ margin: '5px 0' }}>
                  <strong>{pollutant.displayName} ({pollutant.fullName}):</strong> {pollutant.concentration.value} 
                  <div style={{fontSize: "10px"}}>{pollutant.concentration.units}</div>
                </p>
              ))}
            </div>
            <div style={{ marginBottom: '20px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h5>Health Recommendations:</h5>
              {Object.keys(airQuality.healthRecommendations).map(key => (
                <p key={key} style={{ margin: '5px 0' }}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: </strong>{airQuality.healthRecommendations[key]}
                </p>
              ))}
            </div>
            <div style={{ marginBottom: '20px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h5>Additional Pollutant Information:</h5>
              {airQuality.pollutants.map((pollutant, idx) => (
                <div key={idx}>
                  <p><strong>{pollutant.displayName} Effects:</strong> {pollutant.additionalInfo.effects}</p>
                  <p><strong>{pollutant.displayName} Sources:</strong> {pollutant.additionalInfo.sources}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No air quality data available.</p>
        )}
      </div>
    </div>
  );
};

export default WeatherMap;
