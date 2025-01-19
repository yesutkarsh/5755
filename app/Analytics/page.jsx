"use client"
import React, { useEffect, useState } from "react";
import { GoogleMap, TrafficLayer, useLoadScript,  } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function Page() {
  const [searchAddress, setSearchAddress] = useState("");
  const [weeklyData] = useState([
    { day: "Mon", traffic: 75, incidents: 3 },
    { day: "Tue", traffic: 85, incidents: 5 },
    { day: "Wed", traffic: 90, incidents: 4 },
    { day: "Thu", traffic: 95, incidents: 6 },
    { day: "Fri", traffic: 100, incidents: 8 },
    { day: "Sat", traffic: 70, incidents: 2 },
    { day: "Sun", traffic: 60, incidents: 1 },
  ]);
  
  const [trafficData, setTrafficData] = useState([
    { time: '00:00', duration: 20 },
    { time: '04:00', duration: 35 },
    { time: '08:00', duration: 75 },
    { time: '12:00', duration: 65 },
    { time: '16:00', duration: 85 },
    { time: '20:00', duration: 45 },
  ]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC coordinates

  useEffect(() => {
    // Get current position
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
  }, []);

  const mapOptions = {
    zoom: 12,
    center: mapCenter,
  };

  const exportData = () => {
    const dataStr = JSON.stringify(trafficData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `traffic-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareReport = async () => {
    try {
      await navigator.share({
        title: 'Traffic Report',
        text: 'Check out the current traffic conditions',
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSearch = () => {
    if (searchAddress) {
      // Use Geocoding API or other search logic to find the location and update map center
      console.log("Searching for:", searchAddress);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Traffic Monitor</h1>
          <p className="text-muted-foreground">
            Real-time traffic analysis and monitoring dashboard
          </p>
        </div>
        <div className="flex items-center gap-4">
          
        </div>
      </div>

     

      {/* Add Map Section */}
      <Card>
        <CardHeader>
          <CardTitle>Live Traffic Map</CardTitle>
          <CardDescription>Real-time traffic conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px', width: '100%' }}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
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

       {/* Historical Data Section */}
       <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Historical Data</CardTitle>
              <CardDescription>Traffic patterns over time</CardDescription>
            </div>
            <Select defaultValue="month">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
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


  {/* Traffic Analytics */}
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

    </div>




  );
}
