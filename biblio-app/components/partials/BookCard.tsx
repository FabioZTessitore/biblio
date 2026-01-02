import { View, Image, ImageBackground, ImageSourcePropType } from 'react-native';
import { Text, Icon } from '~/components/ui';
import { Book } from '~/store/biblio';
import { Button } from '~/components/nativewindui/Button';
// import { useColorScheme } from '~/lib/useColorScheme';
import { useUserStore } from '~/store';
import { memo, useMemo } from 'react';

interface BookCardProps {
  item: Book;
  selected?: boolean;
  onPress: () => void;
}

const StaffCTA = ({ onPress }: Partial<BookCardProps>) => (
  <Button
    android_ripple={{ foreground: true, color: '#ffffff30' }}
    onPress={onPress}
    className={'bg-secondary'}>
    <Icon size={'body'} type="MaterialCommunityIcons" name="pencil" />
    <Text>{'Modifica'}</Text>
  </Button>
);

const UserCTA = ({ selected, onPress }: Partial<BookCardProps>) =>
  selected ? (
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
  );

const BookCard = memo(({ item, selected, onPress }: BookCardProps) => {
  // const { colors } = useColorScheme();

  const { membership } = useUserStore();

  const imageSource = useMemo(
    () =>
      ({
        uri: `https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg`,
        // fallback: 'https://islandpress.org/files/default_book_cover_2015.jpg'
      }) satisfies ImageSourcePropType,
    []
  );

  return (
    <View className={'rounded-2xl bg-card p-4'}>
      <View className="justify-center gap-6 rounded-lg">
        {/* Immagine e Valutazione */}
        <View className="gap-4">
          <ImageBackground
            source={imageSource}
            resizeMode="stretch"
            imageClassName="rounded-2xl"
            className="rounded-2xl ">
            <View className="rounded-2xl bg-[#000000AF]">
              <Image
                className="h-32 rounded-2xl"
                resizeMethod="resize"
                resizeMode="contain"
                source={imageSource}
              />
            </View>
          </ImageBackground>
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
              color={item.available ? '#4ade80' : '#BC2F2F'}></Icon>
            <Text
              weight={'light'}
              style={{ includeFontPadding: false }}
              className="flex-shrink uppercase">
              {item.available ? 'Disponibile' : 'Non Disponibile'}
            </Text>
          </View>

          {/* Call To Actions */}
          {membership.role === 'staff' ? (
            <StaffCTA onPress={onPress} />
          ) : (
            <UserCTA onPress={onPress} selected={selected} />
          )}
        </View>
      </View>
    </View>
  );
});

export { BookCard };
