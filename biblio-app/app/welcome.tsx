import { useState } from "react";
import { View } from "react-native";
import { Button, Text, Field, TextField } from "@/components/ui";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Welcome() {
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<any>({
    username: "",
    password: "",
  });

  const handleLogin = () => {
    console.log(form);
  };

  return (
    <SafeAreaView className="flex-1 p-4 px-6">
      <KeyboardAwareScrollView
        bottomOffset={8}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-12"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        <View className="flex-grow justify-start gap-8">
          <Field label="Username">
            <TextField
              placeholder="Add more details about this task..."
              value={form.username}
              onChangeText={(username) => setForm({ ...form, username })}
            />
          </Field>

          <Field label="Password">
            <TextField
              placeholder="Add more details about this task..."
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
            />
          </Field>

          <Button label="Login" onPress={handleLogin} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
