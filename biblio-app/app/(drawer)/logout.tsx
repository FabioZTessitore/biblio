import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore, useUserStore } from '~/store';

export default function Logout() {
  const { setIsAuthenticated, setUid } = useAuthStore();
  const { clearUser, setMembership } = useUserStore();

  useEffect(() => {
    // PRIMA esci dal drawer!!
    router.replace('/welcome');

    // POI resetti lo store
    setTimeout(() => {
      clearUser();
      setMembership({
        schoolId: '',
        role: 'user',
        createdAt: null,
      });
      setIsAuthenticated(false);
      setUid('');
    }, 0);
  }, []);

  return null; // niente render, niente rischi
}

// Causava crash dell'app, questa soluzione sembra funzionare.
// Da implementare una tab profilo dove si possono gestire
// meglio le info e le impostazioni dell'utente e app, così da eliminare il drawer
