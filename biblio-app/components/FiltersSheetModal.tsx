import { Text } from './Text';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useFiltersStore } from '~/store';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA } from '~/lib/utils';
import { SearchInput } from './nativewindui/SearchInput';
import { Pressable, View } from 'react-native';
import { Icon } from './Icon';
import { Filter } from '~/store/filters';
import { cn } from '~/lib/cn';

const FiltersSheetModal = () => {
  const { filters, filtersModal, setFiltersModal } = useFiltersStore();
  const { colors } = useColorScheme();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = useCallback((index: number) => {
    // On close
    if (index === -1) {
      setFiltersModal(false);
    }
  }, []);

  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  useEffect(() => {
    if (filtersModal) bottomSheetModalRef.current?.present();
  }, [filtersModal]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: colors.foreground, height: 2, width: 40 }}
      containerStyle={{
        backgroundColor: convertToRGBA(colors.background, 0.6),
      }}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: colors.card }}>
      <BottomSheetView className="flex-1 gap-8 p-4">
        <Text variant={'heading'} className="text-center">
          Filtri
        </Text>

        {/* <SearchInput variant="bottom-sheet" containerClassName="bg-background" /> */}

        <View className="gap-8">
          {filters.map((section) => (
            <View key={section.group} className="overflow-hidden rounded-2xl bg-background">
              {section.items.map((filter, idx) => (
                <Pressable key={filter.id} onPress={() => console.log(filter, section.group)}>
                  {idx !== 0 && (
                    <View className="mx-4 h-px bg-border" /> // separatore corto
                  )}

                  <View className="flex-row items-center justify-between p-4">
                    <Text variant="body">{filter.name}</Text>

                    <View className="flex-row items-center gap-2">
                      <Text variant="label" color="muted">
                        {filter.value}
                      </Text>
                      <Icon type="MaterialCommunityIcons" name="chevron-right" />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { FiltersSheetModal };
