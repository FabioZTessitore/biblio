import { Drawer } from 'expo-router/drawer';

export default function TabLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />
      <Drawer.Screen name="sign-up" options={{ title: 'Registrazione' }} />
    </Drawer>
  );
}
