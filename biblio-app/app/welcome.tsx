import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '~/components/nativewindui/Button';
import { FormBlock, FormRow } from '~/components/nativewindui/FormGroup';
import { ToggleGroup } from '~/components/nativewindui/ToggleGroup';
import { TextField } from '~/components/nativewindui/TextField';
import { Icon, Text } from '~/components/ui';
import { useAuthStore } from '~/store';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { SCHOOL_ID } from '~/lib/utils';
import { useColorScheme } from '~/lib/useColorScheme';
import { TextFieldRef } from '~/components/nativewindui/TextField/types';
import { Membership } from '~/store/user';

const MemberWelcome = () => {
  const { loginAnonymously, isLoading } = useAuthStore();

  const [userAttempt, setUserAttempt] = useState({
    schoolId: SCHOOL_ID, // TODO: da cambiare in prod, .env (??)
    name: '',
    surname: '',
    grade: '',
    error: '',
  });

  const surnameFieldRef = useRef<TextFieldRef>(null);
  const gradeFieldRef = useRef<TextFieldRef>(null);

  const handleEnter = () => {
    if (!userAttempt.name || !userAttempt.surname) {
      setUserAttempt({ ...userAttempt, error: 'Inserire i campi obbligatori *' });
      return;
    }

    loginAnonymously(userAttempt.name, userAttempt.surname, userAttempt.grade);
  };

  useEffect(() => {
    if (userAttempt.name && userAttempt.surname) {
      setUserAttempt({ ...userAttempt, error: '' });
    }
  }, [userAttempt.name, userAttempt.surname]);

  return (
    <View className="flex-1">
      <View className="items-center">
        <Text variant={'heading'}>Benvenuto!</Text>

        <Text weight={'light'} color={'muted'} className="text-center">
          Chiedi in prestito dei libri della tua scuola!
        </Text>
      </View>

      <FormBlock className="gap-6 px-4 pt-8">
        {/* <FormRow className="gap-2">
          <Text>Codice Scuola</Text>
          <TextField
            placeholder="Inserisci il codice della tua scuola"
            onChangeText={(schoolId) => setUserAttempt({ ...userAttempt, schoolId })}
            value={userAttempt.schoolId}
          />
        </FormRow> */}
        <FormRow className="gap-2">
          <Text>Nome*</Text>
          <TextField
            placeholder="Inserisci il tuo nome"
            onChangeText={(name) => setUserAttempt({ ...userAttempt, name })}
            maxLength={20}
            errorMessage={userAttempt.error}
            value={userAttempt.name}
            onSubmitEditing={() => {
              surnameFieldRef?.current?.focus();
            }}
            returnKeyType="next"
            submitBehavior={'submit'}
          />
        </FormRow>
        <FormRow className="gap-2">
          <Text>Cognome*</Text>
          <TextField
            ref={surnameFieldRef}
            placeholder="Inserisci il tuo cognome"
            maxLength={20}
            onChangeText={(surname) => setUserAttempt({ ...userAttempt, surname })}
            errorMessage={userAttempt.error}
            value={userAttempt.surname}
            onSubmitEditing={() => {
              gradeFieldRef?.current?.focus();
            }}
            returnKeyType="next"
            submitBehavior={'submit'}
          />
        </FormRow>
        <FormRow className="gap-2">
          <Text>Classe*</Text>
          <TextField
            ref={gradeFieldRef}
            placeholder="Inserisci la tua classe"
            maxLength={5}
            onChangeText={(grade) => setUserAttempt({ ...userAttempt, grade })}
            errorMessage={userAttempt.error}
            value={userAttempt.grade}
          />
        </FormRow>

        {userAttempt.error && <Text className="text-destructive">{userAttempt.error}</Text>}

        <View className="mt-6">
          <Button onPress={handleEnter} disabled={isLoading || !!userAttempt.error}>
            {isLoading ? <ActivityIndicator /> : <Text>Entra</Text>}
          </Button>
        </View>
      </FormBlock>
    </View>
  );
};

const OperatorWelcome = () => {
  const { colors } = useColorScheme();

  const { login, isLoading, error } = useAuthStore();

  const [userAttempt, setUserAttempt] = useState({
    email: '',
    password: '',
    error: error || '',
  });

  const [hidePass, setHidePass] = useState(true);

  const passwordFieldRef = useRef<TextFieldRef>(null);

  const handleEnter = () => {
    if (!userAttempt.email || !userAttempt.password) {
      setUserAttempt({ ...userAttempt, error: 'Inserire i campi obbligatori *' });
      return;
    }

    login(userAttempt.email, userAttempt.password);
  };

  useEffect(() => {
    if (userAttempt.email && userAttempt.password) {
      setUserAttempt({ ...userAttempt, error: '' });
    }
  }, [userAttempt.email, userAttempt.password]);

  return (
    <View className="flex-1">
      <View className="items-center">
        <Text variant={'heading'}>Benvenuto!</Text>

        <Text weight={'light'} color={'muted'} className="text-center">
          Pronto a monitorare i tuoi prestiti dei libri?
        </Text>
      </View>

      <FormBlock className="gap-6 px-4 pt-8">
        <FormRow className="gap-2">
          <Text>Email*</Text>
          <TextField
            placeholder="Inserisci la tua email"
            onChangeText={(email) => setUserAttempt({ ...userAttempt, email })}
            maxLength={50}
            inputMode="email"
            autoComplete="email"
            errorMessage={userAttempt.error}
            value={userAttempt.email}
            onSubmitEditing={() => {
              passwordFieldRef?.current?.focus();
            }}
            returnKeyType="next"
            submitBehavior={'submit'}
          />
        </FormRow>

        <FormRow className="gap-2">
          <Text>Password*</Text>
          <TextField
            ref={passwordFieldRef}
            placeholder="Inserisci la tua password"
            onChangeText={(password) => setUserAttempt({ ...userAttempt, password })}
            maxLength={256}
            autoComplete="password"
            secureTextEntry={hidePass}
            errorMessage={userAttempt.error}
            value={userAttempt.password}
            materialHideActionIcons={true}
            rightView={
              <Pressable className="mr-4 justify-center" onPress={() => setHidePass(!hidePass)}>
                <Icon
                  name={hidePass ? 'eye' : 'eye-off'}
                  color={colors.grey2}
                  type="MaterialCommunityIcons"
                />
              </Pressable>
            }
          />
        </FormRow>

        {/* <View className="flex-row justify-between">
          <View className="flex-row items-center  gap-3">
            <Checkbox
              defaultChecked={true}
              checked={userAttempt.remeberMe}
              onCheckedChange={(remeberMe) => setUserAttempt({ ...userAttempt, remeberMe })}
            />
            <Text>Ricordami</Text>
          </View>
        </View> */}

        {(error || userAttempt.error) && (
          <Text className="text-destructive">{error || userAttempt.error}</Text>
        )}

        <View className="mt-6">
          <Button onPress={handleEnter} disabled={isLoading || !!userAttempt.error}>
            {isLoading ? <ActivityIndicator /> : <Text>Accedi</Text>}
          </Button>
        </View>
      </FormBlock>
    </View>
  );
};

const Welcome = () => {
  const insets = useSafeAreaInsets();

  const [role, setRole] = useState<Membership['role']>('user');

  return (
    <SafeAreaView className="flex-1 p-4 px-6">
      <KeyboardAwareScrollView
        bottomOffset={8}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-12"
        contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <View className="h-24 w-full rounded-2xl bg-blue-200"></View>

        <View className="flex-1 gap-8">
          <ToggleGroup
            value={role}
            onChange={(value) => setRole(value as Membership['role'])}
            items={[
              {
                label: process.env.EXPO_PUBLIC_STUDENT_STRING ?? 'Membro',
                value: 'user',
                icon: {
                  name: 'account',
                  type: 'MaterialCommunityIcons',
                  size: 24,
                },
              },
              {
                label: process.env.EXPO_PUBLIC_LIBRARIAN_STRING ?? 'Operatore',
                value: 'staff',
                icon: {
                  name: 'supervisor-account',
                  size: 24,
                },
              },
            ]}
          />

          {role === 'user' && <MemberWelcome />}
          {role === 'staff' && <OperatorWelcome />}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Welcome;
