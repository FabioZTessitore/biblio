import { useAugmentedRef, useControllableState } from '@rn-primitives/hooks';
import { Icon } from '~/components/ui/Icon';
import { memo, forwardRef, useCallback } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

type SearchFieldProps = Omit<TextInputProps, 'onChange'> & {
  /** Render input inside a BottomSheet */
  sheet?: boolean;

  /** Root container styling */
  rootClassName?: string;

  /** Left icon wrapper styling */
  leadingIconClassName?: string;

  /** Left icon color override */
  leadingIconColor?: string;

  /** Controlled value */
  value?: string;

  /** Value change handler */
  onChangeText?: (text: string) => void;
};

export const SearchField = memo(
  forwardRef<React.ComponentRef<typeof TextInput | typeof BottomSheetTextInput>, SearchFieldProps>(
    (
      {
        sheet,
        value: valueProp,
        onChangeText: onChangeTextProp,
        placeholder = 'Cerca',
        rootClassName,
        leadingIconClassName,
        className,
        leadingIconColor,
        ...props
      },
      ref
    ) => {
      const { colors } = useColorScheme();

      const [value = '', onChangeText] = useControllableState({
        prop: valueProp,
        defaultProp: valueProp ?? '',
        onChange: onChangeTextProp,
      });

      const clear = useCallback(() => {
        onChangeText('');
      }, [onChangeText]);

      const inputRef = useAugmentedRef({
        ref,
        methods: {
          focus: () => inputRef.current?.focus(),
          blur: () => inputRef.current?.blur(),
          clear,
        },
      });

      const InputComponent = sheet ? BottomSheetTextInput : TextInput;

      return (
        <Pressable
          onPress={() => inputRef.current?.focus()}
          className={cn('h-14 flex-row items-center rounded-full bg-card px-2', rootClassName)}>
          {/* Search icon */}
          <View className={cn('pl-2 pr-1', leadingIconClassName)}>
            <Icon
              color={leadingIconColor ?? colors.grey2}
              type="MaterialCommunityIcons"
              name="magnify"
              size={24}
            />
          </View>

          {/* Input */}
          <InputComponent
            ref={inputRef as any}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.grey2}
            className={cn('flex-1 py-2 text-base text-foreground', className)}
            role="searchbox"
            {...props}
          />

          {/* Clear */}
          {!!value && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(180)}>
              <Pressable onPress={clear} className="px-2" hitSlop={10}>
                <Icon
                  name="close-circle-outline"
                  type="MaterialCommunityIcons"
                  size={24}
                  color={colors.grey2}
                />
              </Pressable>
            </Animated.View>
          )}
        </Pressable>
      );
    }
  )
);

SearchField.displayName = 'SearchField';
