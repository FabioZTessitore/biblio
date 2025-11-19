import { Text } from '~/components/Text';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useBookStore, useFiltersStore } from '~/store';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA, truncateText } from '~/lib/utils';
import { Pressable, View } from 'react-native';
import { Icon } from '~/components/Icon';
import { SearchInput } from '../nativewindui/SearchInput';
import { Form, FormItem, FormSection } from '../nativewindui/Form';
import { KeyboardAwareScrollView, KeyboardGestureArea } from 'react-native-keyboard-controller';
import { TextField } from '../nativewindui/TextField';
import { Button } from '../nativewindui/Button';
import { Toggle } from '../nativewindui/Toggle';

const AddBookSheetModal = () => {
  const { colors } = useColorScheme();

  const { bookModal, setBookModal } = useBookStore();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = useCallback((index: number) => {
    // On close
    if (index === -1) {
      setBookModal(false);
    }
  }, []);

  const snapPoints = useMemo(() => ['50%', '75%', '100%'], []);

  useEffect(() => {
    if (bookModal) bottomSheetModalRef.current?.present();
  }, [bookModal]);

  return (
    // TODO: BottomSheetModal to components/ui/SheetModal.tsx
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: colors.foreground, height: 2, width: 40 }}
      containerStyle={{
        backgroundColor: convertToRGBA(colors.background, 0.6),
      }}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: colors.card }}>
      <BottomSheetView className="flex-1 gap-8 p-4">
        <Text variant={'heading'} className="text-center">
          Aggiungi un nuovo libro
        </Text>

        {/* <SearchInput variant="bottom-sheet" containerClassName="bg-background" /> */}

        {/* <KeyboardGestureArea interpolator="ios">
          <KeyboardAwareScrollView
            bottomOffset={8}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"> */}
        <Form className="gap-8 px-4 pt-8">
          <FormSection iconProps={{ type: 'MaterialCommunityIcons', name: 'book' }}>
            <FormItem>
              <TextField
                type="bottom-sheet"
                placeholder="Titolo"
                autoCapitalize="none"
                onChangeText={() => {}}
                secureTextEntry
                value={''}
              />
            </FormItem>
            <FormItem>
              <TextField
                type="bottom-sheet"
                placeholder="Autore"
                autoCapitalize="none"
                onChangeText={() => {}}
                secureTextEntry
                value={''}
              />
            </FormItem>
          </FormSection>

          <FormSection iconProps={{ type: 'MaterialCommunityIcons', name: 'dots-horizontal' }}>
            <FormItem className="flex-row items-center gap-4">
              <Text>Disponibile</Text>
              <Toggle value={true} />
            </FormItem>
            <FormItem></FormItem>
          </FormSection>

          <View className="">
            <Button onPress={() => {}} className="px-6">
              <Text>Salva</Text>
            </Button>
          </View>
        </Form>
        {/* </KeyboardAwareScrollView>
        </KeyboardGestureArea> */}

        {/*
        <Button variant="primary">
          <Text>Salva</Text>
        </Button> */}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export { AddBookSheetModal };
