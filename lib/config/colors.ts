/**
 * SIVANA Design System
 * Developer 2: Analysis Engine & AI Lead
 * 
 * Modern design with glassmorphism, gradients, and white-centric aesthetic
 */

// ============================================================================
// Brand Colors (Client Specified)
// ============================================================================

export const SIVANA_COLORS = {
  darkBlue: '#0D263F',
  blue: '#134474',
  lightBlue: '#276FB0',
} as const;

// ============================================================================
// Extended Color Palette (Modern White-Centric)
// ============================================================================

export const EXTENDED_PALETTE = {
  // Whites and Neutrals (Primary)
  white: '#FFFFFF',
  offWhite: '#FAFBFC',
  lightGray: '#F5F7FA',
  gray: '#E4E9F0',
  mediumGray: '#8D9DB5',
  darkGray: '#4A5568',

  // Blues (Brand)
  primaryBlue: SIVANA_COLORS.lightBlue,
  accentBlue: SIVANA_COLORS.blue,
  deepBlue: SIVANA_COLORS.darkBlue,

  // Gradients Colors
  gradientStart: '#E0F2FF', // Light blue tint
  gradientMid: '#BFDBFE',   // Medium blue tint
  gradientEnd: SIVANA_COLORS.lightBlue,

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: SIVANA_COLORS.lightBlue,
} as const;

// ============================================================================
// Glassmorphism Styles
// ============================================================================

export const GLASS_STYLES = {
  // Light glass (for white backgrounds)
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(13, 38, 63, 0.08)',
  },

  // Medium glass
  medium: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(24px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px 0 rgba(13, 38, 63, 0.12)',
  },

  // Strong glass (for emphasis)
  strong: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(30px) saturate(220%)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 12px 40px 0 rgba(13, 38, 63, 0.15)',
  },

  // Blue tinted glass
  blueTinted: {
    background: 'rgba(39, 111, 176, 0.1)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(39, 111, 176, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(39, 111, 176, 0.12)',
  },
} as const;

// ============================================================================
// Gradient Definitions
// ============================================================================

export const GRADIENTS = {
  // Hero/Primary gradient (light, white-centric)
  primary: `linear-gradient(135deg, ${EXTENDED_PALETTE.white} 0%, ${EXTENDED_PALETTE.gradientStart} 50%, ${EXTENDED_PALETTE.gradientMid} 100%)`,

  // Accent gradient (blue tones)
  accent: `linear-gradient(135deg, ${SIVANA_COLORS.lightBlue} 0%, ${SIVANA_COLORS.blue} 100%)`,

  // Subtle background gradient
  background: `linear-gradient(180deg, ${EXTENDED_PALETTE.white} 0%, ${EXTENDED_PALETTE.offWhite} 100%)`,

  // Card hover gradient
  cardHover: `linear-gradient(135deg, ${EXTENDED_PALETTE.offWhite} 0%, ${EXTENDED_PALETTE.lightGray} 100%)`,

  // Mesh gradient (modern, multi-point)
  mesh: `
    radial-gradient(at 0% 0%, ${EXTENDED_PALETTE.gradientStart} 0px, transparent 50%),
    radial-gradient(at 100% 0%, ${EXTENDED_PALETTE.gradientMid} 0px, transparent 50%),
    radial-gradient(at 100% 100%, ${SIVANA_COLORS.lightBlue}20 0px, transparent 50%),
    radial-gradient(at 0% 100%, ${EXTENDED_PALETTE.white} 0px, transparent 50%)
  `,
} as const;

// ============================================================================
// Shadow Definitions (Soft, Modern)
// ============================================================================

export const SHADOWS = {
  xs: '0 1px 2px 0 rgba(13, 38, 63, 0.05)',
  sm: '0 2px 4px 0 rgba(13, 38, 63, 0.06)',
  md: '0 4px 8px 0 rgba(13, 38, 63, 0.08)',
  lg: '0 8px 16px 0 rgba(13, 38, 63, 0.10)',
  xl: '0 12px 24px 0 rgba(13, 38, 63, 0.12)',
  '2xl': '0 16px 32px 0 rgba(13, 38, 63, 0.14)',

  // Special shadows
  glow: `0 0 20px rgba(39, 111, 176, 0.3)`,
  inner: 'inset 0 2px 4px 0 rgba(13, 38, 63, 0.06)',
} as const;

// ============================================================================
// CSS Custom Properties (for Tailwind/CSS)
// ============================================================================

export const cssVariables = {
  // Brand colors
  '--color-dark-blue': SIVANA_COLORS.darkBlue,
  '--color-blue': SIVANA_COLORS.blue,
  '--color-light-blue': SIVANA_COLORS.lightBlue,

  // Extended palette
  '--color-white': EXTENDED_PALETTE.white,
  '--color-off-white': EXTENDED_PALETTE.offWhite,
  '--color-light-gray': EXTENDED_PALETTE.lightGray,
  '--color-gray': EXTENDED_PALETTE.gray,

  // Gradients
  '--gradient-primary': GRADIENTS.primary,
  '--gradient-accent': GRADIENTS.accent,
  '--gradient-background': GRADIENTS.background,

  // Glass effects
  '--glass-light-bg': GLASS_STYLES.light.background,
  '--glass-light-backdrop': GLASS_STYLES.light.backdropFilter,
  '--glass-medium-bg': GLASS_STYLES.medium.background,
  '--glass-medium-backdrop': GLASS_STYLES.medium.backdropFilter,
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

export type SivanaColor = keyof typeof SIVANA_COLORS;
export type ExtendedColor = keyof typeof EXTENDED_PALETTE;

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

/**
 * Get color with alpha transparency
 */
export function getColorWithAlpha(color: SivanaColor | ExtendedColor, alpha: number): string {
  let hex: string;

  if (color in SIVANA_COLORS) {
    hex = SIVANA_COLORS[color as SivanaColor];
  } else if (color in EXTENDED_PALETTE) {
    hex = EXTENDED_PALETTE[color as ExtendedColor];
  } else {
    return color;
  }

  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Generate glassmorphism CSS object
 */
export function getGlassStyle(variant: keyof typeof GLASS_STYLES = 'light') {
  return GLASS_STYLES[variant];
}

/**
 * Get gradient CSS
 */
export function getGradient(variant: keyof typeof GRADIENTS = 'primary') {
  return GRADIENTS[variant];
}

// ============================================================================
// Tailwind Config Helper (for Developer 1)
// ============================================================================

export const tailwindColors = {
  sivana: {
    'dark-blue': SIVANA_COLORS.darkBlue,
    'blue': SIVANA_COLORS.blue,
    'light-blue': SIVANA_COLORS.lightBlue,
  },
  white: EXTENDED_PALETTE.white,
  'off-white': EXTENDED_PALETTE.offWhite,
  'light-gray': EXTENDED_PALETTE.lightGray,
  gray: {
    50: EXTENDED_PALETTE.lightGray,
    100: EXTENDED_PALETTE.gray,
    300: EXTENDED_PALETTE.mediumGray,
    600: EXTENDED_PALETTE.darkGray,
  },
};

