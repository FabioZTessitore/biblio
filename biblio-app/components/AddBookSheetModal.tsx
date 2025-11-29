import { useState } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useUserStore, useBiblioStore, useAuthStore, useLibraryStore } from '~/store';
import { Book } from '~/store/biblio';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { TextField } from '~/components/nativewindui/TextField';
import { Button } from '~/components/nativewindui/Button';
import { Toggle } from '~/components/nativewindui/Toggle';
import { SheetModal } from './partials';
import Toast from 'react-native-toast-message';

const AddBookSheetModal = () => {
  const { membership } = useUserStore();
  const { bookModal, setBookModal, addBook } = useBiblioStore();

  const [currentBook, setCurrentBook] = useState<Partial<Book>>({});

  const addBookHandler = () => {
    if (currentBook.title?.trim().length === 0 || currentBook.author?.trim().length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Non hai compilato correttamente i campi!',
        // text2: 'Could not log you in. Please check your credentials or try again later!',
      });
      return;
    }

    // const newBook: Book = {
    //   id: '',
    //   ...currentBook
    // };

    // addBook(newBook);
    setCurrentBook({});
    setBookModal(false);
  };

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
                onChangeText={(currentTitle) => setCurrentBook({ title: currentTitle })}
                value={currentBook.title}
              />
            </FormItem>
            <FormItem>
              <TextField
                type="bottom-sheet"
                placeholder="Autore"
                onChangeText={(currentAuthor) => setCurrentBook({ author: currentAuthor })}
                value={currentBook.author}
              />
            </FormItem>
          </FormSection>

          <FormSection iconProps={{ type: 'MaterialCommunityIcons', name: 'dots-horizontal' }}>
            <FormItem className="flex-row items-center gap-4">
              <Text>Disponibile</Text>
              <TextField
                type="bottom-sheet"
                placeholder="Autore"
                inputMode="numeric"
                onChangeText={(currentAvailable) =>
                  setCurrentBook({ available: Number(currentAvailable) })
                }
                value={String(currentBook.available)}
              />
              {/* <Toggle onValueChange={toggleIsAvailable} value={currentIsAvailable} /> */}
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
