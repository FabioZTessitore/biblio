import { Icon, IconType } from './Icon';
import { useColorScheme } from '~/lib/useColorScheme';

interface TabBarIconProps {
  size?: number | 26;
  type?: IconType; // se non lo metti, default = 'MaterialIcons'
  name: string; // accetta string generica
  active: boolean;
  className?: string;
}

export const TabBarIcon = (props: TabBarIconProps) => {
  const { colors } = useColorScheme();

  return (
    <Icon
      size={28}
      color={props.active ? colors.primary : colors.grey2}
      className="mb-1"
      {...props}
    />
  );
};
