import { View, Platform } from 'react-native';
import { Text } from '~/components/Text';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView, KeyboardGestureArea } from 'react-native-keyboard-controller';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { TextField } from '~/components/nativewindui/TextField';
import { Button } from '~/components/nativewindui/Button';
import { useRouter } from 'expo-router';
import { useUserStore } from '~/store';

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, login } = useUserStore();

  const [canSave, setCanSave] = React.useState(false);

  const onChange = () => {
    if (!canSave) {
      setCanSave(true);
    }
  };

  return (
    <KeyboardGestureArea interpolator="ios">
      <KeyboardAwareScrollView
        bottomOffset={8}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <Form className="gap-5 px-4 pt-8">
          <FormSection iconProps={{ name: 'person-circle-outline', type: 'Ionicons' }}>
            <FormItem>
              <TextField
                textContentType="none"
                autoComplete="off"
                label={Platform.select({ ios: undefined, default: 'First' })}
                placeholder={Platform.select({ ios: 'required' })}
                onChange={onChange}
              />
            </FormItem>
            <FormItem>
              <TextField
                textContentType="none"
                autoComplete="off"
                label={Platform.select({ ios: undefined, default: 'Middle' })}
                placeholder={Platform.select({ ios: 'optional' })}
                onChange={onChange}
              />
            </FormItem>
            <FormItem>
              <TextField
                textContentType="none"
                autoComplete="off"
                label={Platform.select({ ios: undefined, default: 'Last' })}
                placeholder={Platform.select({ ios: 'required' })}
                onChange={onChange}
              />
            </FormItem>
          </FormSection>
          <View className="items-end">
            <Button onPress={login} disabled={!canSave} className="px-6">
              <Text>Save {String(isAuthenticated.valueOf())}</Text>
            </Button>
          </View>
        </Form>
      </KeyboardAwareScrollView>
    </KeyboardGestureArea>
  );
}
