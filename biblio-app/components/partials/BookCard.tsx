import { View, Image } from 'react-native';
import { Text, Icon } from '~/components/ui';
import { Book } from '~/store/book';
import { cn } from '~/lib/cn';
import { Button } from '~/components/nativewindui/Button';
import { useColorScheme } from '~/lib/useColorScheme';

interface BookCardProps {
  item: Book;
  selected?: boolean;
  onPress: () => void;
}

const BookCard = ({ item, selected, onPress }: BookCardProps) => {
  const { colors } = useColorScheme();

  return (
    <View className={'flex-1 rounded-2xl bg-card p-4'}>
      <View className="justify-center gap-6 rounded-lg">
        {/* Immagine e Valutazione */}
        <View className="gap-4">
          <Image
            className="h-32 rounded-2xl"
            resizeMethod="resize"
            resizeMode="cover"
            source={{
              uri: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww',
            }}></Image>

          <View className="flex-row items-center gap-1">
            <Icon name="star" size={'body'} color="#ca8a04" />
            <Text variant="label">4,6</Text>
            {/*TODO: fix colors tailwind css 'muted'*/}
            <Text variant="label" color={'muted'}>
              {'(+150 reviews)'}
            </Text>
          </View>
        </View>

        {/* Titolo e Autore */}
        <View className="gap-2">
          <Text>{item.title}</Text>
          <Text variant="label" color={'muted'}>
            di {item.author}
          </Text>
        </View>

        {/* Disponibilità e CTA*/}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Icon
              size={'label'}
              name="circle"
              color={item.availbale ? '#4ade80' : '#BC2F2F'}></Icon>
            <Text
              weight={'light'}
              style={{ includeFontPadding: false }}
              className="flex-shrink uppercase">
              {item.availbale ? 'Disponibile' : 'Non Disponibile'}
            </Text>
          </View>
          {selected ? (
            <Button className="bg-transparent">
              <Text className="text-success">{'Aggiunto'}</Text>
            </Button>
          ) : (
            <Button
              android_ripple={{ foreground: true, color: '#ffffff30' }}
              onPress={onPress}
              className={'bg-secondary'}>
              <Icon size={'body'} name="add" />
              <Text>{'Libreria'}</Text>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export { BookCard };
