import { Text } from '@/components/ui';
import { View } from 'react-native';

const WelcomeBack = () => {
  return (
    <View className="gap-2">
      <Text className="uppercase tracking-widest" color="muted" weight="semibold">
        Welcome Back
      </Text>
      <Text variant="display" weight="bold">
        Hello, Student
      </Text>
    </View>
  );
};

export { WelcomeBack };
