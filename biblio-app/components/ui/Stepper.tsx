import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';
import { Icon } from '~/components/ui/Icon';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

type StepperProps = Omit<ViewProps, 'children'> & {
  minusButton?: Omit<PressableProps, 'children'>;
  plusButton?: Omit<PressableProps, 'children'>;
};

function Stepper({ className, minusButton, plusButton, ...props }: StepperProps) {
  const { colors } = useColorScheme();

  return (
    <View
      className={cn(
        'flex-row items-center overflow-hidden rounded-full border border-border',
        className
      )}
      {...props}>
      <Pressable {...minusButton} className={cn('h-8 justify-center px-5', minusButton?.className)}>
        <Icon name="minus" type="MaterialCommunityIcons" size={20} color={colors.foreground} />
      </Pressable>

      <View className="h-8 w-px rounded-full bg-border" />

      <Pressable {...plusButton} className={cn('h-8 justify-center px-5', plusButton?.className)}>
        <Icon name="plus" type="MaterialCommunityIcons" size={20} color={colors.foreground} />
      </Pressable>
    </View>
  );
}

export { Stepper };
