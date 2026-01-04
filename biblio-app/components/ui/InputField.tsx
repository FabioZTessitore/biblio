import * as React from 'react';
import { Pressable, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  useDerivedValue,
} from 'react-native-reanimated';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { Text, Icon } from '~/components/ui';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

type InputFieldProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  sheet?: boolean;
  containerClassName?: string;
};

export const InputField = React.forwardRef<TextInput, InputFieldProps>(
  (
    {
      value,
      defaultValue = '',
      onChangeText,
      onFocus,
      onBlur,
      editable = true,
      label,
      hint,
      error,
      left,
      right,
      sheet = false,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const { colors } = useColorScheme();

    const controlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const [focused, setFocused] = React.useState(false);

    const text = controlled ? value : internal;
    const hasValue = text.length > 0;

    const Input = sheet ? BottomSheetTextInput : TextInput;

    function handleChange(v: string) {
      if (!controlled) setInternal(v);
      onChangeText?.(v);
    }

    function handleFocus(e: any) {
      setFocused(true);
      onFocus?.(e);
    }

    function handleBlur(e: any) {
      setFocused(false);
      onBlur?.(e);
    }

    function clear() {
      handleChange('');
    }

    /* ───────────── Floating label animation ───────────── */

    const lifted = focused || hasValue;
    const liftedDerived = useDerivedValue(() => lifted);
    const labelContainerStyle = useAnimatedStyle((): ViewStyle => {
      return {
        position: 'absolute',
        paddingHorizontal: withTiming(liftedDerived.value ? 6 : 0, {
          duration: 160,
        }),
        transform: [
          {
            translateY: withTiming(liftedDerived.value ? -14 : 14, {
              duration: 180,
            }),
          },
          {
            translateX: withTiming(liftedDerived.value ? 8 : 0, {
              duration: 180,
            }),
          },
        ],
      };
    });
    const labelTextStyle = useAnimatedStyle(() => {
      return {
        fontSize: withTiming(liftedDerived.value ? 14 : 16, {
          duration: 140,
        }),
        color: error ? colors.destructive : focused ? colors.primary : colors.grey2,
        backgroundColor: liftedDerived.value ? colors.card : 'transparent',
      };
    });

    /* ───────────── UI ───────────── */

    return (
      <View className={cn('gap-1', containerClassName)}>
        <Pressable
          disabled={!editable}
          onPress={() => (ref as any)?.current?.focus?.()}
          className={cn(
            'relative flex-row items-center rounded-full border-2 px-3',
            focused && 'border-primary',
            error && 'border-destructive',
            !focused && !error && 'border-border',
            !editable && 'opacity-50'
          )}>
          {left}

          <View className="flex-1">
            {label && (
              <Animated.View pointerEvents="none" className={''} style={labelContainerStyle}>
                <Animated.Text style={labelTextStyle} className="rounded px-2">
                  {label}
                </Animated.Text>
              </Animated.View>
            )}

            <Input
              ref={ref as any}
              editable={editable}
              value={text}
              onChangeText={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn('py-4 pl-2 text-base text-foreground', className)}
              placeholder={focused || !label ? props.placeholder : ''}
              {...props}
            />
          </View>

          {!!text && focused && editable && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(180)}>
              <Pressable onPress={clear} className="pl-2 pr-1 active:opacity-60">
                <Icon
                  name="close-circle-outline"
                  type="MaterialCommunityIcons"
                  size={24}
                  color={colors.grey2}
                />
              </Pressable>
            </Animated.View>
          )}

          {right}
        </Pressable>

        {!!error && (
          <Text variant="label" className="text-destructive">
            {error}
          </Text>
        )}

        {!!hint && !error && (
          <Text variant="label" className="text-muted-foreground">
            {hint}
          </Text>
        )}
      </View>
    );
  }
);

InputField.displayName = 'InputField';
