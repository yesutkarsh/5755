// app/api/proxy/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('URL parameter is required', { status: 400 });
  }

  try {
    const formattedUrl = formatUrl(decodeURIComponent(targetUrl));
    const response = await fetch(formattedUrl);

    // Check if response is valid
    if (!response.ok) {
      return new NextResponse(`Failed to fetch content from ${formattedUrl}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || '';
    
    // Get the HTML content
    const html = await response.text();
    
    // Create a new response with modified headers
    const modifiedResponse = new NextResponse(html, {
      headers: {
        'Content-Type': contentType,
        // Allow iframe embedding
        'X-Frame-Options': 'ALLOWALL', // Allow iframe embedding from any source
        // Modify CSP to allow iframe embedding from any source
        'Content-Security-Policy': "frame-ancestors *", // Allow embedding from any source
      },
    });

    return modifiedResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Error fetching content', { status: 500 });
  }
}

// Helper function to format URLs
function formatUrl(inputUrl) {
  const cleanUrl = inputUrl.startsWith('/') ? inputUrl.slice(1) : inputUrl;
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return `https://${cleanUrl}`;
  }
  return cleanUrl;
}
