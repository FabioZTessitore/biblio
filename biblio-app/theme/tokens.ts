export const tokens = {
  color: {
    primary: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#4F46E5", // <-- brand primary
      600: "#4338ca",
      700: "#3730a3",
      800: "#312e81",
      900: "#1e1b4b",
    },
    secondary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      300: "#6ee7b7",
      500: "#10B981", // <-- brand secondary
      700: "#047857",
      900: "#064e3b",
    },
    tertiary: {
      50: "#fff1f2",
      100: "#ffe4e6",
      300: "#fda4af",
      500: "#F43F5E", // <-- brand tertiary
      700: "#be123c",
      900: "#881337",
    },
    neutral: {
      50: "#f8f8f9",
      100: "#f0f0f2",
      200: "#e4e4e8",
      300: "#d1d1d8",
      400: "#a8a8b3",
      500: "#777681", // <-- neutral mid
      600: "#5c5b66",
      700: "#434252",
      800: "#2d2c3a",
      900: "#1a1928",
    },
    semantic: {
      success: "#10B981",
      error: "#F43F5E",
      warning: "#f59e0b",
      info: "#4F46E5",
    },
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
  },
} as const;
