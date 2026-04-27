export interface RawColors {
  white?: string;
  black?: string;
  primary?: string;
  secondary?: string;
  secondary2?: string;
  secondary3?: string;
  danger?: string;
  success?: string;
  info?: string;
  warning?: string;
  border?: string;
  gray?: string;
  dark?: string;
  light?: string;
  // Semantic colors from backend
  bg?: string;
  surface?: string;
  surfaceText?: string;
  subtle?: string;
  primaryText?: string;
  accent?: string;
  pop?: string;
}

export type Theme = "dark" | "light" | "system";
