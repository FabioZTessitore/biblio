import { FlatList, View, Alert, RefreshControl } from 'react-native';
import { Text, BaseCard } from '~/components/ui';
import { EmptyState } from '~/components/partials';
import { Book, Request, useBiblioStore } from '~/store/biblio';
import { useLibraryStore } from '~/store';
import { Button } from '~/components/nativewindui/Button';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA, truncateText } from '~/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';

/* ------------------------------------------
   CARD LIBRERIA (usa BaseCard)
------------------------------------------- */
const BookLibraryCard = ({ item, onRemove }: { item: Book; onRemove: () => void }) => {
  const { colors } = useColorScheme();

  return (
    <BaseCard
      title={item.title}
      subtitle={item.author}
      imageUri={`https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg`}
      statusColor={item.available ? colors.success : colors.destructive}
      statusLabel={item.available ? 'Disponibile' : 'Non disponibile'}
      actionLabel="Rimuovi"
      onPress={onRemove}
    />
  );
};

/* ------------------------------------------
   CARD RICHIESTE (usa BaseCard)
------------------------------------------- */
const RequestCard = ({ item }: { item: Request }) => {
  const { colors } = useColorScheme();
  const { books, cancelRequest } = useBiblioStore();

  const book = books.find((b) => b.id === item.bookId) ?? {
    title: '',
    author: '',
    isbn: '',
  };

  const statusMap = {
    approved: { color: colors.success, label: 'Approvato' },
    rejected: { color: colors.destructive, label: 'Rifiutato' },
    pending: { color: colors.grey2, label: 'In attesa' },
  };

  const { color, label } = statusMap[item.status] ?? statusMap.pending;

  return (
    <BaseCard
      title={book.title}
      subtitle={book.author}
      imageUri={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
      statusColor={color}
      statusLabel={label}
      actionLabel="Cancella richiesta"
      onPress={() => cancelRequest(item.id)}
    />
  );
};

/* ------------------------------------------
   LIBRERIA
------------------------------------------- */
const Library = () => {
  const { colors } = useColorScheme();

  const { library, removeFromLibrary } = useLibraryStore();
  const { requests, requestLoan, isLoading, fetchRequests, fetchBooks, setIsLoading } =
    useBiblioStore();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const loanRequest = () => {
    if (library.some((book) => !book.available)) {
      Alert.alert('Attenzione!', 'Uno o più libri non sono disponibili');
      return;
    }

    if (library.some((book) => requests.some((r) => r.bookId === book.id))) {
      Alert.alert('Attenzione!', 'Non puoi richiedere un libro già richiesto');
      return;
    }

    library.forEach((book) => requestLoan(book.id));
  };

  const order = {
    pending: 0,
    rejected: 1,
    approved: 2,
  };

  const tabConfig = {
    0: {
      data: library,
      emptyIcon: 'library-shelves',
      emptyTitle: 'Libreria vuota',
      renderer: ({ item }: { item: Book }) => (
        <BookLibraryCard item={item} onRemove={() => removeFromLibrary(item.id)} />
      ),
      refresh: fetchBooks,
    },
    1: {
      data: requests.sort((a, b) => order[a.status] - order[b.status]),
      emptyIcon: 'book-arrow-left',
      emptyTitle: 'Nessuna richiesta',
      renderer: ({ item }: { item: Request }) => <RequestCard item={item} />,
      refresh: fetchRequests,
    },
  } as any;

  const current = tabConfig[selectedIndex];

  return (
    <View className="flex-1 px-4">
      <FlatList
        ListHeaderComponent={() => (
          <SegmentedControl
            values={['Carrello', 'Richieste']}
            selectedIndex={selectedIndex}
            onIndexChange={setSelectedIndex}
          />
        )}
        data={current.data}
        keyExtractor={(item) => item.id}
        renderItem={current.renderer}
        ListEmptyComponent={() => (
          <EmptyState
            icon={current.emptyIcon}
            title={current.emptyTitle}
            subtitle="Aggiungi i libri dalla lista dei libri e richiedi il prestito!"
          />
        )}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
            refreshing={isLoading}
            onRefresh={async () => {
              setIsLoading(true);
              await current.refresh();
              setIsLoading(false);
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-8 py-8 pb-32"
      />

      <LinearGradient
        colors={[colors.background, convertToRGBA(colors.background, 0)]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 16,
          zIndex: 1,
        }}
        pointerEvents="none"
      />

      {selectedIndex === 0 && library.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-transparent/60 p-6">
          <Button disabled={isLoading} className="py-4" onPress={loanRequest}>
            {isLoading ? <ActivityIndicator /> : <Text>Richiedi Prestito</Text>}
          </Button>
        </View>
      )}
    </View>
  );
};

export default Library;
