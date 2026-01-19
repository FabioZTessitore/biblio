import { useEffect, useRef, useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

import { Book, useBiblioStore } from '~/store/biblio';
import { TextFieldRef } from './nativewindui/TextField/types';
import { SheetModal } from './partials';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Form, FormItem, FormSection } from './nativewindui/Form';
import { TextField } from './nativewindui/TextField';
import { Stepper } from './nativewindui/Stepper';
import { Icon, Text } from '~/components/ui';
import { FlipCounter } from '~/components/partials';
import { Button } from './nativewindui/Button';
import { searchByIsbn } from '~/lib/googleBooksAPI';

const EMPTY_BOOK: Partial<Book> = {
  title: '',
  author: '',
  isbn: '',
  available: 0,
};

interface Props {
  mode: 'add' | 'edit';
  visible: boolean;
  bookId?: string;
  onClose: () => void;
}

export function BookSheetModal({ mode, visible, bookId, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);

  const { addBook, updateBook, books } = useBiblioStore();
  const [currentBook, setCurrentBook] = useState<Partial<Book>>(EMPTY_BOOK);

  const authorRef = useRef<TextFieldRef>(null);
  const isbnRef = useRef<TextFieldRef>(null);

  const isEdit = mode === 'edit';

  // Carica dati quando il modal si apre
  useEffect(() => {
    if (!visible) return;

    if (isEdit && bookId) {
      const b = books.find((x) => x.id === bookId) ?? EMPTY_BOOK;
      setCurrentBook(b);
    } else {
      setCurrentBook(EMPTY_BOOK);
    }
  }, [visible]);

  const onSave = () => {
    if (!currentBook.title || !currentBook.author || !currentBook.isbn) {
      Toast.show({ type: 'error', text1: 'Compila tutti i campi.' });
      return;
    }

    if (isEdit && bookId) updateBook(bookId, currentBook);
    else addBook(currentBook);

    onClose();
  };

  const subtract = () =>
    setCurrentBook((p) => ({ ...p, available: Math.max(0, (p.available ?? 0) - 1) }));

  const add = () => setCurrentBook((p) => ({ ...p, available: (p.available ?? 0) + 1 }));

  // --- Apertura camera ---
  const requestCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Toast.show({ type: 'error', text1: 'Permesso fotocamera negato' });
        return;
      }
    }
    setShowCamera(true);
  };

  const onBarcodeScanned = async (isbn: string) => {
    if (!isbn) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const book = await searchByIsbn(isbn);
      if (book) {
        console.log('Libro trovato: ', book);
        setCurrentBook((p) => ({
          ...p,
          title: book.title,
          author: book.authors,
          isbn,
          available: 1,
        }));
      } else {
        console.log('ciaooo');
      }
    } catch (error) {
      console.error('Errore durante la ricerca del libro:', error);
      Toast.show({
        type: 'error',
        text1: 'Errore durante la ricerca del libro',
        text2: 'Per favore inseriscilo a mano.',
      });
    }
    setShowCamera(false);
  };

  return (
    <SheetModal visible={visible} onClose={onClose} snapPoints={['75%', '95%']}>
      <BottomSheetView className="flex-1 gap-8 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-2">
          <Pressable onPress={onClose} className="px-2">
            <Text className="text-destructive">Annulla</Text>
          </Pressable>
          <Text variant="heading">{isEdit ? 'Modifica libro' : 'Nuovo libro'}</Text>
          <Pressable onPress={onSave} className="px-2">
            <Text color="primary">Salva</Text>
          </Pressable>
        </View>

        {/* Form */}
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
                onSubmitEditing={() => authorRef.current?.focus()}
              />
            </FormItem>
            <FormItem>
              <TextField
                ref={authorRef}
                label="Autore"
                type="bottom-sheet"
                value={currentBook.author}
                onChangeText={(author) => setCurrentBook((p) => ({ ...p, author }))}
                onSubmitEditing={() => isbnRef.current?.focus()}
              />
            </FormItem>
            <FormItem>
              <TextField
                ref={isbnRef}
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
                subtractButton={{ disabled: (currentBook.available ?? 0) === 0, onPress: subtract }}
                addButton={{ onPress: add }}
              />
            </FormItem>
          </FormSection>

          <Button
            android_ripple={{ foreground: true, color: '#ffffff30' }}
            onPress={requestCamera}
            className="bg-secondary">
            <Icon size="body" type="MaterialCommunityIcons" name="line-scan" />
            <Text>Scansiona</Text>
          </Button>
        </Form>

        {/* --- CAMERA OVERLAY --- */}
        {showCamera && (
          <View style={StyleSheet.absoluteFill} className="z-50 bg-black">
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8'] }}
              onBarcodeScanned={({ data }) => onBarcodeScanned(data)}
            />

            <Pressable
              onPress={() => setShowCamera(false)}
              style={{
                position: 'absolute',
                top: 50,
                left: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 8,
              }}>
              <Text className="text-white">Chiudi</Text>
            </Pressable>
          </View>
        )}
      </BottomSheetView>
    </SheetModal>
  );
}
