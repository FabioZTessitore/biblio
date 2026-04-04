import { StyleSheet, View, ViewProps } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme";

interface ScreenWrapperProps extends ViewProps {
  safeArea?: boolean;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

const ScreenWrapper = ({
  safeArea = false,
  children,
  style,
  ...props
}: ScreenWrapperProps) => {
  const { colors } = useAppTheme();

  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container
      {...props}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: safeArea ? 8 : 24,
        },
        style,
      ]}
    >
      {children}
    </Container>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20,
  },
});
