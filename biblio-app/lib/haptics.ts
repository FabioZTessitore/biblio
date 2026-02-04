import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '~/store/settings';

export const haptic = {
  success: () => {
    const { hapticsEnabled } = useSettingsStore.getState();
    if (!hapticsEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  error: () => {
    const { hapticsEnabled } = useSettingsStore.getState();
    if (!hapticsEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  light: () => {
    const { hapticsEnabled } = useSettingsStore.getState();
    if (!hapticsEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
};
