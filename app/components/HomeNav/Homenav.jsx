"use client";
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import SearchModal from '../SearchModal/SearchModal';

const Homenav = () => {
  const [address, setAddress] = useState('Fetching location...');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const formattedAddress = data.results[0].formatted_address;
              const addressComponents = data.results[0].address_components;
              
              const locality = addressComponents.find(component => 
                component.types.includes('locality'))?.long_name;
              const subLocality = addressComponents.find(component => 
                component.types.includes('sublocality'))?.long_name;
              
              const displayAddress = subLocality && locality 
                ? `${subLocality}, ${locality}`
                : formattedAddress;
                
              setAddress(displayAddress);
            }
          } catch (error) {
            setAddress('Error fetching location');
            console.error('Error:', error);
          }
        },
        (error) => {
          setAddress('Location access denied');
        //   console.error('Error:', error);
        }
      );
    } else {
      setAddress('Geolocation is not supported by your browser');
    }
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <img 
          className={styles.bg} 
          src="https://res.cloudinary.com/dpcvcblbt/image/upload/v1737156481/5755/mapbg.webp" 
          alt="background-map" 
        />
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="What're you looking for?" 
              className="w-full p-2 rounded-lg border border-gray-300 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              readOnly
            />
            <p className="mt-2 text-sm text-gray-600">
              <i className="ri-map-pin-fill"></i> {address}
            </p>
          </div>
        </div>
      </nav>
      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Homenav;