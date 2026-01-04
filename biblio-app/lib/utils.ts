import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User } from '~/store/user';

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

export const fetchUsersByIds = async (ids: string[]) => {
  const unique = [...new Set(ids)];
  if (!unique.length) return [];

  const snaps = await Promise.all(unique.map((id) => getDoc(doc(db, 'users', id))));

  return snaps
    .filter((s) => s.exists())
    .map((s) => ({
      uid: s.id,
      ...(s.data() as Omit<User, 'uid'>),
    }));
};
