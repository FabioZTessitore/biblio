import '../global.css';
import '~/lib/i18n';
import 'expo-dev-client';

import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { toastConfig } from '~/lib/toastConfig';
import { NAV_THEME } from '~/theme';
import { useUserStore } from '~/store';
import { Membership } from '~/store/user';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const DEFAULT_MEMBERSHIP = {
  schoolId: '',
  role: 'user',
  createdAt: null,
} as Membership;

export default function RootLayout() {
  useInitialAndroidBarSync();

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { membership, user, fetchMembership, setMembership } = useUserStore();

  useEffect(() => {
    const initializeApp = async () => {
      const SCHOOL_ID = process.env.EXPO_PUBLIC_SCHOOL_ID;

      if (!user?.uid || !SCHOOL_ID) {
        setMembership(DEFAULT_MEMBERSHIP);
        return;
      }

      try {
        const autoMembership = await fetchMembership(user.uid, SCHOOL_ID);

        setMembership(autoMembership ?? DEFAULT_MEMBERSHIP);
      } catch (error) {
        console.error('Root initialization failed:', error);
        setMembership(DEFAULT_MEMBERSHIP);
      }
    };

    initializeApp();
  }, [user?.uid]);

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
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="settings"
                    options={{
                      presentation: 'formSheet',
                      sheetGrabberVisible: true,
                      sheetAllowedDetents: [0.45, 0.95],
                      sheetCornerRadius: 16,
                      contentStyle: {
                        backgroundColor: 'transparent',
                      },
                    }}
                  />
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
