"use client"

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrafficMap from './TrafficMap';
import TrafficTrends from './TrafficTrends';
import TrafficComparison from './TrafficComparison';
import { Clock, Map, TrendingUp, PieChart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Traffic Analytics</h1>
        <p className="text-muted-foreground">
          Real-time traffic monitoring and analysis dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Current Traffic</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23 min</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from usual
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35 mph</div>
            <p className="text-xs text-muted-foreground">
              -5 mph from baseline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Congestion Level</CardTitle>
            <PieChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Moderate</div>
            <p className="text-xs text-muted-foreground">
              Based on current conditions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="map" className="space-y-6">
        <TabsList>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Comparison
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="space-y-4">
          <TrafficMap />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <TrafficTrends />
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <TrafficComparison />
        </TabsContent>
      </Tabs>
    </div>
  );
}