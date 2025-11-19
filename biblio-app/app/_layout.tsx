import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '~/lib/toastConfig';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
// import * as SecureStore from 'expo-secure-store';

import { StatusBar } from 'expo-status-bar';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useEffect } from 'react';
import { useBookStore, useUserStore } from '~/store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  SplashScreen.preventAutoHideAsync();

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  // const { uid } = useUserStore();
  const { loadBooks } = useBookStore();

  useEffect(() => {
    async function init() {
      // loadBooks()
      // loadPrifile()
      SplashScreen.hideAsync();
    }

    init();
  }, []);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
      {/* <ExampleProvider> */}

      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
              <Stack screenOptions={SCREEN_OPTIONS}>
                <Stack.Screen name="(drawer)" />
              </Stack>
            </NavThemeProvider>
          </KeyboardProvider>
          {/* <Toast config={toastConfig} /> */}
        </BottomSheetModalProvider>
      </GestureHandlerRootView>

      {/* </ExampleProvider> */}
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
  headerShown: false,
} as const;
