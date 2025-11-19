import { View } from 'react-native';
import { Text } from '~/components/ui';
import { useColorScheme } from '~/lib/useColorScheme';

export default function HomeBibliotecaio() {
  const { colors } = useColorScheme();

  return (
    <View className="flex-row justify-between gap-8 rounded-lg bg-card p-4 shadow-md">
      <Text>home del bibliotecaio</Text>
    </View>
  );
}
