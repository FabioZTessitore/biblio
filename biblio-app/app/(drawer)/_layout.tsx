import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '~/lib/useColorScheme';

export default function TabLayout() {
  const { colors } = useColorScheme();

  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />
      <Drawer.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </Drawer>
  );
}
