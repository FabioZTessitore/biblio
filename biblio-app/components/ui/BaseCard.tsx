import { View, Image, Pressable } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { truncateText } from '~/lib/utils';

const BaseCard = ({
  title,
  subtitle,
  imageUri,
  statusColor,
  statusLabel,
  actionLabel,
  onPress,
}: {
  title: string;
  subtitle: string;
  imageUri: string;
  statusColor: string;
  statusLabel: string;
  actionLabel: string;
  onPress: () => void;
}) => {
  return (
    <View className="flex-row justify-between gap-8 rounded-lg bg-card p-4 shadow-md">
      <Image
        resizeMode="cover"
        resizeMethod="resize"
        className="h-32 w-24 rounded-2xl"
        source={{ uri: imageUri }}
      />

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
