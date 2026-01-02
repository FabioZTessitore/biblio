import { collection, documentId, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from './firebase';

export function convertToRGBA(rgb: string, opacity: number): string {
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length !== 3) {
    throw new Error('Invalid RGB color format');
  }
  const red = parseInt(rgbValues[0], 10);
  const green = parseInt(rgbValues[1], 10);
  const blue = parseInt(rgbValues[2], 10);
  if (opacity < 0 || opacity > 1) {
    throw new Error('Opacity must be a number between 0 and 1');
  }
  return `rgba(${red},${green},${blue},${opacity})`;
}

export const truncateText = (text: string, max: number = 40) => {
  return text.length > max ? text.substring(0, max - 3) + '...' : text;
};

export const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0'); // Ottieni il giorno
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ottieni il mese (i mesi partono da 0)
  const year = date.getFullYear(); // Ottieni l'anno
  return `${day}/${month}/${year}`; // Restituisce la data nel formato gg/mm/aaaa
};

export const fetchByIds = async <T>(
  collectionName: string,
  ids: string[],
  map: (id: string, data: any) => T
): Promise<T[]> => {
  if (!ids.length) return [];

  const unique = [...new Set(ids)];

  const chunk = <U>(arr: U[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const chunks = chunk(unique, 10);

  const snaps = await Promise.all(
    chunks.map((c) => getDocs(query(collection(db, collectionName), where(documentId(), 'in', c))))
  );

  return snaps.flatMap((s) => s.docs.map((d) => map(d.id, d.data())));
};

export const SCHOOL_ID = 'tSkHlDpJXQBXLMQjlZMm';
