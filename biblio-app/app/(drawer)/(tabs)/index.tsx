import { View, FlatList, RefreshControl, Pressable } from 'react-native';
import { useFiltersStore, useLibraryStore, useBiblioStore, useUserStore } from '~/store';
import { FiltersSheetModal, BookSheetModal } from '~/components';
import { LinearGradient } from 'expo-linear-gradient';
import { BookCard } from '~/components/partials';
import { Button } from '~/components/nativewindui/Button';
import { Icon, Text } from '~/components/ui';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA } from '~/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { Book } from '~/store/biblio';

export default function Index() {
  const { colors } = useColorScheme();
  const {
    books,
    setBookModal,
    subscribeBooks,
    subscribeRequests,
    setBookEditModal,
    bookModal,
    bookEditModal,
    subscribeLoans,
    isLoading,
  } = useBiblioStore();
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

  const handlePressMemo = useCallback(
    (item: Book) => () => {
      if (membership.role === 'user' && !library.some((b) => b.id === item.id)) {
        addToLibrary(item);
      } else {
        setBookIdToEdit(item.id);
        setBookEditModal(true);
      }
    },
    [membership, library]
  );

  const isSelected = (id: string) => library.some((book) => book.id === id);

  const filteredBooks = applyFilters(books, filters);

  return (
    <View className="flex-1 gap-4 px-4">
      {/* <View className="rounded-2xl bg-card">
        <SearchInput textContentType="none" autoComplete="off" />
      </View>
      <View className="flex-row">
        <View className="rounded-full bg-secondary px-2 py-1">
          <Text variant={'label'}>Aggiungin +</Text>
        </View>
      </View> */}

      <View className="flex-1">
        <FlatList
          ListEmptyComponent={() => {
            if (books.length === 0) {
              return <Text className="text-center">Non ci sono libri nella tua libreria.</Text>;
            }
            if (filteredBooks.length === 0) {
              return (
                <>
                  <Text className="text-center">
                    Nessun libro corrisponde ai filtri selezionati.
                  </Text>
                  <Pressable onPress={resetFilters}>
                    <Text className="text-center" color="primary">
                      Elimina
                    </Text>
                  </Pressable>
                </>
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
            <BookCard item={item} selected={isSelected(item.id)} onPress={handlePressMemo(item)} />
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

        {membership.role === 'staff' && (
          <View className="absolute bottom-0 right-2 z-10 h-20">
            <Button className="rounded-2xl p-4" size={'none'} onPress={() => setBookModal(true)}>
              <Icon name="add" />
            </Button>
          </View>
        )}

        <LinearGradient
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
        />

        <FiltersSheetModal />
        {membership.role === 'staff' && (
          <>
            <BookSheetModal mode="add" visible={bookModal} onClose={() => setBookModal(false)} />

            <BookSheetModal
              mode="edit"
              visible={bookEditModal}
              bookId={bookIdToEdit}
              onClose={() => setBookEditModal(false)}
            />
          </>
        )}
      </View>
    </View>
  );
}
