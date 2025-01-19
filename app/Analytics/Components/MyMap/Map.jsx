"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GoogleMap, TrafficLayer, useLoadScript } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Get latitude and longitude from Redux state
  const { latitude, longitude } = useSelector((state) => state.location || {});

  const [mapCenter, setMapCenter] = useState({
    lat: latitude || 40.7128, // Default to NYC coordinates if Redux doesn't have lat
    lng: longitude || -74.0060,
  });

  useEffect(() => {
    // Fetch location only if not available in Redux
    if (!latitude || !longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setMapCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            console.error("Geolocation permission denied or failed.");
          }
        );
      }
    }
  }, [latitude, longitude]);

  const mapOptions = {
    zoom: 12,
    center: mapCenter,
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Live Traffic Map</CardTitle>
          <CardDescription>Real-time traffic conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: "400px", width: "100%" }}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                options={mapOptions}
              >
                <TrafficLayer />
              </GoogleMap>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
