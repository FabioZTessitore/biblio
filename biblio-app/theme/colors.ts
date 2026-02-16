import { Platform } from 'react-native';

const IOS_SYSTEM_COLORS = {
  white: 'rgb(240, 240, 240)',
  black: 'rgb(0, 0, 0)',
  light: {
    white: 'rgb(240, 240, 240)',
    black: 'rgb(0, 0, 0)',
    grey6: 'rgb(242, 242, 247)',
    grey5: 'rgb(230, 230, 235)',
    grey4: 'rgb(210, 210, 215)',
    grey3: 'rgb(199, 199, 204)',
    grey2: 'rgb(175, 176, 180)', // muted
    grey: 'rgb(142, 142, 147)',
    background: 'rgb(242, 242, 247)',
    foreground: 'rgb(0, 0, 0)',
    root: 'rgb(240, 240, 240)',
    card: 'rgb(240, 240, 240)',
    destructive: 'rgb(188, 47, 47)',
    success: 'rgb(74, 222, 128)',
    primary: 'rgb(44, 176, 244)',
    secondary: 'rgb(244, 112, 44)',
  },
  dark: {
    white: 'rgb(240, 240, 240)',
    black: 'rgb(0, 0, 0)',
    grey6: 'rgb(21, 21, 24)',
    grey5: 'rgb(40, 40, 42)',
    grey4: 'rgb(55, 55, 57)',
    grey3: 'rgb(70, 70, 73)',
    grey2: 'rgb(99, 99, 102)', // muted
    grey: 'rgb(142, 142, 147)',
    background: 'rgb(0, 0, 0)',
    foreground: 'rgb(240, 240, 240)',
    root: 'rgb(0, 0, 0)',
    card: 'rgb(28, 28, 30)',
    destructive: 'rgb(188, 47, 47)',
    success: 'rgb(74, 222, 128)',
    primary: 'rgb(44, 176, 244)',
    secondary: 'rgb(244, 112, 44)',
  },
} as const;

const ANDROID_COLORS = {
  white: 'rgb(240, 240, 240)',
  black: 'rgb(0, 0, 0)',
  light: {
    white: 'rgb(240, 240, 240)',
    black: 'rgb(0, 0, 0)',
    grey6: 'rgb(249, 249, 255)',
    grey5: 'rgb(215, 217, 228)',
    grey4: 'rgb(193, 198, 215)',
    grey3: 'rgb(113, 119, 134)',
    grey2: 'rgb(65, 71, 84)', // muted
    grey: 'rgb(24, 28, 35)',
    background: 'rgb(240, 240, 240)',
    foreground: 'rgb(0, 0, 0)',
    root: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    destructive: 'rgb(188, 47, 47)',
    success: 'rgb(74, 222, 128)',
    primary: 'rgb(44, 176, 244)',
    secondary: 'rgb(244, 112, 44)',
  },
  dark: {
    white: 'rgb(240, 240, 240)',
    black: 'rgb(0, 0, 0)',
    grey6: 'rgb(16, 19, 27)',
    grey5: 'rgb(39, 42, 50)',
    grey4: 'rgb(49, 53, 61)',
    grey3: 'rgb(54, 57, 66)',
    grey2: 'rgb(139, 144, 160)', // muted
    grey: 'rgb(193, 198, 215)',
    background: 'rgb(0, 0, 0)',
    foreground: 'rgb(240, 240, 240)',
    root: 'rgb(0, 0, 0)',
    card: 'rgb(16, 19, 27)',
    destructive: 'rgb(188, 47, 47)',
    success: 'rgb(74, 222, 128)',
    primary: 'rgb(44, 176, 244)',
    secondary: 'rgb(244, 112, 44)',
  },
} as const;

const COLORS = Platform.OS === 'ios' ? IOS_SYSTEM_COLORS : ANDROID_COLORS;

export { COLORS };
