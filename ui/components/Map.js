import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import Link from 'next/link';

const GoogleMapsComponent = ({ defaultPlace }) => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mapElementRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isMapLoaded && window.google) {
      initMap();
      setIsMapLoaded(true);
    }
  }, [isMapLoaded]);

  const initMap = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const geocoderResponse = await geocoder.geocode({ address: defaultPlace.address });
    const geocoderResult = geocoderResponse.results[0];

    const mapInstance = new window.google.maps.Map(mapElementRef.current, {
      center: geocoderResult.geometry.location,
      zoom: 15,
      tilt: 0,
      mapTypeId: 'satellite',
      mapTypeControl: false,
      fullscreenControl: false,
      rotateControl: false,
      streetViewControl: false,
      zoomControl: false,
    });

    setMap(mapInstance);
    setLocation({
      lat: geocoderResult.geometry.location.lat(),
      lng: geocoderResult.geometry.location.lng(),
      searchQuery: defaultPlace.name,
    });

    const defaultMarker = new google.maps.Marker({
      position: geocoderResult.geometry.location,
      map: mapInstance,
      title: defaultPlace.name,
    });
    setMarker(defaultMarker);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || !window.google || !map) return;

    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder.geocode({ address: searchQuery });
    if (response.results.length > 0) {
      const newLocation = response.results[0].geometry.location;
      map.setCenter(newLocation);
      setLocation({
        lat: newLocation.lat(),
        lng: newLocation.lng(),
        searchQuery: searchQuery,
      });

      if (marker) {
        marker.setPosition(newLocation);
      } else {
        const newMarker = new google.maps.Marker({
          position: newLocation,
          map: map,
        });
        setMarker(newMarker);
      }
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCQEjBzl2MSx3l7rvE6aTOGkJGaQBUzQvI&libraries=places`}
        strategy="beforeInteractive"
        onLoad={() => {
          if (!isMapLoaded) {
            initMap();
          }
        }}
      />
      <div className="flex text-black">
        <div ref={mapElementRef} className="w-full h-screen" />
        <aside className="w-1/3 p-4 h-screen overflow-auto bg-gray-100">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              placeholder="Search for places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded-lg"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg">
              Search
            </button>
          </form>
          <div>
            <h2 className="font-bold">Location Details</h2>
            {location && (
              <p>Search Query: {location.searchQuery || 'N/A'}</p>
            )}
          </div>
          <div>
            {/* <Link href={`/solar/lat=${location?.lat}&lng=${location?.lng}`} */}
            <Link href={'http://localhost:5173/'}
               className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg block text-center">Solar Data
            </Link>
            <Link href={"http://127.0.0.1:5500/demo/demo.html"}
               className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg block text-center">Wind Data
            </Link>
            <Link href={`C:/Users/Moksha Pradhan/Desktop/leaflet-openweathermap/example/index.html`}
               className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg block text-center">Weather Data
            </Link>
            <Link href={`/airquality/lat=${location?.lat}&lng=${location?.lng}`}
               className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg block text-center">Air Quality
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
};

export default GoogleMapsComponent;
