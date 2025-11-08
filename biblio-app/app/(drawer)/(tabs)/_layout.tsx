import { Tabs, Href } from 'expo-router';
import { TabBarIcon } from '~/components/TabBarIcon';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

type TabsProps = BottomTabNavigationOptions & {
  href?: Href | null;
};

export default function TabLayout() {
  const { colors } = useColorScheme();

  const SCREEN_OPTIONS = {
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerShown: false,
    headerShadowVisible: false,
    headerTitleContainerStyle: { marginLeft: 24 },
  } as TabsProps;

  const INDEX_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'Home',
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon name="home" color={focused ? colors.primary : colors.grey2} />
    ),
  } as TabsProps;

  const OTHER_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'Other',
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon name="ellipsis-h" color={focused ? colors.primary : colors.grey2} />
    ),
  } as TabsProps;

  return (
    <Tabs>
      <Tabs.Screen name="home" options={INDEX_OPTIONS} />
      <Tabs.Screen name="other" options={OTHER_OPTIONS} />
    </Tabs>
  );
}
