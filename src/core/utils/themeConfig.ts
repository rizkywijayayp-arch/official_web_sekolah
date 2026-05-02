import { API_CONFIG } from "@/config/api";

export interface SchoolTheme {
  themePrimary: string;
  themeAccent: string;
  themeBg: string;
  themeSurface: string;
  themeSurfaceText: string;
  themeSubtle: string;
  themePop: string;
}

const DEFAULT_THEME: SchoolTheme = {
  themePrimary: '#1B5E20',
  themeAccent: '#FFFFEB3B',
  themeBg: '#FFFFFF',
  themeSurface: '#F5F5F5',
  themeSurfaceText: '#212121',
  themeSubtle: '#757575',
  themePop: '#FF8A00',
};

/**
 * Apply theme colors to CSS variables
 */
export const applyTheme = (theme: SchoolTheme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Core theme variables (backward compatible)
  root.style.setProperty('--theme-primary', theme.themePrimary);
  root.style.setProperty('--theme-accent', theme.themeAccent);
  root.style.setProperty('--theme-bg', theme.themeBg);
  root.style.setProperty('--theme-surface', theme.themeSurface);
  root.style.setProperty('--theme-surface-text', theme.themeSurfaceText);
  root.style.setProperty('--theme-subtle', theme.themeSubtle);
  root.style.setProperty('--theme-pop', theme.themePop);

  // Semantic aliases for consistency with theme-provider
  root.style.setProperty('--theme-color-primary', theme.themePrimary);
  root.style.setProperty('--theme-color-text-primary', theme.themeSurfaceText);
  root.style.setProperty('--theme-color-text-secondary', theme.themeSubtle);
  root.style.setProperty('--theme-color-bg', theme.themeBg);
  root.style.setProperty('--theme-color-surface', theme.themeSurface);
  root.style.setProperty('--theme-color-border', theme.themeSubtle);
  root.style.setProperty('--theme-color-gray', theme.themeSubtle);
  root.style.setProperty('--theme-color-accent', theme.themeAccent);
  root.style.setProperty('--theme-color-pop', theme.themePop);
};

/**
 * Fetch school theme from API and apply to document
 */
export const loadAndApplyTheme = async (schoolId: string | number): Promise<SchoolTheme> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/profileSekolah?schoolId=${schoolId}`);
    const result = await response.json();

    if (result.success && result.data) {
      const theme: SchoolTheme = {
        themePrimary: result.data.themePrimary || DEFAULT_THEME.themePrimary,
        themeAccent: result.data.themeAccent || DEFAULT_THEME.themeAccent,
        themeBg: result.data.themeBg || DEFAULT_THEME.themeBg,
        themeSurface: result.data.themeSurface || DEFAULT_THEME.themeSurface,
        themeSurfaceText: result.data.themeSurfaceText || DEFAULT_THEME.themeSurfaceText,
        themeSubtle: result.data.themeSubtle || DEFAULT_THEME.themeSubtle,
        themePop: result.data.themePop || DEFAULT_THEME.themePop,
      };

      applyTheme(theme);
      return theme;
    }
  } catch (err) {
    console.error('Gagal load theme:', err);
  }

  applyTheme(DEFAULT_THEME);
  return DEFAULT_THEME;
};

export { DEFAULT_THEME };
