// import { Inter_300Light, Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { UITextView } from 'react-native-uitextview';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

cssInterop(UITextView, { className: 'style' });

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      display: 'text-4xl', // 36px
      heading: 'text-2xl', // 24px
      body: 'text-base', // 16px
      label: 'text-sm', // 14px
    },
    weight: {
      light: 'font-light',
      medium: 'font-medium',
      bold: 'font-bold',
    },
    color: {
      foreground: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted',
    },
  },
  defaultVariants: {
    variant: 'body',
    weight: 'medium',
    color: 'foreground',
  },
});

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  variant,
  weight,
  color,
  ...props
}: React.ComponentPropsWithoutRef<typeof UITextView> & VariantProps<typeof textVariants>) {
  const textClassName = React.useContext(TextClassContext);

  // const [fontsLoaded] = useFonts({
  //   Inter_300Light,
  //   Inter_500Medium,
  //   Inter_700Bold,
  // });

  // if (!fontsLoaded) return null;

  // const fontMap = {
  //   light: 'Inter_300Light',
  //   medium: 'Inter_500Medium',
  //   bold: 'Inter_700Bold',
  // } as const;

  return (
    <UITextView
      // style={{ fontFamily: fontMap[weight ?? 'medium'] }}
      className={cn(textVariants({ variant, weight, color }), textClassName, className)}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
