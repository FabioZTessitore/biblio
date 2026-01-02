import * as React from 'react';
import { View } from 'react-native';

import type { SegmentControlProps } from './types';

import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { Icon } from '~/components/ui';

function SegmentedControl({
  values,
  selectedIndex,
  onIndexChange,
  onValueChange,
  enabled = true,
  materialTextClassName,
  iosMomentary: _iosMomentary,
  icons,
}: SegmentControlProps) {
  const id = React.useId();

  function onPress(index: number, value: string) {
    return () => {
      onIndexChange?.(index);
      onValueChange?.(value);
    };
  }
  return (
    <View className="border-foreground/50 flex-row rounded-full border">
      {values.map((value, index) => {
        const iconProps = icons?.[index];
        return (
          <View key={`segment:${id}-${index}-${value}`} className="flex-1">
            <Button
              disabled={!enabled}
              size="sm"
              variant={selectedIndex === index ? 'tonal' : 'plain'}
              androidRootClassName={cn(
                'rounded-none',
                index === 0 && 'rounded-l-full',
                index === values?.length - 1 && 'rounded-r-full'
              )}
              className={cn(
                'rounded-none py-2',
                index === 0 && 'rounded-l-full',
                index === values?.length - 1 ? 'rounded-r-full' : 'border-foreground/50 border-r'
              )}
              onPress={onPress(index, value)}>
              <View className="items-center gap-2">
                {iconProps && <Icon {...iconProps} />}
                <Text className={materialTextClassName}>{value}</Text>
              </View>
            </Button>
          </View>
        );
      })}
    </View>
  );
}

export { SegmentedControl };
