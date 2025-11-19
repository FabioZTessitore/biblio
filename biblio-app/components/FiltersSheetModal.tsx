import { Text, Icon } from '~/components/ui';
import { useState } from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFiltersStore } from '~/store';
import { truncateText } from '~/lib/utils';
import { FlatList, Pressable, View } from 'react-native';
import { SearchInput } from './nativewindui/SearchInput';
import { FilterItem } from '~/store/filters';
import { SheetModal } from '~/components/partials';

const FiltersSheetModal = () => {
  const { filters, filtersModal, setFiltersModal, resetFilters, updateFilterValue } =
    useFiltersStore();

  const [searchText, setSearchText] = useState('');

  const [activeFilter, setActiveFilter] = useState<null | {
    group: string;
    filter: FilterItem;
  }>(null);

  const onClose = () => {
    setSearchText('');
    setActiveFilter(null);
    setFiltersModal(false);
  };

  return (
    <SheetModal visible={filtersModal} onClose={onClose}>
      <BottomSheetView className="flex-1 gap-8 p-4">
        {!activeFilter && (
          <>
            <View className="relative flex-row items-center justify-center py-2">
              {/* Bottone sinistra */}
              <Pressable className="absolute right-0 px-2" onPress={resetFilters}>
                <Text color="primary">Elimina</Text>
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
                      onPress={() => setActiveFilter({ group: section.group, filter })}>
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
                {activeFilter.filter.name}
              </Text>
            </View>

            {/* Contenuto dinamico */}
            {activeFilter.filter.type === 'text' && (
              <View>
                <SearchInput
                  variant="bottom-sheet"
                  containerClassName="bg-background"
                  value={searchText ?? activeFilter.filter.value}
                  onChangeText={(txt) => setSearchText(txt)}
                />
                <FlatList
                  data={[
                    { id: '0', name: searchText },
                    { id: '1', name: 'To' },
                    { id: '2', name: '19' },
                  ]}
                  keyExtractor={(item) => item.id}
                  contentContainerClassName="gap-2 py-8"
                  className="rounded-md"
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return item.name ? (
                      <Pressable
                        className="rounded-xl bg-background p-4"
                        onPress={() => {
                          updateFilterValue(activeFilter.group, activeFilter.filter.id, item.name);
                          setActiveFilter(null);
                        }}>
                        <Text>{item.name}</Text>
                      </Pressable>
                    ) : (
                      <></>
                    );
                  }}
                />
              </View>
            )}

            {activeFilter.filter.type === 'select' && (
              <View className="gap-4">
                {(activeFilter.filter.options ?? []).map((opt: string) => (
                  <Pressable
                    key={opt}
                    className={`rounded-xl p-4 ${
                      activeFilter.filter.value === opt ? 'bg-primary' : 'bg-muted'
                    }`}
                    onPress={() =>
                      updateFilterValue(activeFilter.group, activeFilter.filter.id, opt)
                    }>
                    <Text
                      className={
                        activeFilter.filter.value === opt ? 'text-white' : 'text-foreground'
                      }>
                      {opt}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* {activeFilter.filter.type === 'boolean' && (
              <View className="flex-row items-center justify-between p-4">
                <Text>Valore</Text>
                <Toggle
                  value={!!activeFilter.filter.value}
                  onValueChange={(v) =>
                    updateFilterValue(activeFilter.group, activeFilter.filter.id, v)
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
