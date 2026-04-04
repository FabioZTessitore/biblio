import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { typography, useAppTheme, AppColors } from "@/theme";

type Variant = keyof typeof typography.scale;
type Weight = keyof typeof typography.family;
type ColorName = keyof AppColors;

export interface TextProps extends RNTextProps {
  variant?: Variant;
  weight?: Weight;
  color?: ColorName;
}

export const Text = ({
  variant = "body",
  weight = "regular",
  color = "foreground",
  style,
  ...props
}: TextProps) => {
  const { colors } = useAppTheme();

  return (
    <RNText
      style={[
        typography.scale[variant],
        {
          fontFamily: typography.family[weight],
          color: colors[color],
        },
        style,
      ]}
      {...props}
    />
  );
};
