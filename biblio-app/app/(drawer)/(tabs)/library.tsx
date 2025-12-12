import { FlatList, View, Alert } from 'react-native';
import { Text, Icon, BaseCard } from '~/components/ui';
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
  const { requests, requestLoan, isLoading } = useBiblioStore();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePress = (item: Book) => {
    removeFromLibrary(item.id);
  };

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

  const EmptyState = ({
    icon,
    title,
    subtitle,
  }: {
    icon: any;
    title: string;
    subtitle: string;
  }) => (
    <View className="flex-1 items-center justify-center gap-12">
      <Icon size={192} type="MaterialCommunityIcons" name={icon} color={colors.primary} />
      <View className="items-center gap-6">
        <Text variant="heading" className="text-center">
          {title}
        </Text>
        <Text className="text-center">{subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 px-4">
      <SegmentedControl
        values={['Carrello', 'Richieste']}
        selectedIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
      />

      {/* --- CARRELLO --- */}
      {selectedIndex === 0 && (
        <>
          <View className="flex-1">
            <FlatList
              data={library}
              ListEmptyComponent={() => (
                <EmptyState
                  icon="library-shelves"
                  title="Libreria vuota"
                  subtitle="Aggiungi i libri dalla lista dei libri e richiedi il prestito!"
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerClassName="flex-grow gap-8 py-8"
              renderItem={({ item }) => (
                <BookLibraryCard item={item} onRemove={() => removeFromLibrary(item.id)} />
              )}

            />

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
          </View>

          {library.length > 0 && (
            <View className="absolute bottom-0 left-0 right-0 bg-transparent/60 p-6">
              <Button disabled={isLoading} className="py-4" onPress={loanRequest}>
                {isLoading ? <ActivityIndicator /> : <Text>Richiedi Prestito</Text>}
              </Button>
            </View>
          )}
        </>
      )}

      {/* --- RICHIESTE --- */}
      {selectedIndex === 1 && (
        <View className="flex-1">
          <FlatList
            data={requests}
            ListEmptyComponent={() => (
              <EmptyState
                icon="book-arrow-left"
                title="Nessuna richiesta"
                subtitle="Aggiungi i libri dalla lista dei libri e richiedi il prestito!"
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="flex-grow gap-8 py-8"
            renderItem={({ item }) => <RequestCard item={item} />}
          />
            <LinearGradient
              colors={[colors.background, convertToRGBA(colors.background, 0)]}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 10,
                zIndex: 1,
              }}
              pointerEvents="none"
            />
        </View>
      )}
    </View>
  );
};

export default Library;
