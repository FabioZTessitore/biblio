import React, { useState, useEffect, useMemo } from 'react';
import { Image, ImageBackground, ImageSourcePropType, ImageProps, View } from 'react-native';

interface BookImageProps extends Omit<ImageProps, 'source'> {
  isbn?: string;
  defaultUri?: string;
  withBackground?: boolean; // se true, usa ImageBackground
  overlayColor?: string; // colore overlay, default semi-nero
}

const BookImage = ({
  isbn,
  defaultUri,
  withBackground = false,
  overlayColor = '#000000AF',
  style,
  ...props
}: BookImageProps) => {
  const [imageError, setImageError] = useState(false);

  const imageSource: ImageSourcePropType = useMemo(
    () => ({
      uri:
        imageError || !isbn
          ? (defaultUri ?? 'https://islandpress.org/files/default_book_cover_2015.jpg')
          : `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
    }),
    [isbn, imageError, defaultUri]
  );

  useEffect(() => {
    setImageError(false); // reset se cambia l'ISBN
  }, [isbn]);

  const ImageContent = (
    <Image
      {...props}
      style={style}
      source={imageSource}
      onLoad={(e) => {
        const { width, height } = e.nativeEvent.source;
        if (width === 1 && height === 1) setImageError(true);
        if (props.onLoad) props.onLoad(e);
      }}
      onError={() => setImageError(true)}
    />
  );

  if (withBackground) {
    return (
      <ImageBackground
        source={imageSource}
        resizeMode="stretch"
        style={style}
        className="rounded-2xl"
        imageClassName="rounded-2xl"
        imageStyle={style} // mantiene borderRadius
      >
        <View style={[style, { backgroundColor: overlayColor }]} className="rounded-2xl">
          {ImageContent}
        </View>
      </ImageBackground>
    );
  }

  return ImageContent;
};

export { BookImage };
