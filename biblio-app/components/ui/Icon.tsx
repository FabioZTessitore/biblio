import React from "react";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  EvilIcons,
  Fontisto,
  Foundation,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import { TouchableOpacity, Linking } from "react-native";
import { useAppTheme, AppColors, typography } from "@/theme";

const ICON_TYPES = {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  EvilIcons,
  Fontisto,
  Foundation,
  SimpleLineIcons,
  Zocial,
};

export type IconType = keyof typeof ICON_TYPES;
type ColorName = keyof AppColors;

const sizeMap: Record<keyof typeof typography.scale, number> = {
  display: typography.scale.display.fontSize,
  heading: typography.scale.heading.fontSize,
  body: typography.scale.body.fontSize,
  label: typography.scale.label.fontSize,
  caption: typography.scale.caption.fontSize,
};

export interface IconProps<T extends IconType = "MaterialIcons"> {
  name: React.ComponentProps<(typeof ICON_TYPES)[T]>["name"];
  type?: T;
  size?: keyof typeof sizeMap;
  color?: ColorName;
  link?: string;
  className?: string;
}

export const Icon = <T extends IconType = "MaterialIcons">({
  name,
  type = "MaterialIcons" as T,
  size = "heading",
  color = "foreground",
  link,
  className,
}: IconProps<T>) => {
  const { colors } = useAppTheme();

  const IconComponent = (ICON_TYPES[type] ??
    MaterialIcons) as React.ComponentType<{
    name: any;
    size?: number;
    color?: string;
    className?: string;
  }>;

  const icon = (
    <IconComponent
      name={name}
      size={sizeMap[size]}
      color={colors[color]}
      className={className}
    />
  );

  return link ? (
    <TouchableOpacity onPress={() => Linking.openURL(link)}>
      {icon}
    </TouchableOpacity>
  ) : (
    icon
  );
};
