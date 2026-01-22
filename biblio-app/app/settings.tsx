import { View } from 'react-native';
import { Icon, Text } from '~/components/ui';
import { BlurView } from 'expo-blur';
import { PressableScale } from 'pressto';
import { useColorScheme } from '~/lib/useColorScheme';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <BlurView
      tint="dark"
      className="flex-1 gap-8 rounded-t-full p-4"
      blurReductionFactor={2}
      intensity={60}
      experimentalBlurMethod="dimezisBlurView">
      <View className="items-center">
        <Text variant={'heading'}>{t('settings.title')}</Text>
      </View>

      <View className="gap-4">
        {/* <View className="gap-4 rounded-2xl bg-background p-4">
          <Text variant={'heading'}>Lingua</Text>
          <PressableScale
            style={{
              gap: 16,
              borderRadius: 16,
              backgroundColor: colors.background,
              padding: 16,
            }}
            onPress={() => {}}>
            <Text variant={'heading'}>Italiano</Text>
          </PressableScale>
        </View> */}
        <View className="gap-4 rounded-2xl bg-background p-4">
          <Text variant={'heading'}>Vibrazione</Text>
        </View>
        <View className="gap-4 rounded-2xl bg-background p-4">
          <Text variant={'heading'}>Notifiche</Text>
        </View>
      </View>
    </BlurView>
  );
};

export default Settings;
