"use client"
import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  DirectionsRenderer,
  TrafficLayer,
  Marker,
} from "@react-google-maps/api";
import { Search, MapPin, Navigation2, X, Compass, Menu } from "lucide-react";

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
  const [searchResults, setSearchResults] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const watchIdRef = useRef(null);
  const googleMapsRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && userLocation) {
      googleMapsRef.current = new google.maps.Map(document.createElement("div"));
    }
  }, [isLoaded, userLocation]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          // Get address from coordinates
          if (isLoaded && googleMapsRef.current) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: newLocation },
              (results, status) => {
                if (status === "OK" && results[0]) {
                  setFrom(results[0].formatted_address);
                }
              }
            );
          }
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const searchNearby = (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    if (googleMapsRef.current && userLocation) {
      const service = new google.maps.places.PlacesService(googleMapsRef.current);
      const request = {
        location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 5000,
        query: query
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setSearchResults(results);
          setError("");
        } else {
          setError("Unable to find places. Please try again.");
          setSearchResults([]);
        }
      });
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
      setSteps(result.routes[0].legs[0].steps);
      setShowDirections(true);
      startLiveTracking();
    } catch (error) {
      setError("Could not calculate route. Please check the addresses and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const useCurrentLocation = () => {
    getCurrentLocation();
  };

  const cleanInstructions = (instruction) => {
    const div = document.createElement('div');
    div.innerHTML = instruction;
    return div.textContent || div.innerText || '';
  };

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const defaultCenter = {
    lat: 28.6139,
    lng: 77.209,
  };

  if (!isLoaded) return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="relative h-screen">
      {/* Search Panel */}
      <div className="absolute top-4 left-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 space-y-4 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search nearby places..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchNearby(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="max-h-48 overflow-y-auto bg-white rounded-lg border border-gray-200">
            {searchResults.map((place, index) => (
              <button
                key={index}
                onClick={() => {
                  setTo(place.formatted_address);
                  setSearchResults([]);
                  setSearchQuery("");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="font-medium">{place.name}</div>
                <div className="text-sm text-gray-500">{place.formatted_address}</div>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative flex-1">
            <Navigation2 className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={useCurrentLocation}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Current Location
          </button>
          <button
            onClick={calculateRoute}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Compass className="h-4 w-4" />
            {isLoading ? "Calculating..." : "Start Navigation"}
          </button>
        </div>
      </div>

      {/* Map Container */}
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
        {searchResults.map((place, index) => (
          <Marker
            key={index}
            position={place.geometry.location}
            title={place.name}
          />
        ))}
      </GoogleMap>

      {/* Directions Panel */}
      {steps.length > 0 && (
        <div className={`absolute right-4 top-4 bottom-4 w-96 bg-white rounded-lg shadow-lg transition-transform duration-300 ${showDirections ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-lg">Turn-by-Turn Directions</h3>
            <button
              onClick={() => setShowDirections(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="overflow-auto h-[calc(100%-4rem)] p-4">
            {steps.map((step, index) => (
              <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{index + 1}. {cleanInstructions(step.instructions)}</p>
                <div className="mt-2 text-sm text-gray-500 flex gap-3">
                  <span>{step.distance.text}</span>
                  <span>•</span>
                  <span>{step.duration.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Directions Button */}
      {steps.length > 0 && !showDirections && (
        <button
          onClick={() => setShowDirections(true)}
          className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Live Tracking Button */}
      {directions && (
        <button
          onClick={isTracking ? stopLiveTracking : startLiveTracking}
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg transition-colors ${
            isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isTracking ? "Stop Live Tracking" : "Start Live Tracking"}
        </button>
      )}
    </div>
  );
}