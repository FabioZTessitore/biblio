import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '~/components/ui';
import { BlurView } from 'expo-blur';
import { PressableScale } from 'pressto';
import { useColorScheme } from '~/lib/useColorScheme';
import { useTranslation } from 'react-i18next';

import { haptic } from '~/lib/haptics';
import { useAuthStore, useSettingsStore } from '~/store';
import { Toggle } from '~/components/nativewindui/Toggle';

const Settings = () => {
  const { t } = useTranslation();
  const { uid, logout } = useAuthStore();
  const { colors, isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const { hapticsEnabled, toggleHaptics } = useSettingsStore();

  const styles = StyleSheet.create({
    settingCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
      borderRadius: 16,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 8,
      alignItems: 'center',
      borderColor: colors.grey5,
      borderWidth: 1,
    },
  });

  return (
    <BlurView
      tint={isDarkColorScheme ? 'dark' : 'light'}
      className="flex-1 gap-8 rounded-t-full p-4"
      blurReductionFactor={1}
      intensity={80}
      experimentalBlurMethod="dimezisBlurView">
      <View className="items-center">
        <Text variant={'heading'}>{t('settings.title')}</Text>
      </View>

      <View className="gap-10">
        <View className="gap-4">
          <PressableScale style={styles.settingCard} onPress={toggleHaptics}>
            <Text>Vibrazione</Text>
            <Toggle value={hapticsEnabled} />
          </PressableScale>

          <PressableScale style={styles.settingCard} onPress={toggleColorScheme}>
            <Text>Tema scuro</Text>
            <Toggle value={isDarkColorScheme} />
          </PressableScale>

          {/* <PressableScale style={styles.settingCard} onPress={() => {}}>
          <Text>Notifiche</Text>
          <Toggle disabled={true} value={false} />
          </PressableScale> */}
        </View>
        <PressableScale style={styles.settingCard} onPress={logout}>
          <View className="flex-1 items-center">
            <Text className="text-destructive">Esci</Text>
          </View>
        </PressableScale>
      </View>
    </BlurView>
  );
};

export default Settings;
