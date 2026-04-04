import { PressableScale, CustomPressableProps } from "pressto";
import { Text, TextProps } from "./Text";
import { useAppTheme, tokens } from "@/theme";
import { KeyColors } from "@/theme/colors";

type Variant = "primary" | "secondary" | "inverted" | "outlined";
type ButtonSize = "sm" | "md" | "lg" | "icon";
type ButtonRadius = keyof typeof tokens.radius;

interface ButtonProps extends CustomPressableProps {
  variant?: Variant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  label?: string;
  icon?: React.ReactNode;
  textVariant?: TextProps["variant"];
  textWeight?: TextProps["weight"];
  textClassName?: TextProps["className"];
}

const sizeMap: Record<ButtonSize, { px: number; py: number }> = {
  sm: { px: 12, py: 8 },
  md: { px: 20, py: 12 },
  lg: { px: 24, py: 16 },
  icon: { px: 16, py: 16 },
};

export const Button = ({
  variant = "primary",
  size = "md",
  radius = "md",
  label,
  icon,
  textVariant = "body",
  textWeight = "regular",
  style,
  textClassName,
  ...rest
}: ButtonProps) => {
  const { colors } = useAppTheme();

  const styleMap: Record<
    Variant,
    { bg: string; text: KeyColors; border?: string }
  > = {
    primary: { bg: colors.primary, text: "white" },
    secondary: { bg: colors.secondary, text: "white" },
    inverted: { bg: colors.foreground, text: "background" },
    outlined: { bg: "transparent", text: "foreground", border: colors.border },
  };

  const s = styleMap[variant];
  const { px, py } = sizeMap[size];

  return (
    <PressableScale
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: s.bg,
          borderWidth: s.border ? 1 : 0,
          borderColor: s.border,
          paddingHorizontal: px,
          paddingVertical: py,
          borderRadius: tokens.radius[radius],
        },
        style,
      ]}
      {...rest}
    >
      {icon}

      {label && (
        <Text
          className={textClassName}
          variant={textVariant}
          weight={textWeight}
          color={s.text}
        >
          {label}
        </Text>
      )}
    </PressableScale>
  );
};
