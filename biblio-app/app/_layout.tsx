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
import { useUserStore } from '~/store';
import * as SecureStore from 'expo-secure-store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  SplashScreen.preventAutoHideAsync();

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { membership, fetchMembership, user, setMembership } = useUserStore();

  useEffect(() => {
    async function init() {
      console.log('uid: ', user.uid, 'schoolId:', process.env.EXPO_PUBLIC_SCHOOL_ID);

      const autoMembership = await fetchMembership(user.uid, process.env.EXPO_PUBLIC_SCHOOL_ID);

      console.log('Membership Salvata:', autoMembership);

      if (autoMembership) return setMembership(autoMembership);

      setMembership({
        schoolId: '',
        role: 'user',
        createdAt: null,
      });
    }

    init();
  }, [user.uid]);

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
                <Stack.Protected guard={!!membership.schoolId}>
                  <Stack.Screen name="(drawer)" />
                </Stack.Protected>

                <Stack.Protected guard={!membership.schoolId}>
                  <Stack.Screen name="welcome" />
                </Stack.Protected>
              </Stack>
            </NavThemeProvider>
          </KeyboardProvider>
        </BottomSheetModalProvider>
        {/*@ts-expect-error*/}
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
