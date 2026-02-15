import { FlatList, View, Alert, RefreshControl } from 'react-native';
import { Text, BaseCard, ToggleGroup } from '~/components/ui';
import { EmptyState } from '~/components/partials';
import { Book, Request, useBiblioStore } from '~/store/biblio';
import { useLibraryStore } from '~/store';
import { Button } from '~/components/nativewindui/Button';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA, truncateText } from '~/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useTranslation } from 'react-i18next';

/* ------------------------------------------
   CARD LIBRERIA (usa BaseCard)
------------------------------------------- */
const BookLibraryCard = ({ item, onRemove }: { item: Book; onRemove: () => void }) => {
  const { t } = useTranslation();

  const { colors } = useColorScheme();

  return (
    <BaseCard
      title={item.title}
      subtitle={item.author}
      isbn={item.isbn}
      statusColor={item.available ? colors.success : colors.destructive}
      statusLabel={item.available ? t('card.available') : t('card.notavailable')}
      actionLabel={t('card.remove')}
      onPress={onRemove}
    />
  );
};

/* ------------------------------------------
   CARD RICHIESTE (usa BaseCard)
------------------------------------------- */
const RequestCard = ({ item }: { item: Request }) => {
  const { t } = useTranslation();

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
      isbn={book.isbn}
      statusColor={color}
      statusLabel={label}
      actionLabel={t('library.cancel')}
      onPress={() => cancelRequest(item.id)}
    />
  );
};

/* ------------------------------------------
   LIBRERIA
------------------------------------------- */
const Library = () => {
  const { t } = useTranslation();
  const { colors } = useColorScheme();

  const { library, removeFromLibrary } = useLibraryStore();
  const { requests, requestLoan, isLoading } = useBiblioStore();

  const shoppingcart_str = t('top_tabs.shoppingcart');
  const borrow_str = t('top_tabs.borrow');
  const [tab, setTab] = useState<shoppingcart_str | borrow_str>(shoppingcart_str);

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
    [shoppingcart_str]: {
      data: library,
      emptyIcon: 'library-shelves',
      emptyTitle: t('library.title_null'),
      renderer: ({ item }: { item: Book }) => (
        <BookLibraryCard item={item} onRemove={() => removeFromLibrary(item.id)} />
      ),
    },
    [borrow_str]: {
      data: requests.sort((a, b) => order[a.status] - order[b.status]),
      emptyIcon: 'book-arrow-left',
      emptyTitle: t('borrow.title_null'),
      renderer: ({ item }: { item: Request }) => <RequestCard item={item} />,
    },
  } as any;

  const current = tabConfig[tab];

  return (
    <View className="flex-1 px-4">
      <FlatList
        ListHeaderComponent={() => (
          <ToggleGroup
            value={tab}
            onChange={(value) => setTab(value as shoppingcart_str | borrow_str)}
            items={[
              { label: shoppingcart_str, value: shoppingcart_str },
              { label: borrow_str, value: borrow_str },
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
            subtitle={t('library.title_null_sub')}
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

      {tab === shoppingcart_str && library.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-transparent/60 p-6">
          <Button disabled={isLoading} className="py-4" onPress={loanRequest}>
            {isLoading ? <ActivityIndicator /> : <Text>{t('library.borrow')}</Text>}
          </Button>
        </View>
      )}
    </View>
  );
};

export default Library;
