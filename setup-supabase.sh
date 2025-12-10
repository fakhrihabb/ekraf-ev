#!/bin/bash
# Supabase Setup Script
# Developer 2: Quick database setup

echo "🚀 SIVANA - Supabase Database Setup"
echo "===================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found"
    echo "Please copy env-template.txt to .env.local and add your credentials"
    exit 1
fi

# Source environment variables
source .env.local

# Check if credentials are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Supabase credentials not configured"
    echo "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    exit 1
fi

echo "✅ Credentials found"
echo ""

# Extract project ref from Supabase URL
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\///' | cut -d'.' -f1)

echo "📊 Database: $PROJECT_REF"
echo ""

# Option 1: Manual SQL (recommended for beginners)
echo "📝 Option 1: Manual Setup (Recommended)"
echo "----------------------------------------"
echo "1. Open: https://supabase.com/dashboard/project/$PROJECT_REF/sql"
echo "2. Copy and run: supabase/schema.sql"
echo "3. Copy and run: supabase/seed-data.sql"
echo ""

# Option 2: Using psql (if available)
if command -v psql &> /dev/null; then
    echo "💻 Option 2: Using psql (Advanced)"
    echo "-----------------------------------"
    echo "Supabase doesn't expose direct psql access by default."
    echo "Use Option 1 (SQL Editor) instead."
    echo ""
fi

echo "✨ After setup, test with:"
echo "   npm run dev"
echo "   curl http://localhost:3000/api/stations"
echo ""
