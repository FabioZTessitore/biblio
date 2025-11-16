import { Tabs, Href } from 'expo-router';
import { TabBarIcon } from '~/components/TabBarIcon';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/Text';
import { Icon } from '~/components/Icon';
import { useFiltersStore, useUserStore } from '~/store';

type TabsProps = BottomTabNavigationOptions & {
  href?: Href | null;
};

export default function TabLayout() {
  const { uid } = useUserStore();
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
    title: 'Lista dei libri',
    headerTitleStyle: { fontSize: 24 },
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon name="home" color={focused ? colors.primary : colors.grey2} />
    ),
    headerRight: () => {
      const { openFiltersModal } = useFiltersStore();

      return (
        <Button
          onPress={openFiltersModal}
          variant="plain"
          size={'none'}
          className="mr-6 bg-transparent">
          <Icon color={colors.primary} type="MaterialCommunityIcons" name="filter-outline" />
          <Text color={'primary'}>Filters</Text>
        </Button>
      );
    },
  } as TabsProps;

  const OTHER_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'Other',
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon name="ellipsis-h" color={focused ? colors.primary : colors.grey2} />
    ),
  } as TabsProps;

  const ADD_BOOK = {
    ...SCREEN_OPTIONS,
    title: 'Aggiungi Libro',
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon name="book" color={focused ? colors.primary : colors.grey2} />
    ),
  } as TabsProps;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={INDEX_OPTIONS} />
      {!uid && <Tabs.Screen name="other" options={OTHER_OPTIONS} />}
      {uid && <Tabs.Screen name="addBook" options={ADD_BOOK} />}
    </Tabs>
  );
}
