import { Alert } from 'react-native';
import { Tabs, Href, useNavigation } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Text, Icon } from '~/components/ui';
import { TabBarIcon } from '~/components/partials';
import { Button } from '~/components/nativewindui/Button';
import { useFiltersStore, useUserStore } from '~/store';
import { DrawerActions } from '@react-navigation/native';

type TabsProps = BottomTabNavigationOptions & {
  href?: Href | null;
};

export default function TabLayout() {
  const navigation = useNavigation();
  const { openFiltersModal } = useFiltersStore();
  const { library, setLibrary, isAuthenticated } = useUserStore();
  const { colors } = useColorScheme();

  // const { uid } = useUserStore();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

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
    title: 'Lista dei libri',
    headerTitleStyle: { fontSize: 24 },
    tabBarIcon: ({ focused, size }) => <TabBarIcon name="book" active={focused} />,
    headerLeft: () => {
      return (
        <Button onPress={openDrawer} variant="plain" size={'icon'}>
          <Icon color={colors.grey2} type="MaterialCommunityIcons" name="menu" />
        </Button>
      );
    },
    headerRight: () => {
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

  const LIBRARY_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'Libreria',
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon type="MaterialCommunityIcons" name="library-shelves" active={focused} />
    ),
    headerRight: () => {
      const isEmpty = library.length <= 0;

      return (
        <Button
          variant="plain"
          className="mr-6"
          size={'icon'}
          disabled={isEmpty}
          onPress={() => {
            Alert.alert('Attenzione!', 'Vuoi eliminare tutta la libreria?', [
              {
                text: 'Annulla',
                style: 'cancel',
                isPreferred: true,
              },
              {
                text: 'Sì',
                style: 'destructive',
                onPress: () => {
                  setLibrary([]);
                },
              },
            ]);
          }}>
          <Icon
            type="MaterialCommunityIcons"
            name={isEmpty ? 'delete-empty-outline' : 'delete-outline'}
          />
        </Button>
      );
    },
  } as TabsProps;

  const ADD_BOOK = {
    ...SCREEN_OPTIONS,
    title: 'Prenotazioni',
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon type="MaterialCommunityIcons" name="hand-extended" active={focused} />
    ),
  } as TabsProps;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={INDEX_OPTIONS} />
      <Tabs.Protected guard={!isAuthenticated}>
        <Tabs.Screen name="library" options={LIBRARY_OPTIONS} />
      </Tabs.Protected>
      <Tabs.Protected guard={isAuthenticated}>
        <Tabs.Screen name="reservation" options={ADD_BOOK} />
      </Tabs.Protected>
    </Tabs>
  );
}
