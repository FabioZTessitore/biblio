import { View } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Icon } from '../ui';
import { useBiblioStore } from '~/store';

export default function AddBookBtn() {
  const { setBookModal } = useBiblioStore();

  return (
    <View className="absolute bottom-3 right-2 z-10">
      <Button className="rounded-2xl p-4" size={'none'} onPress={() => setBookModal(true)}>
        <Icon name="add" />
      </Button>
    </View>
  );
}
