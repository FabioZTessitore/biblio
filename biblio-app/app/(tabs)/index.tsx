import { useState } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/Text';
import { useBookStore } from '~/store';
import { cn } from '~/lib/cn';
import { Icon } from '~/components/Icon';
// import { LinearGradient } from 'expo-linear-gradient';

const ListItem = ({ item, selected, onPress, onLongPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    onLongPress={onLongPress}
    activeOpacity={0.8}
    className={cn(selected ? 'bg-secondary' : 'bg-card', 'flex-1 rounded-2xl p-4')}>
    <View className="justify-center gap-6 rounded-lg">
      {/* Immagine e Valutazione */}
      <View className="gap-4">
        <View className="h-32 rounded-2xl bg-blue-900"></View>

        <View className="flex-row items-center gap-1">
          <Icon name="star" size={'label'} color="#ca8a04" />
          <Text variant="label">4,6</Text>
          {/*TODO: fix colors tailwind css 'muted'*/}
          <Text variant="label" className="color-gray-400">
            {'(+150 reviews)'}
          </Text>
        </View>
      </View>

      {/* Titolo e Autore */}
      <View className="gap-2">
        <Text variant="label" className="text-wrap">
          {item.title} Lorem ipsum dolor sit amet dwdwdwd fefwewe fewfwef fewfwef
        </Text>
        <Text variant="body" className="text-wrap text-gray-600">
          di {item.author}
        </Text>
      </View>

      {/* Disponibilità e CTA*/}
      <View className="flex-row items-center justify-between color-green-400">
        <View className="flex-row items-center gap-2">
          <Icon size={'label'} name="circle" color="#4ade80"></Icon>
          <Text
            variant={'label'}
            weight={'light'}
            style={{ includeFontPadding: false }}
            className="flex-shrink uppercase">
            Disponibile
          </Text>
        </View>
        <Button className="bg-orange-600">
          <Text>Aggiungi alla libreria</Text>
        </Button>
      </View>
    </View>
  </TouchableOpacity>
);

export default function Index() {
  const { books } = useBookStore();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const isSelected = (id: string) => selectedItems.includes(id);

  const toggleSelect = (item: any) => {
    if (isSelected(item.id)) {
      setSelectedItems((prev) => prev.filter((i) => i !== item.id));
    } else {
      setSelectedItems((prev) => [...prev, item.id]);
    }
  };

  const handlePress = (item: any) => {
    if (selectedItems.length) toggleSelect(item);
    else console.log('Pressed:', item.title);
  };

  return (
    <SafeAreaView className="flex-1 gap-4 px-4">
      <Text variant="heading">Lista dei libri</Text>

      <View className="flex-1">
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-14"
          className="rounded-md py-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              selected={isSelected(item.id)}
              onPress={() => handlePress(item)}
              onLongPress={() => toggleSelect(item)}
            />
          )}
        />

        {/* <LinearGradient
          colors={['#050507', 'rgba(245,245,247,0)']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            zIndex: 10,
          }}
          pointerEvents="none"
        /> */}
      </View>
    </SafeAreaView>
  );
}
