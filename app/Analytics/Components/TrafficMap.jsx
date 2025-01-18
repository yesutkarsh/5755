import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap, TrafficLayer, useLoadScript } from "@react-google-maps/api";

const TrafficMap = () => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-pulse">Loading map...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Traffic Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: 27.1367, lng: 81.9462 }}
            zoom={13}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "geometry",
                  stylers: [{ saturation: -80 }]
                },
                {
                  featureType: "road",
                  elementType: "geometry",
                  stylers: [{ lightness: 100 }]
                }
              ]
            }}
          >
            <TrafficLayer />
          </GoogleMap>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficMap;