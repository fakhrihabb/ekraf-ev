# SIVANA Design System Guide

**Style:** Modern, Glassmorphism, Gradient, White-Centric  
**For:** Developer 1 (Frontend Implementation)

---

## Design Principles

1. **White-Centric** - Clean, bright, professional aesthetic
2. **Glassmorphism** - Frosted glass effects with blur and transparency
3. **Gradient Accents** - Subtle gradients for depth and interest
4. **Modern & Minimal** - Spacious layouts, generous whitespace
5. **Soft Shadows** - Gentle elevation, no harsh borders

---

## Color Usage

### Primary Palette
- **White (#FFFFFF)** - Main backgrounds, cards
- **Off-White (#FAFBFC)** - Secondary backgrounds
- **Light Gray (#F5F7FA)** - Subtle dividers, borders
- **Light Blue (#276FB0)** - Primary actions, links, accents

### Brand Colors (Use Sparingly)
- **Dark Blue (#0D263F)** - Headers, important text
- **Blue (#134474)** - Secondary actions, icons
- **Light Blue (#276FB0)** - Primary buttons, highlights

---

## Glassmorphism Components

### Example: Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(13, 38, 63, 0.08);
  border-radius: 16px;
}
```

### Example: Analysis Panel
```css
.analysis-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(13, 38, 63, 0.12);
  border-radius: 20px;
}
```

---

## Gradients

### Background Gradient (Hero Section)
```css
.hero-bg {
  background: linear-gradient(135deg, #FFFFFF 0%, #E0F2FF 50%, #BFDBFE 100%);
}
```

### Button Gradient (Primary CTA)
```css
.btn-primary {
  background: linear-gradient(135deg, #276FB0 0%, #134474 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(39, 111, 176, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(39, 111, 176, 0.4);
  transform: translateY(-2px);
}
```

### Mesh Background (Subtle)
```css
.mesh-bg {
  background:
    radial-gradient(at 0% 0%, #E0F2FF 0px, transparent 50%),
    radial-gradient(at 100% 0%, #BFDBFE 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(39, 111, 176, 0.2) 0px, transparent 50%),
    radial-gradient(at 0% 100%, #FFFFFF 0px, transparent 50%);
}
```

---

## Shadows (Soft, Modern)

```css
/* Elevated card */
.card {
  box-shadow: 0 4px 8px 0 rgba(13, 38, 63, 0.08);
}

/* Floating element */
.floating {
  box-shadow: 0 12px 24px 0 rgba(13, 38, 63, 0.12);
}

/* Glow effect (for active/selected) */
.active {
  box-shadow: 0 0 20px rgba(39, 111, 176, 0.3);
}
```

---

## Component Examples

### Landing Page Hero
```jsx
<section className="hero-bg min-h-screen flex items-center">
  <div className="glass-card max-w-4xl mx-auto p-12">
    <h1 className="text-5xl font-bold text-dark-blue">
      SIVANA
    </h1>
    <p className="text-xl text-gray-600 mt-4">
      System Intelligence EV for Location Analytics
    </p>
    <button className="btn-primary mt-8 px-8 py-4 rounded-full">
      Coba Demo
    </button>
  </div>
</section>
```

### Map Controls (Glassmorphism)
```jsx
<div className="glass-card absolute top-4 left-4 p-4 w-80">
  <h3 className="text-lg font-semibold text-dark-blue mb-4">
    Layer Controls
  </h3>
  {/* Toggle controls */}
</div>
```

### Analysis Results Panel
```jsx
<div className="analysis-panel p-6">
  <h2 className="text-2xl font-bold text-dark-blue mb-4">
    Hasil Analisis
  </h2>
  
  {/* Score cards with glass effect */}
  <div className="grid grid-cols-2 gap-4">
    <div className="glass-light p-4 rounded-lg">
      <p className="text-sm text-gray-600">Skor Permintaan</p>
      <p className="text-3xl font-bold text-light-blue">85</p>
    </div>
    {/* More score cards */}
  </div>
</div>
```

---

## Typography

- **Headings:** Inter, SF Pro Display, atau system-ui
- **Body:** Inter, SF Pro Text, atau system-ui
- **Weights:** 400 (regular), 600 (semibold), 700 (bold)

---

## Spacing & Layout

- **Generous Whitespace** - Don't crowd elements
- **Border Radius:** 12px (cards), 16px (large cards), 999px (pills/buttons)
- **Padding:** 16px (small), 24px (medium), 32px+ (large)
- **Grid Gap:** 16px (compact), 24px (normal), 32px (spacious)

---

## Animations (Subtle)

```css
/* Smooth transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover lift */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px 0 rgba(13, 38, 63, 0.12);
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Usage in Code

Import the design system:
```typescript
import { 
  SIVANA_COLORS, 
  EXTENDED_PALETTE, 
  GLASS_STYLES, 
  GRADIENTS,
  getGlassStyle,
  getColorWithAlpha 
} from '@/lib/config/colors';

// Use glassmorphism
const cardStyle = getGlassStyle('light');

// Use color with transparency
const bgColor = getColorWithAlpha('lightBlue', 0.1);
```

---

## Dos and Don'ts

### ✅ Do
- Use white/light backgrounds as primary
- Apply glassmorphism to floating elements (panels, cards, modals)
- Use soft shadows for depth
- Keep gradients subtle and light
- Use blue brand colors for accents only

### ❌ Don't
- Overuse dark backgrounds
- Make glass effects too opaque (defeats the purpose)
- Use harsh shadows or borders
- Overuse gradients everywhere
- Use too many different colors

---

## Example Color Combinations

**Primary Button:**
- Background: Gradient (Light Blue → Blue)
- Text: White
- Shadow: Soft blue glow

**Card:**
- Background: White with 70% opacity + blur
- Border: White with 30% opacity
- Shadow: Soft dark blue

**Background:**
- Base: White
- Overlay: Subtle gradient mesh
- Accent: Light blue radial gradients at corners

---

**Ready to implement!** Use `lib/config/colors.ts` for all color/style values.
