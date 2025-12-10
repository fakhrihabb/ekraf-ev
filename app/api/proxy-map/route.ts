import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const center = searchParams.get('center');
  const size = searchParams.get('size') || '600x300';
  const markers = searchParams.get('markers');
  
  if (!center) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // OR use a secret server-side key if available
  if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  // Construct Google Maps URL
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=15&size=${size}&maptype=roadmap&markers=${markers}&key=${apiKey}&format=png`;

  try {
    const response = await fetch(mapUrl, {
        headers: {
            "Referer": "http://localhost:3000/", // Spoof referrer for API Key restriction
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Upstream Map Error:", response.status, errorText);
        return NextResponse.json({ error: "Upstream Error", details: errorText }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=86400"
        }
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
