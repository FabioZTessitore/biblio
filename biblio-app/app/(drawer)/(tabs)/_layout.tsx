import { Alert } from 'react-native';
import { Tabs, Href } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Text, Icon } from '~/components/ui';
import { TabBarIcon } from '~/components/partials';
import { Button } from '~/components/nativewindui/Button';
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
    headerShown: true,
    headerShadowVisible: false,
    headerTitleContainerStyle: { marginLeft: 24 },
  } as TabsProps;

  const INDEX_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'Lista dei libri',
    headerTitleStyle: { fontSize: 24 },
    tabBarIcon: ({ focused, size }) => <TabBarIcon name="book" active={focused} />,
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

  const LIBRARY_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'Libreria',
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon type="MaterialCommunityIcons" name="library-shelves" active={focused} />
    ),
    headerRight: () => {
      const { library, setLibrary } = useUserStore();

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

  // const ADD_BOOK = {
  //   ...SCREEN_OPTIONS,
  //   title: 'Aggiungi Libro',
  //   tabBarIcon: ({ focused, size }) => (
  //     <TabBarIcon name="book" color={focused ? colors.primary : colors.grey2} />
  //   ),
  // } as TabsProps;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={INDEX_OPTIONS} />
      <Tabs.Screen name="library" options={LIBRARY_OPTIONS} />
      {/* {uid && <Tabs.Screen name="addBook" options={ADD_BOOK} />} */}
    </Tabs>
  );
}
