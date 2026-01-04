import React from 'react';
import { View } from 'react-native';
import { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';
import { InputField } from '~/components/nativewindui/InputField';

// Configurazione per Toast
export const toastConfig = {
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        backgroundColor: '#F0F8F5',
        marginTop: 20,
        top: 30,
        minHeight: 100, // Imposta un'altezza minima
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 15, // Aumenta il padding verticale
        flexShrink: 1,
        flexGrow: 1, // Permette al contenuto di espandersi
      }}
      text1Style={{
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'PoppinsSemiBold',
        flexWrap: 'wrap',
      }}
      text2Style={{
        fontSize: 16,
        color: '#555',
        fontFamily: 'PoppinsRegular',
        flexWrap: 'wrap',
      }}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
    />
  ),
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'red',
        backgroundColor: '#FDECEC',
        top: 50,
        minHeight: 100, // Imposta un'altezza minima
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 15, // Aumenta il padding verticale
        flexShrink: 1,
        flexGrow: 1, // Permette al contenuto di espandersi
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
        flexWrap: 'wrap',
      }}
      text2Style={{
        fontSize: 14,
        color: '#555',
        fontFamily: 'Poppins-Regular',
        flexWrap: 'wrap',
      }}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
    />
  ),
  customToast: ({ text1, text2 }: { text1: string; text2: string }) => (
    <View
      style={{
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        top: 50,
        minHeight: 100, // Imposta un'altezza minima
        flexShrink: 1,
        flexGrow: 1, // Permette al contenuto di espandersi
      }}>
      <InputField
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#fff',
          flexWrap: 'wrap',
        }}>
        {text1}
      </InputField>
      <InputField style={{ fontSize: 14, color: '#ddd', flexWrap: 'wrap' }}>{text2}</InputField>
    </View>
  ),
};
