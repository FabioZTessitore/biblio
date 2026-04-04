import { typography, useAppTheme } from "@/theme";
import { View } from "react-native";
import { Text } from "./Text";

type FieldProps = {
  label?: string;
  children: React.ReactNode;
  error?: string;
};

export function Field({ label, children, error }: FieldProps) {
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text
          style={{
            color: colors.muted,
            fontSize: typography.scale.caption.fontSize,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
      )}

      {children}

      {error && (
        <Text
          style={{
            color: colors.error,
            fontSize: typography.scale.caption.fontSize,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
