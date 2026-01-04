import { View, FlatList, Image, Pressable, RefreshControl } from 'react-native';
import { Text, ToggleGroup } from '~/components/ui';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { convertToRGBA, formatDate, truncateText } from '~/lib/utils';
import { useColorScheme } from '~/lib/useColorScheme';
import { useBiblioStore } from '~/store';
import { Loan, Request } from '~/store/biblio';
import { EmptyState } from '~/components/partials';
import { Button } from '~/components/nativewindui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from 'firebase/firestore';
import { cn } from '~/lib/cn';

const SetDueDate = ({ loanId }: { loanId: string }) => {
  const updateLoan = useBiblioStore((s) => s.updateLoan);
  const loan = useBiblioStore((s) => s.loans.find((l) => l.id === loanId));
  const { colors } = useColorScheme();

  const [isVisible, setIsVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date | null>(null);

  if (!loan) return null;

  const isReturned = !!loan.returnedAt;
  const hasDueDate = !!loan.dueDate;

  if (isReturned && !hasDueDate) {
    return null;
  }

  const today = Timestamp.now().toDate();

  const currentDate = loan.dueDate?.toDate();

  const openPicker = () => {
    // inizializzi SOLO quando apri
    setPickerDate(currentDate ?? today);
    setIsVisible(true);
  };

  const onChange = (event: any, date?: Date) => {
    setIsVisible(false);

    // ANDROID: annulla
    if (event?.type === 'dismissed' || !date) {
      setPickerDate(null);
      return;
    }

    if (event?.type === 'neutralButtonPressed') {
      updateLoan(loanId, {
        dueDate: null,
      });
      setPickerDate(null);
      return;
    }

    updateLoan(loanId, {
      dueDate: Timestamp.fromDate(date),
    });

    setPickerDate(null);
  };

  const label =
    hasDueDate && currentDate ? `Scadenza: ${formatDate(currentDate)}` : 'Imposta scadenza';

  const isEditable = !isReturned;

  return (
    <View>
      <Pressable onPress={openPicker} disabled={!isEditable}>
        <Text
          className={cn(isEditable && 'underline')}
          color={isEditable ? 'primary' : 'muted'}
          variant="label">
          {label}
        </Text>
      </Pressable>

      {isEditable && isVisible && pickerDate && (
        <DateTimePicker
          value={pickerDate}
          minimumDate={today}
          mode="date"
          display="default"
          neutralButton={
            loan.dueDate ? { label: 'Cancella', textColor: colors.destructive } : undefined
          }
          onChange={onChange}
        />
      )}
    </View>
  );
};

const LoanCard = ({ item }: { item: Loan }) => {
  const { books, loanUsers, markReturned } = useBiblioStore();

  const user = loanUsers[item.userId];
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
            <Text variant={'label'}>{`${user.name} ${user.surname} ${user.grade}`}</Text>
            <Text color={'muted'} variant={'label'}>
              {`Prestato il ${formatDate(item.startDate.toDate())}`}
            </Text>

            <SetDueDate loanId={item.id} />

            {item.returnedAt && (
              <Text color={'muted'} variant={'label'}>
                {`Restituito il ${formatDate(item.returnedAt.toDate())}`}
              </Text>
            )}
          </View>
        </View>
      </View>

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
  );
};

const RequestCard = ({ item }: { item: Request }) => {
  const { books, rejectRequest, requestUsers, approveRequest } = useBiblioStore();
  const { colors } = useColorScheme();

  const user = requestUsers[item.userId];

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
          <Text variant={'label'}>{`${user.name} ${user.surname} ${user.grade}`}</Text>
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

  const { requests, loans, isLoading, fetchRequestUsers, fetchLoanUsers } = useBiblioStore();

  const [tab, setTab] = useState<'prestiti' | 'richieste'>('prestiti');

  const tabConfig = {
    prestiti: {
      data: loans,
      emptyIcon: 'book-clock',
      emptyTitle: 'Nessun prestito in corso',
      renderer: ({ item }: { item: Loan }) => <LoanCard item={item} />,
    },
    richieste: {
      data: requests,
      emptyIcon: 'book-arrow-left',
      emptyTitle: 'Nessuna richiesta',
      renderer: ({ item }: { item: Request }) => <RequestCard item={item} />,
    },
  } as any;

  const current = tabConfig[tab];

  useEffect(() => {
    if (!loans.length) return;
    fetchLoanUsers();
  }, [loans]);

  useEffect(() => {
    if (!requests.length) return;
    fetchRequestUsers();
  }, [requests]);

  return (
    <View className="flex-1 px-4">
      <FlatList
        ListHeaderComponent={() => (
          <ToggleGroup
            value={tab}
            onChange={(value) => setTab(value as 'prestiti' | 'richieste')}
            items={[
              { label: 'Prestiti', value: 'prestiti' },
              { label: 'Richieste', value: 'richieste' },
            ]}
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
            enabled={false}
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
