import { View } from 'react-native';
import { Text, Icon } from '~/components/ui';
import { useColorScheme } from '~/lib/useColorScheme';

const EmptyState = ({ icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => {
  const { colors } = useColorScheme();

  return (
    <View className="flex-1 items-center justify-center gap-12 pt-20">
      <Icon size={192} type="MaterialCommunityIcons" name={icon} color={colors.primary} />
      <View className="items-center gap-6">
        <Text variant="heading" className="text-center">
          {title}
        </Text>
        <Text className="text-center">{subtitle}</Text>
      </View>
    </View>
  );
};

export { EmptyState };
