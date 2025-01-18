"use client"
import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import {
  GoogleMap,
  useLoadScript,
  DirectionsRenderer,
  TrafficLayer,
  Marker,
} from "@react-google-maps/api";

export default function NavigationMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef(null);

  // Get initial user location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Cleanup location tracking on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.");
        }
      );
    }
  };

  const startLiveTracking = () => {
    if (!isTracking && "geolocation" in navigator) {
      setIsTracking(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
        },
        (error) => {
          setError("Error tracking location: " + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  };

  const stopLiveTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsTracking(false);
    }
  };

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const defaultCenter = {
    lat: 28.6139,
    lng: 77.209,
  };

  const calculateRoute = async () => {
    if (!from || !to) {
      setError("Please enter both 'From' and 'To' locations");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      
      setDirections(result);
      // Extract turn-by-turn directions
      setSteps(result.routes[0].legs[0].steps);
      startLiveTracking(); // Start tracking user location when navigation begins
    } catch (error) {
      setError("Could not calculate route. Please check the addresses and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (userLocation) {
      setFrom(`${userLocation.lat},${userLocation.lng}`);
    }
  };

  // Function to create a clean version of instructions (removing HTML tags)
  const cleanInstructions = (instruction) => {
    const div = document.createElement('div');
    div.innerHTML = instruction;
    return div.textContent || div.innerText || '';
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>

      <div className={styles.bottomNav}>
        <div>
        <button onClick={useCurrentLocation}> <i className="ri-map-pin-line"></i> Current Location</button>
        </div>

        <div>
            
        <button 
        className={styles.startNavagation}
            onClick={calculateRoute}
            disabled={isLoading}
          >
            <i className="ri-compass-3-line"></i> 
            {isLoading ? " Calculating..." : " Start Navigation"}
          </button>
        </div>


      </div>
      <div className={styles.container}>
        <div>
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        {error && <div>{error}</div>}
      </div>

      {/* Map Container */}
      <div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}
          zoom={12}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          <TrafficLayer />
          {directions && <DirectionsRenderer directions={directions} />}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Turn-by-turn directions */}
      {steps.length > 0 && (
        <div>
          <h3>Turn-by-Turn Directions:</h3>
          <div>
            {steps.map((step, index) => (
              <div key={index}>
                <p>{index + 1}. {cleanInstructions(step.instructions)}</p>
                <small>{(step.distance.text)} - {(step.duration.text)}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live tracking controls */}
      {directions && (
        <div>
          <button onClick={isTracking ? stopLiveTracking : startLiveTracking}>
            {isTracking ? "Stop Live Tracking" : "Start Live Tracking"}
          </button>
        </div>
      )}
    </div>
  );
}