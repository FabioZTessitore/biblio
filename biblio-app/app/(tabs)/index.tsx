import { View, FlatList } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/Text';
import { useBookStore, useUserStore } from '~/store';
import { Icon } from '~/components/Icon';
import { Book } from '~/store/book';
import { FiltersSheetModal } from '~/components/FiltersSheetModal';
// import { LinearGradient } from 'expo-linear-gradient';

const ListItem = ({
  item,
  selected,
  onPress,
}: {
  item: Book;
  selected?: boolean;
  onPress: () => void;
}) => (
  <View className={'flex-1 rounded-2xl bg-card p-4'}>
    <View className="justify-center gap-6 rounded-lg">
      {/* Immagine e Valutazione */}
      <View className="gap-4">
        <View className="h-32 rounded-2xl bg-blue-900"></View>

        <View className="flex-row items-center gap-1">
          <Icon name="star" size={'body'} color="#ca8a04" />
          <Text variant="label">4,6</Text>
          {/*TODO: fix colors tailwind css 'muted'*/}
          <Text variant="label" className="color-gray-400">
            {'(+150 reviews)'}
          </Text>
        </View>
      </View>

      {/* Titolo e Autore */}
      <View className="gap-2">
        <Text variant="body" className="text-wrap">
          {item.title} Lorem ipsum dolor sit amet dwdwdwd fefwewe fewfwef fewfwef
        </Text>
        <Text variant="label" className="text-wrap text-gray-600">
          di {item.author}
        </Text>
      </View>

      {/* Disponibilità e CTA*/}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon size={'label'} name="circle" color="#4ade80"></Icon>
          <Text
            weight={'light'}
            style={{ includeFontPadding: false }}
            className="flex-shrink uppercase">
            Disponibile
          </Text>
        </View>
        <Button
          android_ripple={{ foreground: true, color: '#fed7aa' }}
          onPress={onPress}
          className="bg-primary-test bg-orange-600">
          <Text>{selected ? 'Rimuovi' : '+ Libreria'}</Text>
        </Button>
      </View>
    </View>
  </View>
);

export default function Index() {
  const { books } = useBookStore();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handlePress = (item: Book) => {
    console.log('Pressed:', item.title);
  };

  // const isSelected = (id: string) => library.forEach((book) => book.id === id);

  return (
    <View className="flex-1 gap-4 px-4">
      {/* <View className="rounded-2xl bg-card">
        <SearchInput textContentType="none" autoComplete="off" />
      </View>
      <View className="flex-row">
        <View className="rounded-full bg-secondary px-2 py-1">
          <Text variant={'label'}>Aggiungin +</Text>
        </View>
      </View> */}

      <View className="flex-1">
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-14 py-8"
          className="rounded-md"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              // selected={isSelected(item.id)}
              onPress={() => handlePress(item)}
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

        <FiltersSheetModal />
      </View>
    </View>
  );
}
