// app/api/nearby-restaurants/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const radius = searchParams.get('radius');
  
  const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
  const response = await fetch(`${apiUrl}?location=${location}&radius=${radius}&type=restaurant&key=${"AIzaSyCFfwfN3JhDm1sXkfBoUMfB-Tz-xYLjaXo"}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}