import { View, FlatList } from 'react-native';
import { BookCard } from '~/components/partials/BookCard';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/Text';
import { useBookStore, useUserStore } from '~/store';
import { Icon } from '~/components/Icon';


export default function Index() {
  const { library, addBookToLibrary } = useUserStore();

  const handlePress = (item: Book) => {
    console.log('Pressed:', item.title);
    if (library.includes(item)) return; // Error: Libro già aggiunto alla libreria
    addBookToLibrary(item);
  };

  const isSelected = (id: string) => library.some((book) => book.id === id);

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
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-14 py-8"
          className="rounded-md"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookCard
              item={item}
              selected={isSelected(item.id)}
              onPress={() => handlePress(item)}
            />
          )}
        />

        {/* <LinearGradient
          colors={['#050507', 'rgba(245,245,247,0)']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            zIndex: 10,
          }}
          pointerEvents="none"
        /> */}

        <FiltersSheetModal />
      </View>
    </View>
  );
}
