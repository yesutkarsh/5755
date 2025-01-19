"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Hostory() {
  const [trafficData, setTrafficData] = useState([
    { time: '00:00', duration: 20 },
    { time: '04:00', duration: 35 },
    { time: '08:00', duration: 75 },
    { time: '12:00', duration: 65 },
    { time: '16:00', duration: 85 },
    { time: '20:00', duration: 45 },
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Historical Data</CardTitle>
              <CardDescription>Traffic patterns over time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="duration"
                  stroke="#6366F1"
                  fill="url(#colorHistorical)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
