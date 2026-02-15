import { Text, Icon, SearchField } from '~/components/ui';
import { useState, useEffect, useRef } from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBiblioStore, useFiltersStore } from '~/store';
import { truncateText } from '~/lib/utils';
import { FlatList, Pressable, View } from 'react-native';
import { SheetModal } from '~/components/partials';
import { Book } from '~/store/biblio';

const FiltersSheetModal = () => {
  const { books } = useBiblioStore();

  const {
    filters,
    filtersModal,
    setFiltersModal,
    resetFilters,
    updateFilterValue,
    getFilterItem,
    applyFilters,
  } = useFiltersStore();

  const [searchText, setSearchText] = useState('');

  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const [activeFilter, setActiveFilter] = useState<null | {
    group: string;
    filterId: string;
  }>(null);

  const onClose = () => {
    setSearchText('');
    setActiveFilter(null);
    setFiltersModal(false);
    setFilteredBooks(books);
  };

  const currentFilter = getFilterItem(activeFilter?.group ?? '', activeFilter?.filterId ?? '');

  const justSyncedRef = useRef(false);

  useEffect(() => {
    if (activeFilter && currentFilter) {
      // Evitiamo che l'effetto che osserva `searchText` interpreti
      // il valore inizializzato come un'azione dell'utente.
      justSyncedRef.current = true;
      setSearchText(currentFilter.value ?? '');
    }

    if (!activeFilter) {
      setSearchText('');
    }
  }, [activeFilter, currentFilter]);

  // Se l'utente svuota l'input (premendo la 'x' o cancellando),
  // aggiorniamo anche lo store per azzerare il valore del filtro corrente.
  useEffect(() => {
    if (!activeFilter || !currentFilter) return;

    // Se abbiamo appena sincronizzato `searchText` dall'apertura del filtro,
    // ignoriamo questa esecuzione (evitiamo il clear immediato).
    if (justSyncedRef.current) {
      justSyncedRef.current = false;
      return;
    }

    if (currentFilter.type === 'text' && searchText === '' && currentFilter.value !== '') {
      updateFilterValue(activeFilter.group, currentFilter.id, '');
    }
  }, [searchText, activeFilter, currentFilter, updateFilterValue]);

  useEffect(() => {
    if (!activeFilter) {
      setSearchText('');
      setFilteredBooks(books);
    }
  }, [activeFilter, books]);

  const searchHandler = (text: string) => {
    setSearchText(text);

    if (!activeFilter || !currentFilter) return;

    const tempFilters = filters.map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item.id === currentFilter.id && section.group === activeFilter.group
          ? { ...item, value: text }
          : item
      ),
    }));

    const result = applyFilters(books, tempFilters);
    setFilteredBooks(result);
  };

  return (
    <SheetModal visible={filtersModal} onClose={onClose} snapPoints={['75%', '95%']}>
      <BottomSheetView className="flex-1 gap-8 p-4">
        {!activeFilter && (
          <>
            <View className="relative flex-row items-center justify-center py-2">
              {/* Pulsante a destra */}
              <Pressable className="absolute right-0 px-2" onPress={resetFilters}>
                <Text color="primary">Ripristina</Text>
              </Pressable>

              {/* Titolo al centro */}
              <Text variant="heading" className="text-center">
                Filtri
              </Text>
            </View>

            <View className="gap-8">
              {filters.map((section) => (
                <View key={section.group} className="overflow-hidden rounded-2xl bg-background">
                  {section.items.map((filter, idx) => (
                    <Pressable
                      key={filter.id}
                      onPress={() =>
                        setActiveFilter({ group: section.group, filterId: filter.id })
                      }>
                      {idx !== 0 && <View className="mx-4 h-px bg-border" />}

                      <View className="flex-row items-center justify-between p-4">
                        <Text variant="body">{filter.name}</Text>

                        <View className="flex-row items-center gap-2">
                          <Text variant="label" color="muted">
                            {truncateText(filter.value, 28)}
                          </Text>
                          <Icon type="MaterialCommunityIcons" name="chevron-right" />
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>
          </>
        )}

        {activeFilter && (
          <View className="gap-8">
            {/* Header con indietro */}
            <View className="relative flex-row items-center justify-center py-2">
              {/* Bottone sinistra */}
              <Pressable className="absolute left-0 px-2" onPress={() => setActiveFilter(null)}>
                <Text color="primary">Indietro</Text>
              </Pressable>

              {/* Titolo al centro */}
              <Text variant="heading" className="text-center">
                {currentFilter?.name ?? ''}
              </Text>

              {/* <Pressable className="absolute right-0 px-2" onPress={resetFilters}>
                <Text color="primary">Ripristina</Text>
              </Pressable> */}
            </View>

            {/* Contenuto dinamico */}
            {currentFilter?.type === 'text' && (
              <View>
                <SearchField
                  sheet={true}
                  rootClassName="bg-background"
                  value={searchText !== '' ? searchText : (currentFilter?.value ?? '')}
                  onChangeText={(txt) => searchHandler(txt)}
                />
                <FlatList
                  data={filteredBooks.slice(0, 10)} // Mostra i primi 10 risultati
                  keyExtractor={(item) => item.id}
                  contentContainerClassName="gap-2 py-8"
                  className="rounded-md"
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const field = activeFilter.filterId as 'title' | 'author';

                    return item ? (
                      <Pressable
                        className="rounded-xl bg-background p-4"
                        onPress={() => {
                          updateFilterValue(activeFilter.group, currentFilter.id, item[field]);
                          setActiveFilter(null);
                        }}>
                        <Text>{item[field]}</Text>
                      </Pressable>
                    ) : (
                      <></>
                    );
                  }}
                  ListEmptyComponent={
                    <Text className="mt-4 text-center">
                      La ricerca non ha prodotto alcun risultato...
                    </Text>
                  }
                />
              </View>
            )}

            {currentFilter?.type === 'select' && (
              <View className="gap-4">
                <FlatList
                  data={currentFilter?.options}
                  keyExtractor={(item) => item}
                  contentContainerClassName="gap-2 py-8"
                  className="rounded-md"
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return (
                      <Pressable
                        key={item}
                        className={`rounded-xl p-4 ${
                          currentFilter?.value === item ? 'bg-primary' : 'bg-background'
                        }`}
                        onPress={() => {
                          updateFilterValue(activeFilter.group, currentFilter?.id ?? '', item);
                          setActiveFilter(null);
                        }}>
                        <Text
                          className={
                            currentFilter?.value === item ? 'text-white' : 'text-foreground'
                          }>
                          {item}
                        </Text>
                      </Pressable>
                    );
                  }}
                />
              </View>
            )}

            {/* {currentFilter.type === 'boolean' && (
              <View className="flex-row items-center justify-between p-4">
                <Text>Valore</Text>
                <Toggle
                  value={!!currentFilter.value}
                  onValueChange={(v) =>
                    updateFilterValue(activeFilter.group, currentFilter.id, v)
                  }
                />
              </View>
            )} */}
          </View>
        )}
      </BottomSheetView>
    </SheetModal>
  );
};

export { FiltersSheetModal };
