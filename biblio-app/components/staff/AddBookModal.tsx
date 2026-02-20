import { BookSheetModal } from './BookSheetModal';
import { useBiblioStore } from '~/store';

export default function AddBookModal({
  bookIdToEdit,
  setBookToEdit,
}: {
  bookIdToEdit: string;
  setBookToEdit: (id: string) => void;
}) {
  const { bookModal, setBookModal, bookEditModal, setBookEditModal } = useBiblioStore();

  const closeEditModal = () => {
    setBookEditModal(false);
    setBookToEdit('');
  };

  return (
    <>
      <BookSheetModal mode="add" visible={bookModal} onClose={() => setBookModal(false)} />

      <BookSheetModal
        mode="edit"
        visible={bookEditModal}
        bookId={bookIdToEdit}
        onClose={closeEditModal}
      />
    </>
  );
}
