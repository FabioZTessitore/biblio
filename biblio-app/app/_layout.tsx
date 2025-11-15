import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '~/lib/toastConfig';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

import { StatusBar } from 'expo-status-bar';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useCallback, useEffect, useState } from 'react';
import loginHelper from '~/lib/loginHelper';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        const storedToken = await SecureStore.getItemAsync('token');
        const storedUid = await SecureStore.getItemAsync('uid');
        // const storedTheme = await SecureStore.getItemAsync('theme');
        // if (storedTheme) {
        //   Appearance.setColorScheme(theme);
        // }

        if (storedToken && storedUid) {
          await loginHelper(storedToken, storedUid, true);
        }
        // else {
        //   // se non è loggato nessun utente, imposto le preferenze di default
        //   await setDefaultPreferences();
        // }
      } catch (err) {
        console.log(err);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <KeyboardProvider>
          <NavThemeProvider value={NAV_THEME[colorScheme]}>
            <Stack screenOptions={SCREEN_OPTIONS}>
              <Stack.Screen name="(drawer)" />
            </Stack>
          </NavThemeProvider>
        </KeyboardProvider>
        <Toast config={toastConfig} />
      </GestureHandlerRootView>

      {/* </ExampleProvider> */}
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
  headerShown: false,
} as const;
