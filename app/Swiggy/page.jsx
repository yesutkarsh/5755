"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Swiggy() {
  const [restaurants, setRestaurants] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError(`Error fetching location: ${error.message}`);
          console.error("Error fetching location: ", error);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const fetchRestaurants = async () => {
        try {
          // Start loading
          setIsLoading(true);
  
          // Add a timestamp to prevent caching
          const timestamp = new Date().getTime();
          const response = await axios.get(`/api/nearbyResturant?t=${timestamp}`, {
            params: {
              location: `${currentLocation.lat},${currentLocation.lng}`,
              radius: 1500,
            },
          });
  
          if (response.data.error) {
            setError(response.data.error);
          } else {
            console.log(response);
            setRestaurants(response.data.results || []);
          }
        } catch (error) {
          setError(`Error fetching restaurants: ${error.message}`);
          console.error("Error fetching restaurants: ", error);
        } finally {
          // Stop loading
          setIsLoading(false);
        }
      };
  
      fetchRestaurants();
    }
  }, [currentLocation]);
  

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  if (isLoading) {
    return <div className="p-4">Loading restaurants...</div>;
  }

  return (

    <>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Restaurants</h1>
      {restaurants.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => {
            const distance = calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              restaurant.geometry.location.lat,
              restaurant.geometry.location.lng
            );

            return (
              <div
                key={restaurant.place_id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>{" "}
                    <span className={restaurant.business_status === "OPERATIONAL" ? "text-green-600" : "text-red-600"}>
                      {restaurant.business_status}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span> {restaurant.vicinity}
                  </p>
                  {restaurant.rating && (
                    <p className="text-gray-600">
                      <span className="font-medium">Rating:</span> {restaurant.rating} ({restaurant.user_ratings_total} reviews)
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">Distance:</span> {distance.toFixed(2)} km
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No restaurants found nearby.</p>
      )}
    </div>
    </>
  )

  // Rest of your component remains the same...
}