import { tokens } from "./tokens";

export type KeyColors =
  | "white"
  | "black"
  | "background"
  | "surface"
  | "card"
  | "primary"
  | "primaryMuted"
  | "secondary"
  | "secondaryMuted"
  | "tertiary"
  | "tertiaryMuted"
  | "foreground"
  | "muted"
  | "subtitle"
  | "border"
  | "success"
  | "error"
  | "warning";

export type AppColors = Record<KeyColors, string>;

export const lightColors: AppColors = {
  white: tokens.color.neutral[50],
  black: tokens.color.neutral[900],

  // Backgrounds
  background: tokens.color.neutral[50],
  surface: tokens.color.neutral[50],
  card: tokens.color.neutral[100],

  // Brand
  primary: tokens.color.primary[500],
  primaryMuted: tokens.color.primary[100],
  secondary: tokens.color.secondary[500],
  secondaryMuted: tokens.color.secondary[100],
  tertiary: tokens.color.tertiary[500],
  tertiaryMuted: tokens.color.tertiary[100],

  // Content
  foreground: tokens.color.neutral[900],
  muted: tokens.color.neutral[500],
  subtitle: tokens.color.neutral[400],
  border: tokens.color.neutral[200],

  // Feedback
  success: tokens.color.semantic.success,
  error: tokens.color.semantic.error,
  warning: tokens.color.semantic.warning,
};

export const darkColors: AppColors = {
  white: tokens.color.neutral[50],
  black: tokens.color.neutral[900],

  background: tokens.color.neutral[900],
  surface: tokens.color.neutral[800],
  card: tokens.color.neutral[800],

  primary: tokens.color.primary[400],
  primaryMuted: tokens.color.primary[900],
  secondary: tokens.color.secondary[300],
  secondaryMuted: tokens.color.secondary[900],
  tertiary: tokens.color.tertiary[300],
  tertiaryMuted: tokens.color.tertiary[900],

  foreground: tokens.color.neutral[50],
  muted: tokens.color.neutral[400],
  subtitle: tokens.color.neutral[600],
  border: tokens.color.neutral[700],

  success: tokens.color.semantic.success,
  error: tokens.color.semantic.error,
  warning: tokens.color.semantic.warning,
};
