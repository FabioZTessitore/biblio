import { Theme, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { lightColors, darkColors } from "./colors";

export const navTheme: { light: Theme; dark: Theme } = {
  light: {
    dark: false,
    fonts: DefaultTheme.fonts,
    colors: {
      background: lightColors.background,
      card: lightColors.card,
      border: lightColors.border,
      primary: lightColors.primary,
      notification: lightColors.error,
      text: lightColors.foreground,
    },
  },
  dark: {
    dark: true,
    fonts: DarkTheme.fonts,
    colors: {
      background: darkColors.background,
      card: darkColors.card,
      border: darkColors.border,
      primary: darkColors.primary,
      notification: darkColors.error,
      text: darkColors.foreground,
    },
  },
};
