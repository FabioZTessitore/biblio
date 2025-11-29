import { FlatList, View, Image, Pressable } from 'react-native';
import { Text, Icon } from '~/components/ui';
import { Book } from '~/store/book';
import { useUserStore } from '~/store';
import { Button } from '~/components/nativewindui/Button';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA, truncateText } from '~/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';

const BookLibrary = ({ item, onPress }: { item: Book; onPress: () => void }) => {
  const { colors } = useColorScheme();

  const imageSource = useMemo(
    () =>
      ({
        uri: `https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg`,
        // fallback: 'https://islandpress.org/files/default_book_cover_2015.jpg'
      }) satisfies ImageSourcePropType,
    []
  );

  return (
    <View className="flex-row justify-between gap-8 rounded-lg bg-card p-4 shadow-md">
      <View className="rounded-2xl">
        <Image
          resizeMode="cover"
          resizeMethod="resize"
          className="h-32 w-24 rounded-2xl"
          source={imageSource}></Image>
      </View>

      <View className="items-end justify-between">
        <View className="items-end gap-2">
          <Text>{truncateText(item.title, 20)}</Text>
          <Text variant={'label'} color={'muted'}>
            {truncateText(item.author, 20)}
          </Text>
          <View>
            <View className="flex-row items-center gap-2">
              <Icon
                size={'label'}
                name="circle"
                color={item.available ? colors.success : colors.destructive}></Icon>
              <Text
                weight={'light'}
                variant={'label'}
                style={{ includeFontPadding: false }}
                className="flex-shrink uppercase">
                {item.available ? 'Disponibile' : 'Non Disponibile'}
              </Text>
            </View>
          </View>
        </View>

        <Pressable className="flex-row items-center gap-2" onPress={onPress}>
          <Text variant={'label'} weight={'light'} className="text-destructive underline">
            Rimuovi
          </Text>
          {/* <Icon
            color={colors.destructive}
            type="MaterialCommunityIcons"
            name="minus-circle-outline"
          /> */}
        </Pressable>
      </View>
    </View>
  );
};

const Library = () => {
  const { colors } = useColorScheme();
  const { library, removeBookFromLibrary, isAuthenticated } = useUserStore();

  const handlePress = (item: Book) => {
    removeBookFromLibrary(item);
  };

  const loanRequest = () => {
    // Si dovrebbe fare una fetch dei libri al momento della richiesta del prestito
    // e aggiornarla con i libri in libreria
    if (library.some(({ available }) => !available)) {
      console.log('Uno o più libri non sono dispobili');
    } else {
      console.log('push to Form di nome, cognome, scuola, e classe');
    }
  };

  return (
    <View className="flex-1 px-4">
      <View className="flex-1">
        <FlatList
          data={library}
          ListEmptyComponent={() => (
            <View className="mt-28 flex-1 items-center gap-12">
              <Icon
                size={192}
                type="MaterialCommunityIcons"
                name="library-shelves"
                color={colors.primary}
              />
              <View className="items-center gap-6">
                <Text variant={'display'} className="text-center">
                  Libreria vuota
                </Text>
                <Text className="text-center">
                  Aggiungi i libri dalla lista dei libri e richeidi il prestito!
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerClassName="flex-grow gap-8 py-8"
          className="rounded-md"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookLibrary
              item={item}
              // selected={isSelected(item.id)}
              onPress={() => handlePress(item)}
            />
          )}
        />

        <LinearGradient
          colors={[colors.background, convertToRGBA(colors.background, 0)]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            zIndex: 10,
          }}
          pointerEvents="none"
        />
      </View>

      {!isAuthenticated && library.length > 0 && (
        <View className="p-6">
          <Button className="py-4" onPress={loanRequest}>
            <Text>Richiedi Prestito</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default Library;
