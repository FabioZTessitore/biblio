import { BookSheetModal } from './BookSheetModal';
import { useState } from 'react';
import { useBiblioStore } from '~/store';

export default function AddBookModal() {
  const { bookModal, setBookModal, bookEditModal, setBookEditModal } = useBiblioStore();
  const [bookIdToEdit, setBookIdToEdit] = useState('');

  return (
    <>
      <BookSheetModal mode="add" visible={bookModal} onClose={() => setBookModal(false)} />

      <BookSheetModal
        mode="edit"
        visible={bookEditModal}
        bookId={bookIdToEdit}
        onClose={() => setBookEditModal(false)}
      />
    </>
  );
}
