import { useAugmentedRef, useControllableState } from '@rn-primitives/hooks';
import { Icon } from '~/components/Icon';
import { memo, forwardRef, useState, useCallback, useMemo } from 'react';
import {
  Pressable,
  TextInput,
  View,
  ViewStyle,
  type NativeSyntheticEvent,
  type FocusEvent,
} from 'react-native';
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { type SearchInputProps } from './types';
import { Text } from '~/components/Text';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
// import { useTranslation } from "react-i18next"

// Add as class when possible: https://github.com/marklawlor/nativewind/issues/522
export const BORDER_CURVE: ViewStyle = {
  borderCurve: 'continuous',
};

export const SearchInput = memo(
  forwardRef<React.ComponentRef<typeof TextInput | typeof BottomSheetTextInput>, SearchInputProps>(
    (
      {
        variant,
        value: valueProp,
        onChangeText: onChangeTextProp,
        onFocus: onFocusProp,
        placeholder,
        cancelText,
        containerClassName,
        iconContainerClassName,
        className,
        iconColor,
        ...props
      },
      ref
    ) => {
      const { colors } = useColorScheme();
      // const { t } = useTranslation()

      const inputRef = useAugmentedRef({
        ref,
        methods: {
          focus: () => {
            inputRef?.current?.focus();
          },
          blur: () => {
            inputRef?.current?.blur();
          },
          clear: () => onChangeText?.(''),
        },
      });

      const [showCancel, setShowCancel] = useState(false);
      const showCancelDerivedValue = useDerivedValue(() => showCancel, [showCancel]);
      const animatedRef = useAnimatedRef();

      const [value = '', onChangeText] = useControllableState({
        prop: valueProp,
        defaultProp: valueProp ?? '',
        onChange: onChangeTextProp,
      });

      // const cancelString = useMemo(() => cancelText ?? t('nwui.search.cancel'), [cancelText, t]);
      const cancelString = useMemo(() => cancelText ?? 'Cancella', [cancelText]);

      const rootStyle = useAnimatedStyle(() => {
        if (__RUNTIME_KIND) {
          // safely use measure
          const measurement = measure(animatedRef);

          return {
            paddingRight: showCancelDerivedValue.value
              ? withTiming(measurement?.width ?? cancelString.length * 11.2)
              : withTiming(0),
          };
        }

        return {
          paddingRight: showCancelDerivedValue.value
            ? withTiming(cancelString.length * 11.2)
            : withTiming(0),
        };
      });

      const buttonStyle3 = useAnimatedStyle(() => {
        if (__RUNTIME_KIND) {
          // safely use measure
          const measurement = measure(animatedRef);

          return {
            position: 'absolute',
            right: 0,
            opacity: showCancelDerivedValue.value ? withTiming(1) : withTiming(0),
            transform: [
              {
                translateX: showCancelDerivedValue.value
                  ? withTiming(0)
                  : measurement?.width
                    ? withTiming(measurement.width)
                    : cancelString.length * 11.2,
              },
            ],
          };
        }

        return {
          position: 'absolute',
          right: 0,
          opacity: showCancelDerivedValue.value ? withTiming(1) : withTiming(0),
          transform: [
            {
              translateX: showCancelDerivedValue.value
                ? withTiming(0)
                : withTiming(cancelString.length * 11.2),
            },
          ],
        };
      });

      const onFocus = useCallback(
        (e: NativeSyntheticEvent<FocusEvent>) => {
          setShowCancel(true);
          onFocusProp?.(e as unknown as any);
        },
        [onFocusProp, setShowCancel]
      );

      const onPress = useCallback(() => {
        onChangeText?.('');

        inputRef.current?.blur();

        setShowCancel(false);
      }, [onChangeText, inputRef, setShowCancel]);

      const InputComponent = variant === 'bottom-sheet' ? BottomSheetTextInput : TextInput;

      return (
        <Animated.View className="flex-row items-center" style={rootStyle}>
          <Animated.View
            style={BORDER_CURVE}
            className={cn('flex-1 flex-row rounded-lg bg-card', containerClassName)}>
            <View
              className={cn(
                'absolute bottom-0 left-0 top-0 z-50 justify-center pl-1.5',
                iconContainerClassName
              )}>
              <Icon
                color={iconColor ?? colors.grey3}
                type="MaterialCommunityIcons"
                name="magnify"
                size={22}
              />
            </View>
            <InputComponent
              ref={inputRef as any}
              placeholder={placeholder ?? 'Cerca'}
              className={cn(
                !showCancel && 'active:bg-muted/5 dark:active:bg-muted/20',
                'flex-1 rounded-lg py-2 pl-8 pr-1  text-[17px] text-foreground',
                className
              )}
              value={value}
              onChangeText={onChangeText}
              // onFocus={onFocus}
              clearButtonMode="while-editing"
              role="searchbox"
              {...props}
            />
          </Animated.View>
          <Animated.View
            ref={animatedRef}
            style={buttonStyle3}
            pointerEvents={!showCancel ? 'none' : 'auto'}>
            <Pressable
              onPress={onPress}
              disabled={!showCancel}
              pointerEvents={!showCancel ? 'none' : 'auto'}
              className="flex-1 justify-center active:opacity-50">
              <Text className="px-2 text-primary">{cancelString}</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      );
    }
  )
);

SearchInput.displayName = 'SearchInput';
