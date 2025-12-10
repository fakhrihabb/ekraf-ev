# SIVANA - Setup Guide for Developer 2

**Last Updated:** 2025-12-11  
**Day 1 Implementation Complete** ✅

## What Has Been Done

I've completed all Day 1 tasks for Developer 2 (Analysis Engine & AI Lead):

### ✅ Installed Dependencies
- `@supabase/supabase-js` - Supabase client library
- `@googlemaps/google-maps-services-js` - Google Maps services

### ✅ Created Database Schema
- **File:** `supabase/schema.sql`
- 4 tables: `projects`, `locations`, `analyses`, `existing_stations`
- PostGIS extension enabled for spatial queries
- Spatial indexes on coordinates
- Performance indexes on foreign keys

### ✅ Created Mock Station Data
- **File:** `supabase/seed-data.sql`
- 91 realistic SPKLU/SPBKLU stations across Indonesia
- Distribution:
  - DKI Jakarta: 22 stations
  - Surabaya: 11 stations
  - Bandung: 9 stations
  - Medan: 7 stations
  - Semarang: 6 stations
  - Suburban Jakarta: 18 stations
  - Non-metropolitan: 12 stations
- Mix: 55 SPKLU (60%), 36 SPBKLU (40%)

### ✅ Created TypeScript Configuration
- **Supabase Client:** `lib/supabase/client.ts`
- **Type Definitions:** `lib/supabase/types.ts`
- **Color Palette:** `lib/config/colors.ts` (using your provided colors)
- **Scoring Utilities:** `lib/scoring/index.ts`

### ✅ Created API Endpoints
- `POST /api/analyze-location-complete` - Main analysis endpoint
- `GET /api/stations` - Get existing stations

### ✅ Created Documentation
- **API Docs:** `docs/api-formats.md` - Complete integration guide
- **Environment Template:** `env-template.txt`

---

## What You Need to Do (Setup Steps)

### Step 1: Create Environment File

Copy the template and fill in your credentials:

```bash
cd /Users/macbookair/Documents/Code/ekraf-ev
cp env-template.txt .env.local
```

Then edit `.env.local` and add your Supabase credentials.

### Step 2: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to: **Settings** → **API**
3. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Paste them into `.env.local`

### Step 3: Run Database Schema in Supabase

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
2. Copy the contents of `supabase/schema.sql`
3. Paste into SQL Editor and click **Run**
4. You should see: "Schema created successfully!" message

### Step 4: Run Seed Data in Supabase

1. In the same SQL Editor
2. Copy the contents of `supabase/seed-data.sql`
3. Paste into SQL Editor and click **Run**
4. You should see a summary like:
   ```
   Total Stations: 91
   SPKLU Stations: 55 (60.4%)
   SPBKLU Stations: 36 (39.6%)
   ```

### Step 5: Verify Setup

Test that the API works:

```bash
# Start the development server
npm run dev

# In another terminal, test the API
curl http://localhost:3000/api/stations
```

You should see a JSON response with 91 stations.

---

## For Day 2+ Setup (Not Required Now)

You'll need Google API keys when you start Day 2 tasks. Here's how to get them:

### Getting Google API Keys

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
   - Gemini API (for AI insights)
4. Create credentials → API Key
5. Add the API key to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
   GOOGLE_PLACES_API_KEY=your-key-here
   GOOGLE_DISTANCE_MATRIX_API_KEY=your-key-here
   GOOGLE_GEMINI_API_KEY=your-key-here
   ```

**Note:** You can use the same API key for all Google services, or create separate keys for better tracking.

---

## File Structure Created

```
ekraf-ev/
├── app/
│   └── api/
│       ├── analyze-location-complete/
│       │   └── route.ts          ← Main analysis endpoint
│       └── stations/
│           └── route.ts          ← Get existing stations
├── lib/
│   ├── config/
│   │   └── colors.ts             ← SIVANA color palette
│   ├── scoring/
│   │   └── index.ts              ← Scoring algorithms
│   └── supabase/
│       ├── client.ts             ← Supabase client
│       └── types.ts              ← TypeScript types
├── supabase/
│   ├── schema.sql                ← Database schema (YOU NEED TO RUN THIS)
│   └── seed-data.sql             ← Mock station data (YOU NEED TO RUN THIS)
├── docs/
│   └── api-formats.md            ← API documentation for team
└── env-template.txt              ← Environment variables template
```

---

## Integration with Other Developers

### For Developer 1 (Frontend)
- Can start using `/api/stations` to display mock stations on map
- Can send analysis requests to `/api/analyze-location-complete`
- See `docs/api-formats.md` for request/response formats

### For Developer 3 (Projects)
- Database schema is ready for use
- Can start building CRUD operations for projects
- See `lib/supabase/types.ts` for TypeScript types

---

## Testing the Setup

### Test 1: Check Stations API

```bash
curl http://localhost:3000/api/stations | jq '.total'
# Should return: 91
```

### Test 2: Analyze a Location

```bash
curl -X POST http://localhost:3000/api/analyze-location-complete \
  -H "Content-Type: application/json" \
  -d '{"latitude": -6.2088, "longitude": 106.8456}' \
  | jq '.scores'
```

Should return scores like:
```json
{
  "demand": 75,
  "grid": 68,
  "accessibility": 82,
  "competition": 71,
  "overall": 74
}
```

---

## Summary

**Completed:** ✅ All Day 1 coding tasks  
**Remaining:** ⏳ You need to set up Supabase credentials and run SQL files  
**Next Steps:** Once you complete the setup steps above, you can:
1. Start the dev server: `npm run dev`
2. Test the API endpoints
3. Coordinate with Developer 1 and 3 for integration
4. Begin Day 2 tasks (Google API integration, Gemini AI)

**Questions?** Check `docs/api-formats.md` or contact me.
