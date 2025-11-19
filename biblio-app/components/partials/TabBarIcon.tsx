import { Icon, IconType } from '~/components/ui';
import { useColorScheme } from '~/lib/useColorScheme';

interface TabBarIconProps {
  size?: 'display' | 'heading' | 'body' | 'label' | number;
  type?: IconType; // se non lo metti, default = 'MaterialIcons'
  name: string; // accetta string generica
  active: boolean;
  className?: string;
}

export const TabBarIcon = (props: TabBarIconProps) => {
  const { colors } = useColorScheme();

  return (
    <Icon
      size={props.size ?? 'heading'}
      color={props.active ? colors.primary : colors.grey2}
      className="mb-1"
      {...props}
    />
  );
};
