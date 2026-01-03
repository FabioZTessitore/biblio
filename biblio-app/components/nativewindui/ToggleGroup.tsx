import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text, Icon, type IconProps, type IconType } from '~/components/ui';
import { cn } from '~/lib/cn';

type ToggleItem = {
  label: string;
  value: string;
  icon?: IconProps<IconType>;
};

type ToggleGroupProps = {
  items: ToggleItem[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
  textClassName?: string;
};

export function ToggleGroup({
  items,
  value,
  onChange,
  disabled = false,
  className,
  itemClassName,
  textClassName,
}: ToggleGroupProps) {
  return (
    <View
      testID="toggle-group"
      className={cn('flex-row overflow-hidden rounded-full border border-border', className)}>
      {items.map((item, index) => {
        const active = item.value === value;
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <Pressable
            key={item.value}
            disabled={disabled}
            onPress={() => onChange?.(item.value)}
            className={cn(
              'flex-1 items-center justify-center px-3 py-2',
              active ? 'bg-primary/15' : 'bg-transparent',
              !isLast && 'border-r border-border',
              isFirst && 'rounded-l-full',
              isLast && 'rounded-r-full',
              disabled && 'opacity-50',
              itemClassName
            )}>
            <View className="items-center gap-1">
              {item.icon && <Icon {...item.icon} />}
              <Text className={cn('text-sm', active && 'font-medium', textClassName)}>
                {item.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
