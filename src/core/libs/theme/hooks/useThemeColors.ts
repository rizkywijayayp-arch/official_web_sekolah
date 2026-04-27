import { useState, useEffect } from 'react';

/**
 * Hook to get theme colors from CSS variables
 * Uses CSS variables set by themeConfig.ts (loadAndApplyTheme)
 * Falls back to default values if CSS variables are not set
 * Note: This hook re-renders when colors change (for dynamic themes)
 */
export const useThemeColors = () => {
  const [colors, setColors] = useState({
    primary: '#1B5E20',
    accent: '#FFFFEB3B',
    bg: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceText: '#212121',
    subtle: '#757575',
    pop: '#FF8A00',
    primaryText: '#ffffff',
    themePrimary: '#1B5E20',
    themeAccent: '#FFFFEB3B',
    themeBg: '#FFFFFF',
    themeSurface: '#F5F5F5',
    themeSurfaceText: '#212121',
    themeSubtle: '#757575',
    themePop: '#FF8A00',
  });

  useEffect(() => {
    const readColors = () => {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      const style = window.getComputedStyle(root);

      setColors({
        primary: root.style.getPropertyValue('--theme-primary') || style.getPropertyValue('--theme-primary') || '#1B5E20',
        accent: root.style.getPropertyValue('--theme-accent') || style.getPropertyValue('--theme-accent') || '#FFFFEB3B',
        bg: root.style.getPropertyValue('--theme-bg') || style.getPropertyValue('--theme-bg') || '#FFFFFF',
        surface: root.style.getPropertyValue('--theme-surface') || style.getPropertyValue('--theme-surface') || '#F5F5F5',
        surfaceText: root.style.getPropertyValue('--theme-surface-text') || style.getPropertyValue('--theme-surface-text') || '#212121',
        subtle: root.style.getPropertyValue('--theme-subtle') || style.getPropertyValue('--theme-subtle') || '#757575',
        pop: root.style.getPropertyValue('--theme-pop') || style.getPropertyValue('--theme-pop') || '#FF8A00',
        primaryText: root.style.getPropertyValue('--theme-color-primary-text') || style.getPropertyValue('--theme-color-primary-text') || '#ffffff',
        themePrimary: root.style.getPropertyValue('--theme-primary') || style.getPropertyValue('--theme-primary') || '#1B5E20',
        themeAccent: root.style.getPropertyValue('--theme-accent') || style.getPropertyValue('--theme-accent') || '#FFFFEB3B',
        themeBg: root.style.getPropertyValue('--theme-bg') || style.getPropertyValue('--theme-bg') || '#FFFFFF',
        themeSurface: root.style.getPropertyValue('--theme-surface') || style.getPropertyValue('--theme-surface') || '#F5F5F5',
        themeSurfaceText: root.style.getPropertyValue('--theme-surface-text') || style.getPropertyValue('--theme-surface-text') || '#212121',
        themeSubtle: root.style.getPropertyValue('--theme-subtle') || style.getPropertyValue('--theme-subtle') || '#757575',
        themePop: root.style.getPropertyValue('--theme-pop') || style.getPropertyValue('--theme-pop') || '#FF8A00',
      });
    };

    readColors();

    // Re-read on theme change events
    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => observer.disconnect();
  }, []);

  return colors;
};

/**
 * Get computed style color from CSS variable
 * Can be used outside of React components (non-reactive)
 */
export const getThemeColor = (colorName: string, fallback: string = '#000000'): string => {
  if (typeof document === 'undefined') return fallback;
  const root = document.documentElement;
  const val = root.style.getPropertyValue(colorName);
  if (val) return val;

  // Try computed style as fallback
  const style = window.getComputedStyle(root);
  const computedVal = style.getPropertyValue(colorName);
  return computedVal || fallback;
};

/**
 * Calculate contrast color (black or white) based on background color luminance
 * Used to determine readable text color on colored backgrounds
 */
export const getContrastColor = (hexColor: string): string => {
  if (!hexColor) return '#000000';

  // Remove # if present
  const cleanHex = hexColor.replace('#', '');

  // Convert 3-digit hex to 6-digit
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;

  // Parse RGB values
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  // Calculate relative luminance (WCAG formula)
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLum = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLum = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLum = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  const luminance = 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.179 ? '#111827' : '#ffffff';
};

/**
 * Map of default color fallbacks for theme colors
 */
export const THEME_COLOR_FALLBACKS = {
  primary: '#1B5E20',
  accent: '#FFFFEB3B',
  bg: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceText: '#212121',
  subtle: '#757575',
  pop: '#FF8A00',
  primaryText: '#ffffff',
  themePrimary: '#1B5E20',
  themeAccent: '#FFFFEB3B',
  themeBg: '#FFFFFF',
  themeSurface: '#F5F5F5',
  themeSurfaceText: '#212121',
  themeSubtle: '#757575',
  themePop: '#FF8A00',
  'theme-color-primary': '#1B5E20',
  'theme-color-bg': '#FFFFFF',
  'theme-color-surface': '#F5F5F5',
  'theme-color-border': '#e0e0e0',
  'theme-color-gray': '#e0e0e0',
  'theme-color-text-primary': '#212121',
  'theme-color-text-secondary': '#475569',
  'theme-color-text-muted': '#757575',
  'theme-color-text-inverse': '#ffffff',
};
