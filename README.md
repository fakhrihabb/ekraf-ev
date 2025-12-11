# SIVANA - Sistem Intelijen EV untuk Analitik Lokasi SPKLU dan SPBKLU Nasional

Platform perencanaan berbasis AI untuk infrastruktur pengisian kendaraan listrik di Indonesia.

## 🚀 Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Maps**: Google Maps JavaScript API
- **AI**: Google Gemini API
- **Database**: Supabase (PostgreSQL with PostGIS)

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Cloud Platform account
- Git

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/fakhrihabb/ekraf-ev.git
cd ekraf-ev
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Google Maps API (REQUIRED)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase (Optional for Day 1)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Other Google Cloud APIs (For Day 2+)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Get API Keys

Follow the detailed guide in the artifacts folder:
- See `api-key-setup-guide.md` for step-by-step instructions
- Or visit the [API Key Setup Guide](./docs/api-key-setup-guide.md)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ekraf-ev/
├── app/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Hero.tsx         # Landing page hero
│   │   ├── WhySivana.tsx    # Benefits section
│   │   ├── HowItWorks.tsx   # Process explanation
│   │   ├── Results.tsx      # Before/after comparison
│   │   ├── FAQ.tsx          # FAQ accordion
│   │   ├── CTA.tsx          # Conversion section
│   │   └── Footer.tsx       # Footer
│   ├── intelligence-planner/ # Map & analysis page
│   ├── projects/            # Projects management page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── public/                  # Static assets
├── context-4-agents/        # Project documentation
├── .env.local.example       # Environment variables template
└── package.json
```

## 🎨 Brand Colors

- **Dark Blue**: `#0D263F`
- **Blue**: `#134474`
- **Light Blue**: `#276FB0`

## 🌟 Features

### ✅ Implemented (Day 1)

- [x] Landing page with modern design
- [x] Glassmorphism UI components
- [x] Smooth animations
- [x] Responsive navigation
- [x] Hero section with dual CTAs
- [x] "Kenapa SIVANA?" benefits section
- [x] "Bagaimana Cara Kerjanya?" process flow
- [x] Before/after comparison
- [x] FAQ accordion
- [x] Conversion section
- [x] Footer with quick links
- [x] Placeholder pages for Intelligence Planner and Projects

### 🚧 Coming Soon (Day 2-3)

- [ ] Google Maps 2D/3D integration
- [ ] Location analysis engine
- [ ] AI-powered insights (Gemini)
- [ ] Project management
- [ ] Report generation (PDF)
- [ ] Database integration (Supabase)

## 🔀 Git Workflow

### Current Branches

- `main` - Production-ready code
- `feat/landing-page-setup` - Landing page implementation (Day 1)
- `feat/base-map-implementation` - Map features (Day 2)

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your descriptive message"
   ```

3. Push to remote:
   ```bash
   git push -u origin feat/your-feature-name
   ```

## 📚 Documentation

- **PRD**: See `context-4-agents/prd.md`
- **Dev Assignment**: See `context-4-agents/dev-assignment.md`
- **Context Prompt**: See `context-4-agents/context-prompt.md`
- **API Setup Guide**: See artifacts folder

## 🧪 Testing

### Manual Testing Checklist

- [ ] Landing page loads without errors
- [ ] All sections are visible
- [ ] Navigation works (Intelligence Planner, Projects)
- [ ] "Coba Demo" button navigates correctly
- [ ] "Selengkapnya" button scrolls down
- [ ] FAQ accordion expands/collapses
- [ ] Animations are smooth
- [ ] Responsive on tablet (768px)
- [ ] All text is in Bahasa Indonesia

### Run Development Build

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Issue: Module not found errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill the process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- -p 3001
```

### Issue: Tailwind styles not applying

**Solution:**
1. Check `globals.css` is imported in `layout.tsx`
2. Restart dev server
3. Clear browser cache

## 📞 Support

For issues or questions:
1. Check the documentation in `context-4-agents/`
2. Review the API setup guide
3. Check browser console for errors

## 🎯 Hackathon Timeline

- **Day 1**: Landing page, navigation, setup ✅
- **Day 2**: Map implementation, markers, layers
- **Day 3**: Analysis engine, AI integration
- **Day 4**: Projects page, report generation
- **Day 5**: Testing, polish, demo prep

## 📄 License

This project is created for hackathon purposes.

---

**Built with ❤️ for SIVANA Hackathon MVP**
