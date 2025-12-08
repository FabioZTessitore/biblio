import { View, TouchableOpacity, Alert } from 'react-native';
import { Text } from '~/components/ui';
import { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView, KeyboardGestureArea } from 'react-native-keyboard-controller';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { TextField } from '~/components/nativewindui/TextField';
import { Button } from '~/components/nativewindui/Button';
import Toast from 'react-native-toast-message';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { Loans, Requests } from '~/components';

const Reservation = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View className="flex-1 gap-4 px-4">
      <SegmentedControl
        values={['Presiti', 'Richieste']}
        selectedIndex={selectedIndex}
        onIndexChange={(index) => {
          setSelectedIndex(index);
        }}
      />

      {selectedIndex === 0 && <Loans />}
      {selectedIndex === 1 && <Requests />}
    </View>
  );
};

export default Reservation;
