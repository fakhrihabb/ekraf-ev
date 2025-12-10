# SIVANA API Documentation

**Developer 2: Analysis Engine & AI Lead**  
**Version:** Day 1 - Foundation  
**Last Updated:** 2025-12-11

This document provides API specifications for integration between Developer 1 (Frontend), Developer 2 (Analysis Engine), and Developer 3 (Projects).

---

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Integration Formats](#integration-formats)
4. [Example Requests](#example-requests)

---

## Database Schema

### Tables Overview

| Table | Description | Key Fields |
|-------|-------------|------------|
| `projects` | User projects | id, name, description |
| `locations` | Candidate locations | id, project_id, latitude, longitude, address |
| `analyses` | Analysis results | id, location_id, scores, insights, recommendation |
| `existing_stations` | SPKLU/SPBKLU stations | id, name, type, latitude, longitude |

### Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Locations Table

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  name TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ
);
```

### Analyses Table

```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  demand_score INTEGER (0-100),
  grid_score INTEGER (0-100),
  accessibility_score INTEGER (0-100),
  competition_score INTEGER (0-100),
  overall_score INTEGER (0-100),
  insights_text TEXT,
  recommendation TEXT,
  financial_data_json JSONB,
  created_at TIMESTAMPTZ
);
```

### Existing Stations Table

```sql
CREATE TABLE existing_stations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT ('SPKLU' | 'SPBKLU'),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  capacity INTEGER,
  operator TEXT,
  created_at TIMESTAMPTZ
);
```

**Note:** PostGIS extension is enabled for spatial queries. Spatial indexes are created on coordinates for fast distance calculations.

---

## API Endpoints

### 1. Analyze Location (Complete)

**Endpoint:** `POST /api/analyze-location-complete`  
**Purpose:** Analyze a location and return complete analysis with scores, insights, and recommendations  
**Owner:** Developer 2  
**Used by:** Developer 1 (Map interface), Developer 3 (Save to project)

**Request:**
```typescript
{
  latitude: number;      // Required, -90 to 90
  longitude: number;     // Required, -180 to 180
  address?: string;      // Optional, human-readable address
}
```

**Response:**
```typescript
{
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  scores: {
    demand: number;           // 0-100
    grid: number;             // 0-100
    accessibility: number;    // 0-100
    competition: number;      // 0-100
    overall: number;          // 0-100 (weighted average)
  };
  recommendation: {
    type: 'SPKLU' | 'SPBKLU' | 'Hybrid';
    rationale: string;        // In Bahasa Indonesia
    technical_specs: {
      type: string;
      chargers?: number;
      powerRequirement?: string;
      swapStations?: number;
      batteryInventory?: number;
      spaceRequirement: string;
    };
    financial_estimates: {
      capitalInvestment: number;        // IDR
      monthlyOperationalCost: number;   // IDR
      revenueProjection: number;        // IDR per month
      paybackPeriodMonths: number;
      currency: 'IDR';
    };
  };
  insights: string;          // AI-generated insights in Bahasa
  analyzed_at: string;       // ISO 8601 timestamp
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid coordinates or missing required fields
- `500` - Server error

---

### 2. Get Existing Stations

**Endpoint:** `GET /api/stations?bounds=swLat,swLng,neLat,neLng`  
**Purpose:** Retrieve existing SPKLU/SPBKLU stations in a given area  
**Owner:** Developer 2  
**Used by:** Developer 1 (Display stations on map)

**Query Parameters:**
- `bounds` (optional): Bounding box as `swLat,swLng,neLat,neLng`

**Response:**
```typescript
{
  stations: [
    {
      id: string;
      name: string;
      type: 'SPKLU' | 'SPBKLU';
      latitude: number;
      longitude: number;
      capacity?: number;
      operator?: string;
      created_at: string;
    }
  ];
  total: number;
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Integration Formats

### Integration A: Map → Analysis (Developer 1 → Developer 2)

**When:** User clicks "Analyze Location" button on map

**Developer 1 sends:**
```typescript
POST /api/analyze-location-complete
{
  latitude: -6.2088,
  longitude: 106.8456,
  address: "Bundaran HI, Jakarta Pusat"
}
```

**Developer 2 returns:**
```typescript
{
  location: { lat: -6.2088, lng: 106.8456, address: "Bundaran HI, Jakarta Pusat" },
  scores: { demand: 85, grid: 75, accessibility: 90, competition: 60, overall: 78 },
  recommendation: {
    type: "SPKLU",
    rationale: "Lokasi ini sangat cocok untuk SPKLU...",
    technical_specs: { type: "SPKLU", chargers: 4, powerRequirement: "350 kW", spaceRequirement: "150 sq meters" },
    financial_estimates: { capitalInvestment: 1600000000, monthlyOperationalCost: 32000000, revenueProjection: 57600000, paybackPeriodMonths: 63, currency: "IDR" }
  },
  insights: "Analisis untuk lokasi ini menunjukkan...",
  analyzed_at: "2025-12-11T00:00:00Z"
}
```

**Developer 1 displays:** Scores, insights, and recommendation in results panel

---

### Integration B: Map → Save to Project (Developer 1 → Developer 3)

**When:** User clicks "Simpan ke Proyek" after analysis

**Developer 1 sends to Developer 3:**
```typescript
POST /api/save-location
{
  location: {
    latitude: -6.2088,
    longitude: 106.8456,
    address: "Bundaran HI, Jakarta Pusat"
  },
  analysis: { /* Complete analysis object from Integration A */ },
  project: {
    isNew: false,
    projectId: "uuid-here"
  },
  locationNickname: "Lokasi Jakarta Pusat"
}
```

**Developer 3 returns:**
```typescript
{
  success: true,
  projectId: "uuid-here",
  locationId: "uuid-here",
  message: "Lokasi berhasil disimpan!"
}
```

---

### Integration C: Projects → Analysis Data (Developer 3 → Developer 2)

**When:** Developer 3 needs to display or report on saved analyses

**Method:** Direct database access via Supabase client

```typescript
// Developer 3 can query directly
const { data: analyses } = await supabase
  .from('analyses')
  .select('*, locations(*)')
  .eq('location_id', locationId);
```

**No API call needed** - shared database access

---

## Example Requests

### Example 1: Analyze Jakarta Location

```bash
curl -X POST http://localhost:3000/api/analyze-location-complete \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -6.2088,
    "longitude": 106.8456,
    "address": "Bundaran HI, Jakarta Pusat"
  }'
```

### Example 2: Get Stations in Jakarta

```bash
curl http://localhost:3000/api/stations
```

### Example 3: Get Stations in Bounding Box

```bash
curl "http://localhost:3000/api/stations?bounds=-6.3,-106.7,-6.1,106.9"
```

---

## Scoring Algorithm Summary

| Score | Weight | Calculation Method | Data Source |
|-------|--------|-------------------|-------------|
| Demand | 30% | Count POIs in 2km radius | Google Places API |
| Grid | 25% | Distance to nearest substation | PostGIS spatial query |
| Accessibility | 25% | Highway distance + parking | Google Distance Matrix API |
| Competition | 20% | Count stations in 5km radius | PostGIS spatial query |

**Overall Score = (Demand × 0.3) + (Grid × 0.25) + (Accessibility × 0.25) + (Competition × 0.2)**

---

## Mock Data Summary

**Total Stations:** 91  
**Distribution:**
- DKI Jakarta: 22 stations (dense, every 2-5km)
- Surabaya: 11 stations
- Bandung: 9 stations
- Medan: 7 stations
- Semarang: 6 stations
- Suburban Jakarta: 18 stations (moderate, every 5-10km)
- Non-metropolitan: 12 stations (sparse, every 10-20km)

**Type Mix:**
- SPKLU: ~60% (55 stations)
- SPBKLU: ~40% (36 stations)

---

## Notes for Day 2 Implementation

**Developer 2 will complete:**
1. Full scoring algorithm implementation with Google APIs
2. Gemini AI integration for insights generation
3. PostGIS spatial queries optimization
4. Caching layer for API responses
5. Error handling and retry logic

**Developer 1 can use:**
- Mock data is functional for UI development
- API endpoints return realistic placeholder data
- Response formats are final and won't change

**Developer 3 can use:**
- Database schema is finalized
- Can start building CRUD operations
- Analysis data structure is stable

---

## Color Palette

Use SIVANA brand colors throughout the application:

```typescript
{
  darkBlue: '#0D263F',
  blue: '#134474',
  lightBlue: '#276FB0'
}
```

---

## Environment Variables Required

```bash
# Supabase (required for database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Google APIs (required for Day 2+)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_PLACES_API_KEY=
GOOGLE_DISTANCE_MATRIX_API_KEY=
GOOGLE_GEMINI_API_KEY=
```

---

## Questions or Issues?

Contact Developer 2 for:
- Database schema questions
- API response format clarifications
- Scoring algorithm details
- Integration issues

**End of API Documentation**
