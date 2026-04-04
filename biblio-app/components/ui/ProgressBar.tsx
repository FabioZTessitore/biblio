import React from "react";
import { View } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

type Props = {
  progress?: number; // da 0 a 1
  height?: number;
  color?: string;
  backgroundColor?: string;
};

export function ProgressBar({
  progress = 0,
  height = 6,
  color,
  backgroundColor,
}: Props) {
  const { colors } = useAppTheme();

  const fillColor = color ?? colors.primary;
  const trackColor = backgroundColor ?? colors.border;

  return (
    <View
      style={{
        height,
        backgroundColor: trackColor,
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
          height: "100%",
          backgroundColor: fillColor,
        }}
      />
    </View>
  );
}
