"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, DirectionsRenderer, DirectionsService, useLoadScript } from "@react-google-maps/api";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = { lat: 27.1367, lng: 81.9462 }; // Centered on Gonda, UP
const libraries = ["marker"];

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directionsResponses, setDirectionsResponses] = useState({});
  const [map, setMap] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Update current location and watch for changes
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
        if (map) {
          map.panTo(newLocation);
        }
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );

    // Fetch orders from Firebase
    const app = initializeApp({
      databaseURL: "https://project-8269032991113480607-default-rtdb.firebaseio.com/",
    });
    const db = getDatabase(app);
    const ordersRef = ref(db, "orders");

    const unsubscribe = onValue(ordersRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.entries(data).flatMap(([emailKey, userOrders]) => 
          Object.entries(userOrders).map(([orderId, orderData]) => ({
            id: orderId,
            ...orderData,
            emailKey
          }))
        );

        const ordersWithCoordinates = await Promise.all(
          ordersArray.map(async (order) => {
            if (order.items && order.items.length > 0) {
              const uniquePlaces = [...new Set(order.items.map(item => item.place))];
              const placesWithCoords = await Promise.all(
                uniquePlaces.map(async (place) => ({
                  place,
                  coordinates: await fetchCoordinates(place)
                }))
              );
              return {
                ...order,
                placesWithCoords
              };
            }
            return order;
          })
        );

        setOrders(ordersWithCoordinates);
      }
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      unsubscribe();
    };
  }, [map]);

  const fetchCoordinates = async (place) => {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      place
    )}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
    return null;
  };

  const directionsCallback = useCallback((orderIndex, placeIndex) => (response) => {
    if (response !== null && response.status === 'OK') {
      setDirectionsResponses(prev => ({
        ...prev,
        [`${orderIndex}-${placeIndex}`]: response
      }));
    } else {
      console.error("Directions request failed:", response);
    }
  }, []);

  const createMarkers = useCallback((map, currentLocation, destination) => {
    if (map && window.google && window.google.maps.marker) {
      try {
        if (map.__markers) {
          map.__markers.forEach(marker => marker.map = null);
        }
        map.__markers = [];

        const { AdvancedMarkerElement } = google.maps.marker;
        const positions = [
          { position: currentLocation, label: "You" },
          { position: destination, label: "Restaurant" }
        ];

        positions.forEach(({ position, label }) => {
          const element = document.createElement('div');
          element.innerHTML = `
            <div style="
              background: white;
              padding: 5px 10px;
              border-radius: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              font-weight: bold;
              font-size: 14px;
            ">
              ${label}
            </div>
          `;

          const marker = new AdvancedMarkerElement({
            map,
            position,
            content: element,
          });

          map.__markers.push(marker);
        });
      } catch (error) {
        console.error("Error creating markers:", error);
      }
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.map((order, orderIndex) => (
        <div key={order.id} className="border rounded-lg p-4 mb-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Order Details</h2>
            <p>Customer: {order.name}</p>
            <p>Total Price: ₹{order.totalPrice}</p>
            <p>Time: {new Date(order.timestamp).toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Items:</h3>
            {order.items && order.items.map((item, itemIndex) => (
              <div key={itemIndex} className="ml-4 mb-2">
                <p>{item.name} - ₹{item.price} x {item.quantity}</p>
                <p className="text-sm text-gray-600">From: {item.place}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={currentLocation || defaultCenter}
              zoom={14}
              onLoad={onMapLoad}
            >
              {currentLocation && map && order.placesWithCoords?.map((placeData, placeIndex) => {
                if (placeData.coordinates) {
                  createMarkers(map, currentLocation, placeData.coordinates);

                  return (
                    <div key={placeIndex}>
                      <DirectionsService
                        options={{
                          destination: placeData.coordinates,
                          origin: currentLocation,
                          travelMode: 'DRIVING'
                        }}
                        callback={directionsCallback(orderIndex, placeIndex)}
                      />
                      {directionsResponses[`${orderIndex}-${placeIndex}`] && (
                        <DirectionsRenderer
                          options={{
                            directions: directionsResponses[`${orderIndex}-${placeIndex}`],
                            suppressMarkers: true,
                            polylineOptions: {
                              strokeColor: '#ff0000',
                              strokeWeight: 4
                            }
                          }}
                        />
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </GoogleMap>
          </div>
        </div>
      ))}
    </div>
  );
}