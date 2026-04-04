import { ScrollView, View } from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';

import { WelcomeBack } from '../components/WelcomeBack';
import { Button } from '@/components/ui';
import { router } from 'expo-router';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenWrapper className="gap-14">
        <WelcomeBack />

        <Button label="Login" onPress={() => router.push('/welcome')} />
      </ScreenWrapper>
    </ScrollView>
  );
};

export { HomeScreen };
