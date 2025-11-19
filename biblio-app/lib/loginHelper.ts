import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import * as SecureStore from 'expo-secure-store';
import { useUserStore } from '~/store';
import { Book } from '~/store/book';

export default async function (newToken: string, userId: string, remember: boolean) {
  const docRef = doc(db, 'users', userId);
  try {
    // info sullo user
    const docSnap = await getDoc(docRef);
    if (remember) {
      SecureStore.setItemAsync('token', newToken);
      SecureStore.setItemAsync('uid', userId);
    }
    // set stato utente
    useUserStore.setState({
      uid: userId,
      profile: {
        name: docSnap.data()!.name,
        surname: docSnap.data()!.surname,
        email: docSnap.data()!.email,
        schoolsId: docSnap.data()!.schoolsId,
        booksId: docSnap.data()!.booksId,
      },
    });
    const oldBooks: Book[] = [];
    // download libri bibliotecaio
    const q = query(collection(db, 'books'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        oldBooks.push({
          id: doc.id,
          title: doc.data().title,
          schoolId: doc.data().schoolId,
          author: doc.data().author,
          qty: doc.data().qty,
          availbale: doc.data().availbale,
        });
      });
    }
    useUserStore.setState({ library: oldBooks });
  } catch (error) {
    console.log('loginHelper error: ', error);
  }
}
