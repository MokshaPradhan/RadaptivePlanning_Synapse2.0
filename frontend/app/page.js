'use client'
import React from 'react';
import GoogleMapsComponent from '../components/Map';

const HomePage = () => {
  const defaultPlace = {
    name: 'Rinconada Library',
    address: '1213 Newell Rd, Palo Alto, CA 94303',
  };

  return (
    <div>
      <GoogleMapsComponent defaultPlace={defaultPlace} />
    </div>
  );
};

export default HomePage;