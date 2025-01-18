"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toggleMenuVisibility } from "@/utils/slice/ToggleSlice";
import Food from "./components/Food";
import Link from "next/link";
import styles from "./styles.module.css";

export default function Swiggy() {
  const [restaurants, setRestaurants] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const isMenuVisible = useSelector((state) => state.foodMenu.isMenuVisible);

  const toggleMenu = () => {
    dispatch(toggleMenuVisibility());
  };

  // Location and data fetching logic remains the same
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
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const fetchRestaurants = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/nearbyResturant`, {
            params: {
              location: `${currentLocation.lat},${currentLocation.lng}`,
              radius: 1500,
            },
          });

          if (response.data.error) {
            setError(response.data.error);
          } else {
            setRestaurants(response.data.results || []);
          }
        } catch (error) {
          setError(`Error fetching restaurants: ${error.message}`);
        } finally {
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

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg font-medium text-gray-700">
          Loading restaurants...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <i className="ri-restaurant-2-fill text-indigo-600"></i>
            <span>Nearby Restaurants</span>
          </h1>
          
          <div className="w-full sm:w-72">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search Restaurants"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/90 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRestaurants.map((restaurant) => {
              const distance = calculateDistance(
                currentLocation.lat,
                currentLocation.lng,
                restaurant.geometry.location.lat,
                restaurant.geometry.location.lng
              );

              return (
                <div
                  key={restaurant.place_id} // Add the key prop here
                  className="bg-white/80 -blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                 
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {restaurant.name}
                      </h2>
                      {restaurant.rating && (
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                          <i className="ri-star-fill text-yellow-500"></i>
                          <span className="text-sm font-medium text-gray-700">
                            {restaurant.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="ri-map-pin-line"></i>
                        <p className="text-sm line-clamp-2">{restaurant.vicinity}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="ri-route-line"></i>
                        <p className="text-sm">{distance.toFixed(2)} km away</p>
                      </div>

                      {restaurant.user_ratings_total && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <i className="ri-group-line"></i>
                          <p className="text-sm">
                            {restaurant.user_ratings_total} reviews
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${restaurant.business_status === "OPERATIONAL" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        <i className={`ri-checkbox-circle-line ${restaurant.business_status === "OPERATIONAL" ? "text-green-600" : "text-red-600"}`}></i>
                        {restaurant.business_status}
                      </div>
                    </div>

                  

                    {restaurant.business_status === "OPERATIONAL" && (
                      <button
                        onClick={() => {
                          setSelectedRestaurant(restaurant);
                          toggleMenu();
                        }}
                        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <i className="ri-shopping-cart-line"></i>
                        Order Food
                      </button>
                    )}
                  </div>
                  {isMenuVisible && selectedRestaurant?.place_id === restaurant.place_id && (
                  <div className={styles.allItem}> 
                    <Food resName={selectedRestaurant.name} resAddress={selectedRestaurant.vicinity} />
                  </div>
                  )}

                </div>

                
              );
              
            })}

            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <i className="ri-restaurant-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 text-lg">No restaurants found nearby.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around items-center py-2">
          <Link href="/">
            <button className="flex flex-col items-center text-gray-700 hover:text-green-600 transition-colors">
              <i className="ri-home-line text-3xl"></i>
              <span className="text-xs">Home</span>
            </button>
          </Link>

          <Link href="/Swiggy/Cart">
            <button className="flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors">
              <i className="ri-shopping-cart-line text-3xl"></i>
              <span className="text-xs">Cart</span>
            </button>
          </Link>

          <Link href="/Swiggy/Settings">
            <button className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors">
              <i className="ri-settings-3-line text-3xl"></i>
              <span className="text-xs">Settings</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
