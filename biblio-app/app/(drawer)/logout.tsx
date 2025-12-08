import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '~/store';

export default function Logout() {
  const { logout } = useAuthStore();

  useEffect(() => {
    // PRIMA esci dal drawer!!
    router.replace('/welcome');

    // POI resetti lo store
    setTimeout(() => {
      logout();
    }, 0);
  }, []);

  return null; // niente render, niente rischi
}

// Causava crash dell'app, questa soluzione sembra funzionare.
// Da implementare una tab profilo dove si possono gestire
// meglio le info e le impostazioni dell'utente e app, così da eliminare il drawer
