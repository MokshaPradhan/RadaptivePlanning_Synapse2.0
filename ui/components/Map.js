import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import Link from 'next/link';

const GoogleMapsComponent = ({ defaultPlace }) => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null); // Add this line
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mapElementRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isMapLoaded && window.google) {
      initMap();
      setIsMapLoaded(true); // Set map as loaded
    }
  }, [isMapLoaded]);

  const initMap = async () => {
    const geocoder = new window.google.maps.Geocoder();
    const geocoderResponse = await geocoder.geocode({ address: defaultPlace.address });
    const geocoderResult = geocoderResponse.results[0];

    const mapInstance = new window.google.maps.Map(mapElementRef.current, {
      center: geocoderResult.geometry.location,
      zoom: 29,
      tilt: 0,
      mapTypeId: 'satellite',
      mapTypeControl: false,
      fullscreenControl: false,
      rotateControl: false,
      streetViewControl: false,
      zoomControl: false,
    });

    setMap(mapInstance);
    setLocation(geocoderResult.geometry.location);
    // Add a marker for the default location
    const defaultMarker = new google.maps.Marker({
      position: geocoderResult.geometry.location,
      map: mapInstance,
      title: defaultPlace.name,
    });
    const circle = new google.maps.Circle({
      strokeColor: 'light-blue', // Border color
      strokeWeight: 2,     // Border width
      fillColor: 'blue',   // Fill color
      fillOpacity: 0.2,    // Fill opacity
      map: mapInstance,
      center: geocoderResult.geometry.location,
      radius: 500         // Radius in meters
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
      setLocation({ ...newLocation, searchQuery }); // Include searchQuery in the location state
  
      // Move the existing marker to the new location or create a new one if it doesn't exist
      if (marker) {
        marker.setPosition(newLocation);
      } else {
        const newMarker = new google.maps.Marker({
          position: newLocation,
          map: map,
        });
        setMarker(newMarker); // Save the new marker
      }
  
      // Create a new circle around the new marker
      const circle = new google.maps.Circle({
        strokeColor: 'red', // Light blue border color, using a hexadecimal color value
        strokeOpacity: 0.8,     // Border opacity
        strokeWeight: 2,        // Border width
        fillColor: 'light-blue',   // Fill color, using a hexadecimal color value for light blue
        fillOpacity: 0.25,      // Fill opacity
        map: map,
        center: newLocation,
        radius: 500,            // Radius in meters
      });
  
      // Update the info window content to the search query
      const infoWindowContent = searchQuery; // Use the search query as content
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });
      infoWindow.open(map, marker);
  
      // Adjust marker's listener to open the info window upon clicking
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
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
      <div className="flex text-black ">
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
  <Link href='/solar'>

  <button type="submit" className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg">
      Solar data
    </button>
    </Link>

    <Link href='/solar'>
  <button type="submit" className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg">
      Wind data
    </button>
    </Link>
    <Link href='/solar'>

  <button type="submit" className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg">
      Weather data 
    </button>
    </Link>

    <Link href='/airquality'>

  <button type="submit" className="w-full p-2 bg-blue-500 text-white mt-2 rounded-lg">
      Air quality
    </button>
    </Link>

    </div>
</aside>

      </div>
    </>
  );
};

export default GoogleMapsComponent;