import {Image, Pressable, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {Icons} from '~/assets/svgs';
import {ImageProps} from '~constants/types';

interface Props {
  image?: ImageProps;
  onPress: () => void;
  lock?: boolean;
}

const CustomCarImage: React.FC<Props> = memo(props => {
  const {image, onPress, lock} = props;

  return (
    <>
      {image ? (
        <Pressable style={styles.imageContainer} onPress={onPress}>
          <Image
            source={image}
            style={{width: '100%', height: '100%'}}
            blurRadius={lock ? 200 : 0}
          />
          {lock && (
            <Icons.Lock
              style={styles.iconLock}
              stroke={colors.white}
              width={widthScale1(24)}
              height={heightScale1(24)}
            />
          )}
        </Pressable>
      ) : (
        <Pressable style={styles.container} onPress={onPress}>
          <Icons.Plus stroke={colors.lineInput} />
        </Pressable>
      )}
    </>
  );
});

export default CustomCarImage;

const styles = StyleSheet.create({
  container: {
    height: heightScale1(158),
    width: widthScale1(158),
    borderWidth: 1,
    borderColor: colors.borderDashed,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale1(4),
  },
  imageContainer: {
    height: heightScale1(158),
    width: widthScale1(158),
    borderRadius: widthScale1(4),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLock: {
    position: 'absolute',
  },
});
