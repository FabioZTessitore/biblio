import { View } from "react-native";
import { Icon, Text } from "@/components/ui";
import { PressableScale } from "pressto";
import { router } from "expo-router";

const HeaderModal = ({ label }: { label: string }) => {
  return (
    <View className="flex-row items-center justify-between">
      <Text
        variant="label"
        className="uppercase tracking-widest"
        color="muted"
        weight="semibold"
      >
        {label}
      </Text>

      <PressableScale onPress={() => router.dismiss()}>
        <Icon name="close" type="MaterialCommunityIcons" />
      </PressableScale>
    </View>
  );
};

export default HeaderModal;
