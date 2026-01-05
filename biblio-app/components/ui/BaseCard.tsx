import { View, Pressable } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { truncateText } from '~/lib/utils';
import { BookImage } from '~/components/partials/BookImage';

const BaseCard = ({
  title,
  subtitle,
  isbn,
  statusColor,
  statusLabel,
  actionLabel,
  onPress,
}: {
  title: string;
  subtitle: string;
  isbn: string;
  statusColor: string;
  statusLabel: string;
  actionLabel: string;
  onPress: () => void;
}) => {
  return (
    <View className="flex-row justify-between gap-8 rounded-lg bg-card p-4 shadow-md">
      <BookImage isbn={isbn} resizeMode="contain" className="h-32 min-w-24 rounded-2xl" />

      <View className="items-end justify-between">
        <View className="items-end gap-2">
          <Text>{truncateText(title, 20)}</Text>
          <Text variant="label" color="muted">
            {truncateText(subtitle, 20)}
          </Text>

          <View className="flex-row items-center gap-2">
            <Icon size="label" name="circle" color={statusColor} />
            <Text
              weight="light"
              variant="label"
              className="flex-shrink uppercase"
              style={{ includeFontPadding: false }}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <Pressable className="flex-row items-center gap-2" onPress={onPress}>
          <Text variant="label" weight="light" className="text-destructive underline">
            {actionLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export { BaseCard };
