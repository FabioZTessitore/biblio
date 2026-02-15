import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '~/components/nativewindui/Button';
import { Icon, Text, InputField, FormBlock, FormRow, ToggleGroup } from '~/components/ui';
import { useAuthStore } from '~/store';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useColorScheme } from '~/lib/useColorScheme';
import { useTranslation } from 'react-i18next';

const MemberWelcome = () => {
  const { loginAnonymously, isLoading } = useAuthStore();

  const { t } = useTranslation();

  const [userAttempt, setUserAttempt] = useState({
    schoolId: process.env.EXPO_PUBLIC_SCHOOL_ID, // TODO: da cambiare in prod, .env (??)
    name: '',
    surname: '',
    grade: '',
    error: '',
  });

  const surnameFieldRef = useRef<any>(null);
  const gradeFieldRef = useRef<any>(null);

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
      <View className="mt-4 items-center">
        <Text variant={'heading'}>{t('onboarding.title')}</Text>

        <Text weight={'light'} color={'muted'} className="text-center">
          {t('onboarding.title_sub')}
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
          <Text>{t('form_user.firstname')}*</Text>
          <InputField
            placeholder={t('form_user.firstname_placeholder')}
            onChangeText={(name) => setUserAttempt({ ...userAttempt, name })}
            maxLength={20}
            error={userAttempt.error}
            value={userAttempt.name}
            onSubmitEditing={() => {
              surnameFieldRef?.current?.focus();
            }}
            returnKeyType="next"
            submitBehavior={'submit'}
          />
        </FormRow>
        <FormRow className="gap-2">
          <Text>{t('form_user.lastname')}*</Text>
          <InputField
            ref={surnameFieldRef}
            placeholder={t('form_user.lastname_placeholder')}
            maxLength={20}
            onChangeText={(surname) => setUserAttempt({ ...userAttempt, surname })}
            error={userAttempt.error}
            value={userAttempt.surname}
            onSubmitEditing={() => {
              gradeFieldRef?.current?.focus();
            }}
            returnKeyType="next"
            submitBehavior={'submit'}
          />
        </FormRow>
        <FormRow className="gap-2">
          <Text>{t('form_user.class')}*</Text>
          <InputField
            ref={gradeFieldRef}
            placeholder={t('form_user.class_placeholder')}
            maxLength={5}
            onChangeText={(grade) => setUserAttempt({ ...userAttempt, grade })}
            error={userAttempt.error}
            value={userAttempt.grade}
          />
        </FormRow>

        {userAttempt.error && <Text className="text-destructive">{userAttempt.error}</Text>}

        <View className="mt-6">
          <Button onPress={handleEnter} disabled={isLoading || !!userAttempt.error}>
            {isLoading ? <ActivityIndicator /> : <Text>{t('form_user.submit')}</Text>}
          </Button>
        </View>
      </FormBlock>
    </View>
  );
};

const OperatorWelcome = () => {
  const { colors } = useColorScheme();

  const { t } = useTranslation();

  const { login, isLoading, error } = useAuthStore();

  const [userAttempt, setUserAttempt] = useState({
    email: '',
    password: '',
    error: error || '',
  });

  const [hidePass, setHidePass] = useState(true);

  const passwordFieldRef = useRef<any>(null);

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
      <View className="mt-4 items-center">
        <Text variant={'heading'}>{t('onboarding.title')}</Text>

        <Text weight={'light'} color={'muted'} className="text-center">
          {t('onboarding.biblio_sub')}
        </Text>
      </View>

      <FormBlock className="gap-6 px-4 pt-8">
        <FormRow className="gap-2">
          <Text>{t('form_user.email')}*</Text>
          <InputField
            placeholder={t('form_user.email_placeholder')}
            onChangeText={(email) => setUserAttempt({ ...userAttempt, email })}
            maxLength={50}
            inputMode="email"
            autoComplete="email"
            error={userAttempt.error}
            value={userAttempt.email}
            onSubmitEditing={() => {
              passwordFieldRef?.current?.focus();
            }}
            returnKeyType="next"
            submitBehavior={'submit'}
            autoCapitalize="none"
          />
        </FormRow>

        <FormRow className="gap-2">
          <Text>{t('form_user.password')}*</Text>
          <InputField
            ref={passwordFieldRef}
            placeholder={t('form_user.password_placeholder')}
            onChangeText={(password) => setUserAttempt({ ...userAttempt, password })}
            maxLength={256}
            autoComplete="password"
            secureTextEntry={hidePass}
            error={userAttempt.error}
            value={userAttempt.password}
            autoCapitalize="none"
            right={
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

        {(error || userAttempt.error) && (
          <Text className="text-destructive">{error || userAttempt.error}</Text>
        )}

        <View className="mt-6">
          <Button onPress={handleEnter} disabled={isLoading || !!userAttempt.error}>
            {isLoading ? <ActivityIndicator /> : <Text>{t('form_user.biblio_submit')}</Text>}
          </Button>
        </View>
      </FormBlock>
    </View>
  );
};

const Welcome = () => {
  const insets = useSafeAreaInsets();

  const { t } = useTranslation();

  const [isLibrarian, setIsLibrarian] = useState<boolean>(false);

  return (
    <SafeAreaView className="flex-1 p-4 px-6">
      <KeyboardAwareScrollView
        bottomOffset={8}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-12"
        contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <View className="flex-1 gap-8">
          {!isLibrarian && <MemberWelcome />}
          {isLibrarian && <OperatorWelcome />}

          <View className="h-px bg-muted"></View>

          <Pressable
            onPress={() => setIsLibrarian((v) => !v)}
            className="flex-row items-center justify-center gap-1">
            <Text> {isLibrarian ? t('welcome.student') : t('welcome.biblio')} </Text>
            <Text color={'primary'}>{t('welcome.submit')}</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Welcome;
