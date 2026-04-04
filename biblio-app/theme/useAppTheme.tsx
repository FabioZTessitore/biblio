import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "./colors";
import { navTheme } from "./navigation";

export const useAppTheme = () => {
  const scheme = useColorScheme();

  const isDarkColorScheme = scheme === "dark";
  const theme = scheme === "unspecified" ? navTheme["dark"] : navTheme[scheme];

  return {
    colorScheme: scheme,
    isDarkColorScheme: isDarkColorScheme,
    colors: isDarkColorScheme ? darkColors : lightColors,
    navTheme: theme,
  };
};
