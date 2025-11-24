import { useState } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useUserStore, useBookStore } from '~/store';
import { Book } from '~/store/book';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { TextField } from '~/components/nativewindui/TextField';
import { Button } from '~/components/nativewindui/Button';
import { Toggle } from '~/components/nativewindui/Toggle';
import { SheetModal } from './partials';
import Toast from 'react-native-toast-message';

const AddBookSheetModal = () => {
  const { uid, profile, addBookToLibrary } = useUserStore();
  const { bookModal, setBookModal } = useBookStore();

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
    setCurrentAuthor('');
    setCurrentTitle('');
    setCurrentIsAvailable(true);
    setBookModal(false);
  };

  const toggleIsAvailable = () => setCurrentIsAvailable((previousState) => !previousState);

  const onClose = () => {
    setBookModal(false);
  };

  return (
    // TODO: BottomSheetModal to components/ui/SheetModal.tsx
    <SheetModal visible={bookModal} onClose={onClose}>
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
    </SheetModal>
  );
};

export { AddBookSheetModal };
