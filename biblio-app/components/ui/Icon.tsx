import React from 'react';
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { TouchableOpacity, Linking } from 'react-native';

export type IconType = keyof typeof ICON_TYPES;

export interface IconProps<T extends IconType = 'MaterialIcons'> {
  name: React.ComponentProps<(typeof ICON_TYPES)[T]>['name'];
  type?: T;
  size?: 'display' | 'heading' | 'body' | 'label' | number;
  color?: string;
  link?: string;
  className?: string;
}

const ICON_TYPES = {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
};

function parseSize(size: 'display' | 'heading' | 'body' | 'label' | number) {
  switch (size) {
    case 'display':
      return 36; // 36px
    case 'heading':
      return 24; // 24px
    case 'body':
      return 16; // 16px
    case 'label':
      return 14; // 14px
    default:
      return size;
  }
}

export const Icon = <T extends IconType = 'MaterialIcons'>({
  name,
  type = 'MaterialIcons' as T,
  size = 'heading',
  color,
  link,
  className,
}: IconProps<T>) => {
  const { colors } = useColorScheme();
  const IconComponent = ICON_TYPES[type];

  if (!IconComponent) {
    console.warn(`Tipo di icona "${type}" non trovato. Usando "MaterialIcons" di default.`);
    return (
      <MaterialIcons
        name={name}
        className={className}
        size={parseSize(size)}
        color={color ?? colors.foreground}
      />
    );
  }

  const handlePress = () => {
    if (link) {
      Linking.openURL(link);
    }
  };

  const icon = (
    <IconComponent
      name={name}
      className={className}
      size={parseSize(size)}
      color={color ?? colors.foreground}
    />
  );

  return link ? <TouchableOpacity onPress={handlePress}>{icon}</TouchableOpacity> : icon;
};
