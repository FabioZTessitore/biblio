import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuthStore } from '~/store';

export default function TabLayout() {
  const { colors } = useColorScheme();

  const { isAuthenticated } = useAuthStore();

  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />

      <Drawer.Protected guard={isAuthenticated}>
        <Drawer.Screen
          name="logout"
          options={{
            title: 'Logout',
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
      </Drawer.Protected>
    </Drawer>
  );
}
