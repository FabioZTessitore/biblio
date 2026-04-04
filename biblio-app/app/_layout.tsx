import '@/global.css';
import { useAppTheme } from '@/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { isDarkColorScheme, navTheme } = useAppTheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />

      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <NavThemeProvider value={navTheme}>
            <Stack screenOptions={SCREEN_OPTIONS}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="welcome"
                options={{
                  headerShown: true,
                }}
              />
            </Stack>
          </NavThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'slide_from_right',
  headerShown: false,
} as const;
