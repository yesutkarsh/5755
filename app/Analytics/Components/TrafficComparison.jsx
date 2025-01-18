import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from "@/components/ui/badge";

const TrafficComparison = () => {
  const pieData = [
    { name: 'Current Traffic', value: 35, color: '#7c3aed' },
    { name: 'Normal Traffic', value: 25, color: '#22c55e' }
  ];

  const compareData = [
    { name: 'Peak Hours', current: 45, normal: 30, color: '#ef4444' },
    { name: 'Off Peak', current: 20, normal: 15, color: '#3b82f6' }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current vs Normal Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Analysis by Time Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {compareData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="outline" style={{ backgroundColor: item.color, color: 'white' }}>
                    +{((item.current - item.normal) / item.normal * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Current: {item.current} min
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Normal: {item.normal} min
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(item.current / 45) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficComparison;