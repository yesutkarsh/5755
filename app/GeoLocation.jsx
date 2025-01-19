'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLocation } from '@/utils/slice/userSlice';

export default function GeoLocation() {
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch user data from an API route
    async function fetchUser() {
      try {
        const response = await fetch('/api/GetUser'); // Create this API route
        const userData = await response.json();

        if (userData) {
          dispatch(
            setUser({
              id: userData.id,
              email: userData.email,
              family_name: userData.family_name,
              given_name: userData.given_name,
              picture: userData.picture,
              username: userData.username || null,
              phone_number: userData.phone_number || null,
            })
          );
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    // Fetch location if not already stored
    async function fetchLocation() {
      if (!latitude || !longitude) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            dispatch(
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              })
            );
          },
          (error) => {
            console.error('Error fetching location:', error);
          }
        );
      }
    }

    // Call both functions
    fetchUser();
    fetchLocation();
  }, [dispatch, latitude, longitude]); // Removed 'id' from dependencies

  return null; // Non-visual component
}