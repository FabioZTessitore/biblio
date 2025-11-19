import { Drawer } from 'expo-router/drawer';
import { useUserStore } from '~/store';

export default function TabLayout() {
  const { uid } = useUserStore();

  return (
    <Drawer screenOptions={{}}>
      {!uid && <Drawer.Screen name="(tabs)" options={{ title: 'Home', headerShown: false }} />}
      {uid && <Drawer.Screen name="login" options={{ title: 'Login' }} />}
    </Drawer>
  );
}
