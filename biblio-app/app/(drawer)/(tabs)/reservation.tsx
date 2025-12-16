import { View, FlatList, Image, Pressable, RefreshControl } from 'react-native';
import { Text } from '~/components/ui';
import { useState } from 'react';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { LinearGradient } from 'expo-linear-gradient';
import { convertToRGBA, truncateText } from '~/lib/utils';
import { useColorScheme } from '~/lib/useColorScheme';
import { useBiblioStore } from '~/store';
import { Loan, Request } from '~/store/biblio';
import { EmptyState } from '~/components/partials';

const BookLoanCard = ({ item, onRemove }: { item: Loan; onRemove: () => void }) => {
  const { colors } = useColorScheme();
  const { books, cancelRequest } = useBiblioStore();

  const book = books.find((b) => b.id === item.bookId) ?? {
    title: '',
    author: '',
    isbn: '',
  };

  return (
    // <BaseStaffCard
    //   // title={item.dueDate.toString()}
    //   // subtitle={item.startDate.toString()}
    //   // imageUri={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
    //   // statusColor={item.returnedAt ? colors.success : colors.destructive}
    //   // user={}
    //   // actionLabel="Rimuovi"
    //   // onPress={onRemove}
    // />
    <></>
  );
};

const RequestCard = ({ item }: { item: Request }) => {
  const { books, rejectRequest, requestUsers, approveRequest } = useBiblioStore();
  const { colors } = useColorScheme();

  const user = requestUsers.find((u) => u.uid === item.userId);

  if (!user) return null;

  const book = books.find((b) => b.id === item.bookId);
  if (!book) return null;

  return (
    <View className="flex-row justify-between gap-8 rounded-lg bg-card p-4 shadow-md">
      <Image
        resizeMode="cover"
        resizeMethod="resize"
        className="h-36 w-28 rounded-2xl"
        source={{ uri: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` }}
      />

      <View className="items-end justify-between">
        <View className="items-end gap-2">
          <Text>{`${user.name} ${user.surname} 2Gi`}</Text>
          <Text variant={'label'}>{truncateText(book.title, 20)}</Text>
          <Text color={'muted'} variant={'label'}>{`Copie rimanenti: ${book.available}`}</Text>
        </View>

        <View className="flex-row gap-4">
          <Pressable
            className="px-2 py-2"
            android_ripple={{
              color: colors.grey2,
              foreground: true,
              radius: 32,
              borderless: true,
            }}
            onPress={() => {
              rejectRequest(item.id);
            }}>
            <Text variant="label" weight="light" color={'muted'}>
              {'Rifiuta'}
            </Text>
          </Pressable>
          <Pressable
            className="px-2 py-2"
            android_ripple={{
              color: colors.success,
              foreground: true,
              radius: 32,
              borderless: true,
            }}
            onPress={() => approveRequest(item.id)}>
            <Text variant="label" weight={'bold'} className="text-success">
              {'Accetta'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const Reservation = () => {
  const { colors } = useColorScheme();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    requests,
    loans,
    requestLoan,
    isLoading,
    fetchRequests,
    fetchBooks,
    setIsLoading,
    fetchRequestUsers,
    fetchLoans,
  } = useBiblioStore();

  const tabConfig = {
    0: {
      data: loans,
      emptyIcon: 'library-shelves',
      emptyTitle: 'Nessun prestito in corso',
      renderer: ({ item }: { item: Loan }) => <BookLoanCard item={item} onRemove={() => {}} />,
      refresh: fetchLoans,
    },
    1: {
      data: requests,
      emptyIcon: 'book-arrow-left',
      emptyTitle: 'Nessuna richiesta',
      renderer: ({ item }: { item: Request }) => <RequestCard item={item} />,
      refresh: () => {
        fetchBooks();
        fetchRequests();
        fetchRequestUsers();
      },
    },
  } as any;

  const current = tabConfig[selectedIndex];
  return (
    <View className="flex-1 px-4">
      <FlatList
        ListHeaderComponent={() => (
          <SegmentedControl
            values={['Prestiti', 'Richieste']}
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
              await current.refresh();
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
    </View>
  );
};

export default Reservation;
