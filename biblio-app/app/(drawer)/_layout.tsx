import { Drawer } from 'expo-router/drawer';

export default function TabLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />
      <Drawer.Screen name="login" options={{ title: 'Login' }} />
    </Drawer>
  );
}
