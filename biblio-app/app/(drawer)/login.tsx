import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView, KeyboardGestureArea } from 'react-native-keyboard-controller';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { TextField } from '~/components/nativewindui/TextField';
import { Button } from '~/components/nativewindui/Button';
import Toast from 'react-native-toast-message';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import loginHelper from '~/lib/loginHelper';
import { router } from 'expo-router';
import { auth } from '~/lib/firebase';
export default function LogIn() {
  const insets = useSafeAreaInsets();
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const allFieldsValid = (currentEmail: string, currentPassword: string) => {
    // Controllo che la email inserita contenga una '@'
    // if (!currentEmail || !currentEmail.includes('@')) {
    //   return false;
    // }
    // Controllo password sia lunga almeno 8 caratteri
    if (!currentPassword || currentPassword.length < 8) {
      return false;
    }
    return true;
  };

  const loginHandler = async () => {
    console.log('in login');

    if (currentEmail.trim().length === 0 || currentPassword.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Authentication failed!',
        text2: 'Could not log you in. Please check your credentials or try again later!',
      });
      return;
    }
    // setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, currentEmail, currentPassword);
      const user = userCredential.user;

      // if (user.emailVerified) {
      const userId = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();
      await loginHelper(token, userId, true);
      router.push('/(drawer)/(tabs)/homeBibliotecaio');
      // } else {
      // Toast.show({
      //   type: 'error',
      //   text1: 'Email has not been verified!',
      //   text2: 'You must verify your email address to gain access.',
      // });
      // }
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Authentication failed!',
        text2: 'Could not log you in. Please check your credentials or try again later!',
      });
    } finally {
      // setIsLoading(false);
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
          <FormSection>
            <FormItem>
              <TextField
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(email) => setCurrentEmail(email)}
                value={currentEmail}
              />
            </FormItem>
            <FormItem>
              <TextField
                placeholder="Password"
                autoCapitalize="none"
                onChangeText={(pass) => setCurrentPassword(pass)}
                secureTextEntry
                value={currentPassword}
              />
              <TouchableOpacity className="self-end" onPress={() => {}}>
                <Text
                  style={{ fontFamily: 'TripSans' }}
                  className="text-right text-base text-black">
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </FormItem>
          </FormSection>
          <View className="items-end">
            <Button
              onPress={loginHandler}
              disabled={allFieldsValid(currentEmail, currentPassword) ? false : true}
              className="px-6">
              <Text>Login</Text>
            </Button>
          </View>
        </Form>
      </KeyboardAwareScrollView>
    </KeyboardGestureArea>
  );
}
