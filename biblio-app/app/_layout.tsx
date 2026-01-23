import '../global.css';
import '~/lib/i18n';
import 'expo-dev-client';
import { useEffect } from 'react';
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
      const SCHOOL_ID = process.env.EXPO_PUBLIC_SCHOOL_ID as string;
      console.log('uid: ', user.uid, 'schoolId:', SCHOOL_ID);

      const autoMembership = await fetchMembership(user.uid, SCHOOL_ID);

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
