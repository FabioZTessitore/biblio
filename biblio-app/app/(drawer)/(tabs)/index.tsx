import { View, FlatList } from 'react-native';
import { useFiltersStore, useLibraryStore, useBiblioStore, useUserStore } from '~/store';
import { FiltersSheetModal, AddBookSheetModal } from '~/components';
import { LinearGradient } from 'expo-linear-gradient';
import { BookCard } from '~/components/partials';
import { Button } from '~/components/nativewindui/Button';
import { Icon } from '~/components/ui';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA } from '~/lib/utils';
import { useCallback, useEffect } from 'react';
import { Book } from '~/store/biblio';

export default function Index() {
  const { colors } = useColorScheme();
  const { books, setBookModal, fetchBooks } = useBiblioStore();
  const { library, addToLibrary } = useLibraryStore();
  const { membership } = useUserStore();
  const { filters, applyFilters } = useFiltersStore();

  useEffect(() => {
    // Load books when component mounts
    fetchBooks();
    console.log('libri caricati');
  }, [membership.schoolId]);

  const handlePressMemo = useCallback(
    (item: Book) => () => {
      if (membership.role === 'user' && !library.some((b) => b.id === item.id)) {
        addToLibrary(item);
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
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-14 py-8"
          className="rounded-md"
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          // removeClippedSubviews
          renderItem={({ item }) => (
            <BookCard item={item} selected={isSelected(item.id)} onPress={handlePressMemo(item)} />
          )}
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
        {membership.role === 'staff' && <AddBookSheetModal />}
      </View>
    </View>
  );
}
