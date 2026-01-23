import { useEffect, useRef, useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { Book, useBiblioStore } from '~/store/biblio';
import { SheetModal } from './partials';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Text, FormBlock, FormRow, FormGroup, InputField, Stepper, Icon } from 'components/ui';
import { FlipCounter } from '~/components/partials';
import { Button } from './nativewindui/Button';
import { searchByIsbn } from '~/lib/googleBooksAPI';

const EMPTY_BOOK: Partial<Book> = {
  title: '',
  author: '',
  isbn: '',
  available: 0,
  quantity: 0,
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

  const authorRef = useRef<any>(null);
  const isbnRef = useRef<any>(null);

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

    if (isEdit && bookId) {
      // Modifica libro
      const oldBook = books.find((b) => b.id === bookId);
      if (!oldBook) return;

      const loansActive = (oldBook.quantity ?? 0) - (oldBook.available ?? 0);
      const newQuantity = currentBook.quantity ?? 0;

      if (newQuantity < loansActive) {
        Toast.show({
          type: 'error',
          text1: 'Non puoi impostare la quantità totale inferiore ai libri già prestati',
        });
        return;
      }

      updateBook(bookId, {
        ...currentBook,
        quantity: newQuantity,
        available: newQuantity - loansActive,
      });
    } else {
      // Nuovo libro
      const qty = currentBook.quantity ?? 0;
      addBook({
        ...currentBook,
        quantity: qty,
        available: qty,
      });
    }

    onClose();
  };

  const subtract = () =>
    setCurrentBook((p) => ({ ...p, quantity: Math.max(0, (p.quantity ?? 0) - 1) }));

  const add = () => setCurrentBook((p) => ({ ...p, quantity: (p.quantity ?? 0) + 1 }));

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
        console.error('Errore durante la ricerca del libro con isbn: ', isbn);
        Toast.show({
          type: 'error',
          text1: 'Non è stato possibile trovare il libro con questo ISBN',
          text2: 'Per favore inseriscilo a mano.',
        });
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
        <FormBlock className="gap-8 px-4 pt-8">
          <FormGroup icon={{ type: 'MaterialCommunityIcons', name: 'book' }} className="gap-6">
            <FormRow>
              <InputField
                label="Titolo"
                sheet={true}
                value={currentBook.title}
                onChangeText={(title) => setCurrentBook((p) => ({ ...p, title }))}
                onSubmitEditing={() => authorRef.current?.focus()}
                returnKeyType="next"
                submitBehavior={'submit'}
              />
            </FormRow>
            <FormRow>
              <InputField
                ref={authorRef}
                label="Autore"
                sheet={true}
                value={currentBook.author}
                onChangeText={(author) => setCurrentBook((p) => ({ ...p, author }))}
                onSubmitEditing={() => isbnRef.current?.focus()}
                returnKeyType="next"
                submitBehavior={'submit'}
              />
            </FormRow>
            <FormRow>
              <InputField
                ref={isbnRef}
                label="Codice ISBN"
                sheet={true}
                maxLength={13}
                inputMode="numeric"
                value={currentBook.isbn}
                onChangeText={(isbn) => setCurrentBook((p) => ({ ...p, isbn }))}
              />
            </FormRow>
          </FormGroup>

          <FormGroup icon={{ type: 'MaterialCommunityIcons', name: 'book-plus-multiple' }}>
            <FormRow className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Text>Quantità:</Text>
                <FlipCounter count={currentBook.quantity ?? 0} />
              </View>

              <Stepper
                className="p-2"
                minusButton={{ disabled: (currentBook.quantity ?? 0) === 0, onPress: subtract }}
                plusButton={{ onPress: add }}
              />
            </FormRow>
            {mode === 'edit' && (
              <Text color={'muted'} variant={'label'}>
                Attualmente disponibili: {currentBook.available}
              </Text>
            )}
          </FormGroup>

          <Button
            android_ripple={{ foreground: true, color: '#ffffff30' }}
            onPress={requestCamera}
            className="bg-secondary">
            <Icon size="body" type="MaterialCommunityIcons" name="line-scan" />
            <Text>Scansiona</Text>
          </Button>
        </FormBlock>

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
