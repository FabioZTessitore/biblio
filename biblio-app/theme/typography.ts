export const typography = {
  scale: {
    display: { fontSize: 30, lineHeight: 36 },
    heading: { fontSize: 20, lineHeight: 28 },
    body: { fontSize: 16, lineHeight: 24 },
    label: { fontSize: 14, lineHeight: 20 },
    caption: { fontSize: 12, lineHeight: 16 },
  },
  family: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semibold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
} as const;

export type TypographyVariant = keyof typeof typography.scale;
export type FontWeight = keyof typeof typography.family;
