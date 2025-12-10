import { useId, useRef, useState } from 'react';
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

const AddBookSheetModal = () => {
  const { bookModal, setBookModal, addBook } = useBiblioStore();

  const [currentBook, setCurrentBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    available: 0,
  });

  const authorFieldRef = useRef<TextFieldRef>(null);
  const isbnFieldRef = useRef<TextFieldRef>(null);

  const onSave = () => {
    if (!currentBook.title || !currentBook.author || !currentBook.isbn) {
      Toast.show({
        type: 'error',
        text1: 'Non hai compilato correttamente i campi!',
      });
      return;
    }

    addBook(currentBook);

    setCurrentBook({});
    setBookModal(false);
  };

  const onClose = () => {
    setBookModal(false);
  };

  const subtract = () => {
    setCurrentBook({
      ...currentBook,
      available: (currentBook.available as number) - 1,
    });
  };
  const add = () => {
    setCurrentBook({
      ...currentBook,
      available: (currentBook.available as number) + 1,
    });
  };

  return (
    <SheetModal visible={bookModal} onClose={onClose} snapPoints={['75%', '95%']}>
      <BottomSheetView className="flex-1 gap-8 p-4">
        <View className="flex-row items-center justify-between py-2">
          <Pressable className="px-2" onPress={onClose}>
            <Text className="text-destructive">Annulla</Text>
          </Pressable>

          <Text variant="heading">{false ? 'Modifica libro' : 'Nuovo libro'}</Text>

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
                onSubmitEditing={() => {
                  authorFieldRef?.current?.focus();
                }}
                onChangeText={(title) => setCurrentBook({ ...currentBook, title })}
                value={currentBook.title}
                returnKeyType="next"
                submitBehavior={'submit'}
              />
            </FormItem>
            <FormItem>
              <TextField
                ref={authorFieldRef}
                type="bottom-sheet"
                label="Autore"
                onSubmitEditing={() => {
                  isbnFieldRef?.current?.focus();
                }}
                onChangeText={(author) => setCurrentBook({ ...currentBook, author })}
                value={currentBook.author}
                returnKeyType="next"
                submitBehavior={'submit'}
              />
            </FormItem>
            <FormItem>
              <TextField
                ref={isbnFieldRef}
                maxLength={13}
                type="bottom-sheet"
                label="Codice ISBN"
                inputMode="numeric"
                onChangeText={(isbn) => setCurrentBook({ ...currentBook, isbn })}
                value={currentBook.isbn}
              />
            </FormItem>
          </FormSection>

          <FormSection iconProps={{ type: 'MaterialCommunityIcons', name: 'book-plus-multiple' }}>
            <FormItem className="flex-row items-center justify-between">
              <View className="flex-row items-center justify-between gap-2">
                <Text>Quantità:</Text>
                <FlipCounter count={currentBook.available ?? 0} />
              </View>
              <Stepper
                className="p-2"
                subtractButton={{ disabled: currentBook.available === 0, onPress: subtract }}
                addButton={{ onPress: add }}
              />
            </FormItem>
            <FormItem></FormItem>
          </FormSection>
        </Form>
      </BottomSheetView>
    </SheetModal>
  );
};

export { AddBookSheetModal };
