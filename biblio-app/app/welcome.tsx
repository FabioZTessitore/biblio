import { View } from 'react-native';
import { Text } from '@/components/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Welcome() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 p-4 px-6">
      <KeyboardAwareScrollView
        bottomOffset={8}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-12"
        contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <View className="flex-grow justify-start gap-8">
          <Text>Test Login</Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
