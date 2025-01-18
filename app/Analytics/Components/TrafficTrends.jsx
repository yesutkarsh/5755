import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TrafficTrends = () => {
  const data = [
    { time: '00:00', duration: 15, baseline: 12, congestion: 20 },
    { time: '04:00', duration: 18, baseline: 12, congestion: 25 },
    { time: '08:00', duration: 35, baseline: 15, congestion: 80 },
    { time: '12:00', duration: 25, baseline: 18, congestion: 45 },
    { time: '16:00', duration: 32, baseline: 20, congestion: 70 },
    { time: '20:00', duration: 20, baseline: 15, congestion: 35 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Travel Time Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickFormatter={(value) => `${value}m`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="duration"
                  stroke="#7c3aed"
                  fill="url(#colorDuration)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="#22c55e"
                  fill="url(#colorBaseline)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Congestion Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="congestion"
                  fill="url(#colorCongestion)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficTrends;