import { Text } from '~/components/ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useBookStore } from '~/store';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA } from '~/lib/utils';
import { View } from 'react-native';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { TextField } from '~/components/nativewindui/TextField';
import { Button } from '~/components/nativewindui/Button';
import { Toggle } from '~/components/nativewindui/Toggle';
import Toast from 'react-native-toast-message';
import { Book } from '~/store/book';
import { useUserStore } from '~/store/user';

const AddBookSheetModal = () => {
  const { uid, profile, addBookToLibrary } = useUserStore();
  const { colors } = useColorScheme();
  const { bookModal, setBookModal } = useBookStore();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [currentTitle, setCurrentTitle] = useState('');
  const [currentAuthor, setCurrentAuthor] = useState('');
  const [currentIsAvailable, setCurrentIsAvailable] = useState(true);

  const addBookHandler = () => {
    if (currentTitle.trim().length === 0 || currentAuthor.trim().length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Non hai compilato correttamente i campi!',
        // text2: 'Could not log you in. Please check your credentials or try again later!',
      });
      return;
    }
    console.log('in book', profile);

    const newBook: Book = {
      id: '',
      title: currentTitle,
      author: currentAuthor,
      available: currentIsAvailable,
      schoolId: profile?.schoolsId[0] || '',
      bibliotecarioId: uid!,
    };

    addBookToLibrary(newBook);
    setBookModal(false);
  };

  const toggleIsAvailable = () => setCurrentIsAvailable((previousState) => !previousState);

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
                onChangeText={(currentTitle) => setCurrentTitle(currentTitle)}
                value={currentTitle}
              />
            </FormItem>
            <FormItem>
              <TextField
                type="bottom-sheet"
                placeholder="Autore"
                onChangeText={(currentAuthor) => setCurrentAuthor(currentAuthor)}
                value={currentAuthor}
              />
            </FormItem>
          </FormSection>

          <FormSection iconProps={{ type: 'MaterialCommunityIcons', name: 'dots-horizontal' }}>
            <FormItem className="flex-row items-center gap-4">
              <Text>Disponibile</Text>
              <Toggle onValueChange={toggleIsAvailable} value={currentIsAvailable} />
            </FormItem>
            <FormItem></FormItem>
          </FormSection>

          <View className="">
            <Button onPress={addBookHandler} className="px-6">
              <Text>Salva</Text>
            </Button>
          </View>

          <View className="">
            <Button onPress={() => setBookModal(false)} className="px-6">
              <Text>Annulla</Text>
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
