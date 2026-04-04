import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
    </Tabs>
  );
}
