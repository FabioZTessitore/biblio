import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '~/components/ui';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBiblioStore } from '~/store';
import { Book } from '~/store/biblio';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { TextField } from '~/components/nativewindui/TextField';
import { SheetModal } from './partials';
import Toast from 'react-native-toast-message';
import { TextFieldRef } from './nativewindui/TextField/types';
import { Stepper } from './nativewindui/Stepper';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LayoutAnimationConfig,
  ZoomInEasyUp,
  ZoomOutEasyDown,
} from 'react-native-reanimated';

const FlipCounter = ({ count }: { count: number }) => {
  const id = useId();
  return (
    <View className="overflow-hidden py-1">
      <LayoutAnimationConfig skipEntering>
        <Animated.View
          entering={FadeInUp.duration(120)}
          exiting={FadeOutDown.duration(120)}
          key={`${id}-wrapper-${count}`}>
          <Animated.View
            key={`${id}-inner-${count}`}
            entering={ZoomInEasyUp.duration(120)}
            exiting={ZoomOutEasyDown.duration(120)}>
            <Text className="text-primary">{count}</Text>
          </Animated.View>
        </Animated.View>
      </LayoutAnimationConfig>
    </View>
  );
};

const EMPTY_BOOK: Partial<Book> = {
  title: '',
  author: '',
  isbn: '',
  available: 990,
};

const EditBookSheetModal = ({ bookId }: { bookId: string }) => {
  const { bookEditModal, setBookEditModal, updateBook, books } = useBiblioStore();

  const [currentBook, setCurrentBook] = useState<Partial<Book>>(EMPTY_BOOK);

  const authorFieldRef = useRef<TextFieldRef>(null);
  const isbnFieldRef = useRef<TextFieldRef>(null);

  console.log('bookId', bookId);

  useEffect(() => {
    if (!bookEditModal) return;

    const bookEditing = books.find((b) => b.id === bookId) ?? EMPTY_BOOK;
    setCurrentBook(bookEditing);
  }, [bookEditModal]);

  const onSave = () => {
    if (!currentBook.title || !currentBook.author || !currentBook.isbn) {
      Toast.show({
        type: 'error',
        text1: 'Non hai compilato correttamente i campi!',
      });
      return;
    }

    updateBook(bookId, currentBook);

    setCurrentBook(EMPTY_BOOK);
    setBookEditModal(false);
  };

  const onClose = () => {
    setCurrentBook(EMPTY_BOOK);
    setBookEditModal(false);
  };

  const subtract = () =>
    setCurrentBook((prev) => ({
      ...prev,
      available: Math.max(0, (prev.available ?? 0) - 1),
    }));

  const add = () =>
    setCurrentBook((prev) => ({
      ...prev,
      available: (prev.available ?? 0) + 1,
    }));

  return (
    <SheetModal visible={bookEditModal} onClose={onClose} snapPoints={['75%', '95%']}>
      <BottomSheetView className="flex-1 gap-8 p-4">
        <View className="flex-row items-center justify-between py-2">
          <Pressable className="px-2" onPress={onClose}>
            <Text className="text-destructive">Annulla</Text>
          </Pressable>

          <Text variant="heading">Modifica libro</Text>

          <Pressable className="px-2" onPress={onSave}>
            <Text color="primary">Salva</Text>
          </Pressable>
        </View>

        <Form className="gap-8 px-4 pt-8">
          <FormSection
            iconProps={{ type: 'MaterialCommunityIcons', name: 'book' }}
            className="gap-6">
            <FormItem>
              <TextField
                label="Titolo"
                type="bottom-sheet"
                value={currentBook.title}
                onChangeText={(title) => setCurrentBook((p) => ({ ...p, title }))}
                onSubmitEditing={() => authorFieldRef.current?.focus()}
                returnKeyType="next"
              />
            </FormItem>

            <FormItem>
              <TextField
                ref={authorFieldRef}
                label="Autore"
                type="bottom-sheet"
                value={currentBook.author}
                onChangeText={(author) => setCurrentBook((p) => ({ ...p, author }))}
                onSubmitEditing={() => isbnFieldRef.current?.focus()}
                returnKeyType="next"
              />
            </FormItem>

            <FormItem>
              <TextField
                ref={isbnFieldRef}
                label="Codice ISBN"
                type="bottom-sheet"
                maxLength={13}
                inputMode="numeric"
                value={currentBook.isbn}
                onChangeText={(isbn) => setCurrentBook((p) => ({ ...p, isbn }))}
              />
            </FormItem>
          </FormSection>

          <FormSection iconProps={{ type: 'MaterialCommunityIcons', name: 'book-plus-multiple' }}>
            <FormItem className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Text>Quantità:</Text>
                <FlipCounter count={currentBook.available ?? 0} />
              </View>

              <Stepper
                className="p-2"
                subtractButton={{ disabled: currentBook.available === 0, onPress: subtract }}
                addButton={{ onPress: add }}
              />
            </FormItem>
          </FormSection>
        </Form>
      </BottomSheetView>
    </SheetModal>
  );
};

export { EditBookSheetModal };
