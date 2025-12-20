import { View, FlatList, Image, Pressable, RefreshControl } from 'react-native';
import { Text } from '~/components/ui';
import { useState } from 'react';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { LinearGradient } from 'expo-linear-gradient';
import { convertToRGBA, formatDate, truncateText } from '~/lib/utils';
import { useColorScheme } from '~/lib/useColorScheme';
import { useBiblioStore } from '~/store';
import { Loan, Request } from '~/store/biblio';
import { EmptyState } from '~/components/partials';
import { Button } from '~/components/nativewindui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from 'firebase/firestore';

const SetDueDate = ({ loanId }: { loanId: string }) => {
  const updateLoan = useBiblioStore((s) => s.updateLoan);
  const loan = useBiblioStore((s) => s.loans.find((l) => l.id === loanId));

  const [isVisible, setIsVisible] = useState(false);

  if (!loan) return null;

  const currentDate = loan.dueDate?.toDate?.() ?? new Date();

  const onConfirm = (_: any, date?: Date) => {
    setIsVisible(false);
    if (!date) return;

    updateLoan(loanId, {
      dueDate: Timestamp.fromDate(date),
    });
  };

  return (
    <View>
      <Pressable onPress={() => setIsVisible(true)}>
        <Text className="underline" color="primary" variant="label">
          {loan.dueDate ? `Scadenza: ${currentDate.toLocaleDateString()}` : 'Imposta scadenza'}
        </Text>
      </Pressable>

      {isVisible && (
        <DateTimePicker value={currentDate} mode="date" display="default" onChange={onConfirm} />
      )}
    </View>
  );
};

const BookLoanCard = ({ item }: { item: Loan }) => {
  const { books, loanUsers, markReturned } = useBiblioStore();

  const user = loanUsers.find((u) => u.uid === item.userId);

  if (!user) return null;

  const book = books.find((b) => b.id === item.bookId);
  if (!book) return null;

  return (
    <View className="gap-6 rounded-lg bg-card p-4 shadow-md">
      <View className="flex-row justify-between gap-8">
        <Image
          resizeMode="cover"
          resizeMethod="resize"
          className="h-36 w-28 rounded-2xl"
          source={{ uri: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` }}
        />

        <View className="items-end justify-between gap-8">
          <View className="items-end gap-2">
            <Text>{truncateText(book.title, 20)}</Text>
            <Text variant={'label'}>{`${user.name} ${user.surname} 2Gi`}</Text>
            <Text color={'muted'} variant={'label'}>
              {`Prestato il ${formatDate(item.startDate)}`}
            </Text>

            {!item.returnedAt && <SetDueDate loanId={item.id} />}

            {item.returnedAt && (
              <Text color={'muted'} variant={'label'}>
                {`Restituito il ${formatDate(item.returnedAt)}`}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-1">
        {item.returnedAt ? (
          <View className="items-end">
            <Text variant="label" weight={'bold'} className="text-success">
              {'Restituito'}
            </Text>
          </View>
        ) : (
          <Button className="bg-secondary" size={'md'} onPress={() => markReturned(item.id)}>
            <Text variant="label">{'Segna come restituito'}</Text>
          </Button>
        )}
      </View>
    </View>
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

      <View className="items-end justify-between gap-4">
        <View className="items-end gap-2">
          <Text>{truncateText(book.title, 20)}</Text>
          <Text variant={'label'}>{`${user.name} ${user.surname} 2Gi`}</Text>
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
    fetchLoanUsers,
    fetchLoans,
  } = useBiblioStore();

  const tabConfig = {
    0: {
      data: loans,
      emptyIcon: 'book-clock',
      emptyTitle: 'Nessun prestito in corso',
      renderer: ({ item }: { item: Loan }) => <BookLoanCard item={item} />,
      refresh: async () => {
        fetchBooks();
        await fetchLoans();
        await fetchLoanUsers();
      },
    },
    1: {
      data: requests,
      emptyIcon: 'book-arrow-left',
      emptyTitle: 'Nessuna richiesta',
      renderer: ({ item }: { item: Request }) => <RequestCard item={item} />,
      refresh: async () => {
        fetchBooks();
        await fetchRequests();
        await fetchRequestUsers();
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
