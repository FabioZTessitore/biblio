import { Tabs, Href, Redirect } from 'expo-router';
import { TabBarIcon } from '~/components/TabBarIcon';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useUserStore } from '~/store/user';

type TabsProps = BottomTabNavigationOptions & {
  href?: Href | null;
};

export default function TabLayout() {
  const { colors } = useColorScheme();

  const { isAuthenticated } = useUserStore();

  const SCREEN_OPTIONS = {
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerShown: true,
    headerShadowVisible: false,
    headerTitleContainerStyle: { marginLeft: 24 },
  } as TabsProps;

  const INDEX_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'Home',
    tabBarIcon: ({ focused, size }) => <TabBarIcon name="home" color={colors.primary} />,
  } as TabsProps;

  if (!isAuthenticated) {
    return <Redirect href="/sign-up" />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="index" options={INDEX_OPTIONS} />
    </Tabs>
  );
}
