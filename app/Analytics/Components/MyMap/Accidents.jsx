"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Accidents() {
  const [weeklyData] = useState([
    { day: "Mon", traffic: 75, incidents: 3 },
    { day: "Tue", traffic: 85, incidents: 5 },
    { day: "Wed", traffic: 90, incidents: 4 },
    { day: "Thu", traffic: 95, incidents: 6 },
    { day: "Fri", traffic: 100, incidents: 8 },
    { day: "Sat", traffic: 70, incidents: 2 },
    { day: "Sun", traffic: 60, incidents: 1 },
  ]);

  // Get latitude and longitude from Redux state
  const { latitude, longitude } = useSelector((state) => state.location || {});

  // Use state to manage map center
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
    zoom: 14,
    center: mapCenter,
  };

  return (
    <>
      <Tabs defaultValue="incidents">
        <TabsList>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>
        <TabsContent value="incidents">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </>
  );
}
