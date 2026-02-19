import { View } from 'react-native';
import { Tabs, Href, useNavigation, router } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Icon } from '~/components/ui';
import { TabBarIcon } from '~/components/partials';
import { Button } from '~/components/nativewindui/Button';
import { useFiltersStore, useLibraryStore, useUserStore } from '~/store';
import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type TabsProps = BottomTabNavigationOptions & {
  href?: Href | null;
};

const HeaderRight = () => {
  const { colors } = useColorScheme();
  const { openFiltersModal } = useFiltersStore();

  return (
    <View className="mr-6 flex-row gap-4">
      <Button onPress={openFiltersModal} variant="plain" size={'none'} className="bg-transparent">
        <Icon color={colors.primary} type="MaterialCommunityIcons" name="filter-outline" />
      </Button>
      <Button
        onPress={() => router.push('/settings')}
        variant="plain"
        size={'none'}
        className="bg-transparent">
        <Icon color={colors.grey2} type="MaterialCommunityIcons" name="cog-outline" />
      </Button>
    </View>
  );
};

const HeaderBin = () => {
  const { library, clearLibrary } = useLibraryStore();

  const isEmpty = library.length <= 0;

  return (
    <Button
      variant="plain"
      className="mr-6"
      size={'icon'}
      disabled={isEmpty}
      onPress={clearLibrary}>
      <Icon
        type="MaterialCommunityIcons"
        name={isEmpty ? 'delete-empty-outline' : 'delete-outline'}
      />
    </Button>
  );
};

export default function TabLayout() {
  const { t } = useTranslation();
  const { membership } = useUserStore();
  const { colors } = useColorScheme();

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
    title: t('tabs.index_title'),
    tabBarIcon: ({ focused, size }) => <TabBarIcon name="book" active={focused} />,
    headerRight: HeaderRight,
  } as TabsProps;

  const LIBRARY_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: t('tabs.library_title'),
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon type="MaterialCommunityIcons" name="library-shelves" active={focused} />
    ),
    headerRight: HeaderBin,
  } as TabsProps;

  const ADD_BOOK = {
    ...SCREEN_OPTIONS,
    title: t('tabs.bookreservations'),
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon type="MaterialCommunityIcons" name="hand-extended" active={focused} />
    ),
  } as TabsProps;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={INDEX_OPTIONS} />
      <Tabs.Protected guard={membership.role === 'user'}>
        <Tabs.Screen name="library" options={LIBRARY_OPTIONS} />
      </Tabs.Protected>
      <Tabs.Protected guard={membership.role === 'staff'}>
        <Tabs.Screen name="reservation" options={ADD_BOOK} />
      </Tabs.Protected>
    </Tabs>
  );
}
