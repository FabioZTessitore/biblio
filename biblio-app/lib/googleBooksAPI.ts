export const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchByIsbn = async (isbn: string) => {
  // Rimuovi eventuali trattini o spazi dall'ISBN
  const cleanIsbn = isbn.replace(/[- ]/g, '');

  const url = `${BASE_URL}?q=isbn:${cleanIsbn}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.totalItems > 0) {
      // Google restituisce un array, prendiamo il primo risultato
      const book = data.items[0].volumeInfo;
      return {
        title: book.title,
        authors: book.authors.join(', '),
      };
    } else {
      console.log('Nessun libro trovato per questo ISBN.');
      return null;
    }
  } catch (error) {
    console.error('Errore durante la ricerca:', error);
  }
};
