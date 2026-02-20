import * as React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { cn } from '~/lib/cn';

const BORDER_CURVE: ViewStyle = {
  borderCurve: 'continuous',
};

type BadgeProps = {
  /** Visual style */
  tone?: 'danger' | 'neutral';

  /** Optional number to display */
  count?: number;

  /** If count exceeds this, show "+". Example: 9+ */
  limit?: number;

  /** Text style variant */
  size?: React.ComponentProps<typeof Text>['variant'];

  className?: string;
  containerClassName?: string;
};

export function Badge({
  tone = 'danger',
  count,
  limit,
  size = 'label',
  className,
  containerClassName,
}: BadgeProps) {
  const isDot = count == null;

  const displayValue = React.useMemo(() => {
    if (count == null) return null;
    if (limit == null) return count;
    return count > limit ? `${limit}+` : count;
  }, [count, limit]);

  return (
    <View
      style={BORDER_CURVE}
      className={cn(
        'absolute z-10 items-center justify-center rounded-full',
        tone === 'danger' ? 'bg-destructive' : 'bg-primary',
        isDot
          ? 'ios:-right-px -right-0.5 top-0 h-2.5 w-2.5'
          : 'ios:-right-1 -right-1.5 -top-0.5 min-w-4 px-1',
        containerClassName
      )}>
      {!isDot && (
        <Text variant={size} className={cn('font-bold text-white', className)}>
          {displayValue}
        </Text>
      )}
    </View>
  );
}
