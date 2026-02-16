import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '~/lib/useColorScheme';
import { useUserStore } from '~/store';

export default function TabLayout() {
  const { t } = useTranslation();

  const { colors } = useColorScheme();

  const { user } = useUserStore();

  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />

      <Drawer.Protected guard={!!user.uid}>
        <Drawer.Screen
          name="logout"
          options={{
            title: t('form_user.logout'),
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
