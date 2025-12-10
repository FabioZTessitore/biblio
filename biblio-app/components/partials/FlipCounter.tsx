import { useId } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LayoutAnimationConfig,
  ZoomInEasyUp,
  ZoomOutEasyDown,
} from 'react-native-reanimated';

const FlipCounter = ({ count }: { count: number }) => {
  const id = useId();
  return (
    <View className="overflow-hidden py-1">
      <LayoutAnimationConfig skipEntering>
        <Animated.View
          entering={FadeInUp.duration(120)}
          exiting={FadeOutDown.duration(120)}
          key={`${id}-wrapper-${count}`}>
          <Animated.View
            key={`${id}-inner-${count}`}
            entering={ZoomInEasyUp.duration(120)}
            exiting={ZoomOutEasyDown.duration(120)}>
            <Text color={'primary'}>{count}</Text>
          </Animated.View>
        </Animated.View>
      </LayoutAnimationConfig>
    </View>
  );
};

export { FlipCounter };
