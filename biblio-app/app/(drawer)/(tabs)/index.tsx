import { View, FlatList, RefreshControl, Pressable } from 'react-native';
import { useFiltersStore, useLibraryStore, useBiblioStore, useUserStore } from '~/store';
import { FiltersSheetModal } from '~/components';
// import { LinearGradient } from 'expo-linear-gradient';
import { BookCard, EmptyState } from '~/components/partials';
import { Text } from '~/components/ui';
import { useColorScheme } from '~/lib/useColorScheme';
// import { convertToRGBA } from '~/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { Book } from '~/store/biblio';
import { useTranslation } from 'react-i18next';
import AddBookBtn from '~/components/staff/AddBookBtn';
import AddBookModal from '~/components/staff/AddBookModal';

export default function Index() {
  const { colors } = useColorScheme();
  const { books, subscribeBooks, subscribeRequests, setBookEditModal, subscribeLoans, isLoading } =
    useBiblioStore();

  const { t } = useTranslation();

  const { library, addToLibrary } = useLibraryStore();
  const { membership } = useUserStore();
  const { filters, applyFilters, resetFilters } = useFiltersStore();

  const [bookIdToEdit, setBookIdToEdit] = useState('');

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(subscribeBooks());
    unsubs.push(subscribeRequests());

    if (membership.role === 'staff') {
      unsubs.push(subscribeLoans());
    }

    return () => {
      unsubs.forEach((u) => u && u());
    };
  }, [membership.schoolId, membership.role]);

  const handlePress = useCallback(
    (item: Book) => {
      if (membership.role === 'user' && !library.some((b) => b.id === item.id)) {
        addToLibrary(item);
      } else {
        setBookIdToEdit(item.id);
        setBookEditModal(true);
      }
    },
    [membership.role, library, addToLibrary, setBookEditModal]
  );

  const isSelected = (id: string) => library.some((book) => book.id === id);

  const filteredBooks = applyFilters(books, filters);

  return (
    <View className="relative flex-1 px-4">
      <FlatList
        ListEmptyComponent={() => {
          if (books.length === 0) {
            return <Text className="text-center">Non ci sono libri nella tua scuola.</Text>;
          }
          if (filteredBooks.length === 0) {
            return (
              <View className="flex-1 justify-center">
                <EmptyState
                  icon={'filter-off-outline'}
                  title={'Nessun libro corrisponde ai filtri selezionati.'}
                  subtitle=""
                />
                <Pressable onPress={resetFilters}>
                  <Text className="text-center" color="primary">
                    {t('index.resetFilters')}
                  </Text>
                </Pressable>
              </View>
            );
          }
          return null;
        }}
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-14 py-8"
        className="rounded-md"
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        renderItem={({ item }) => (
          <BookCard item={item} selected={isSelected(item.id)} onPress={() => handlePress(item)} />
        )}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
            refreshing={isLoading}
            enabled={false}
          />
        }
      />

      {membership.role === 'staff' && <AddBookBtn />}

      {/* <LinearGradient
        colors={[colors.background, convertToRGBA(colors.background, 0)]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          zIndex: 10,
        }}
        pointerEvents="none"
      /> */}

      <FiltersSheetModal />

      {membership.role === 'staff' && <AddBookModal />}
    </View>
  );
}
