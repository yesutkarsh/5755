// app/api/nearby-restaurants/route.js
import { NextResponse } from 'next/server';
export async function GET(request) {

    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');
  

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
      }

 
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${parseFloat(lat) + 0.1},${parseFloat(lng) + 0.1}&departure_time=now&key=${"AIzaSyCFfwfN3JhDm1sXkfBoUMfB-Tz-xYLjaXo"}`
        );
    
        const data = await response.json();
        const trafficData = {
          duration: data.rows?.[0]?.elements?.[0]?.duration_in_traffic?.value || 0,
          baseline: data.rows?.[0]?.elements?.[0]?.duration?.value || 0,
        };
    
        return NextResponse.json(trafficData);
      } catch (error) {
        console.error('Error fetching traffic data:', error);
        return NextResponse.json({ error: 'Failed to fetch traffic data' }, { status: 500 });
      }
}