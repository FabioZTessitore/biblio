import * as React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '~/lib/cn';
import { Icon, type IconProps, type IconType } from '~/components/ui/Icon';
import { useColorScheme } from '~/lib/useColorScheme';

type FormGroupProps = ViewProps & {
  title?: string;
  icon?: IconProps<IconType>;
  containerClassName?: string;
};
export const FormBlock = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => {
  return <View ref={ref} className={cn('flex-1 gap-8', className)} {...props} />;
});

export const FormGroup = ({
  title,
  icon,
  className,
  containerClassName,
  children,
  ...props
}: FormGroupProps) => {
  const { colors } = useColorScheme();

  return (
    <View className={cn('gap-2', containerClassName)}>
      <View className={cn('flex-row gap-4', className)}>
        {icon && <Icon className="pt-3" size={22} color={colors.grey} {...icon} />}

        <View className={'flex-1 gap-4 overflow-hidden rounded-xl bg-card'} {...props}>
          {children}
        </View>
      </View>
    </View>
  );
};

export const FormRow = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => {
  return <View ref={ref} className={cn('flex-1 py-2', className)} {...props} />;
});
