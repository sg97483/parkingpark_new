import React, {memo, useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {PADDING1, WIDTH} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  isLock?: boolean;
  carImages: string[];
}

const VehicleInformation: React.FC<Props> = memo(props => {
  const {isLock, carImages} = props;

  const renderIconLock = useMemo(
    () => (
      <>
        {!!isLock && (
          <Icons.Lock width={widthScale1(25)} height={widthScale1(25)} style={styles.lock} />
        )}
      </>
    ),
    [isLock],
  );

  return (
    <View style={styles.view}>
      <CustomText
        family={FONT_FAMILY.SEMI_BOLD}
        size={FONT.BODY}
        string="차량사진"
        textStyle={styles.title}
        forDriveMe
      />
      <View style={styles.view1}>
        <View>
          <View style={styles.viewImage}>
            {carImages[0] && (
              <Image
                blurRadius={isLock ? 40 : 0}
                style={styles.image}
                source={{uri: carImages[0]}}
              />
            )}
            {renderIconLock}
          </View>
          <CustomText
            forDriveMe
            textStyle={styles.textImage}
            string="차량앞면"
            family={FONT_FAMILY.MEDIUM}
          />
        </View>
        <View>
          <View style={styles.viewImage}>
            {carImages[1] && (
              <Image
                blurRadius={isLock ? 40 : 0}
                style={styles.image}
                source={{uri: carImages[1]}}
              />
            )}
            {renderIconLock}
          </View>
          <CustomText
            forDriveMe
            textStyle={styles.textImage}
            string="차량뒷면"
            family={FONT_FAMILY.MEDIUM}
          />
        </View>
      </View>
      <View style={styles.view2}>
        <View>
          <View style={styles.viewImage}>
            {carImages[2] && (
              <Image
                blurRadius={isLock ? 40 : 0}
                style={styles.image}
                source={{uri: carImages[2]}}
              />
            )}
            {renderIconLock}
          </View>
          <CustomText
            forDriveMe
            textStyle={styles.textImage}
            string="차량측면"
            family={FONT_FAMILY.MEDIUM}
          />
        </View>
        <View>
          <View style={styles.viewImage}>
            {carImages[3] && (
              <Image
                blurRadius={isLock ? 40 : 0}
                style={styles.image}
                source={{uri: carImages[3]}}
              />
            )}

            {renderIconLock}
          </View>
          <CustomText
            forDriveMe
            textStyle={styles.textImage}
            string="차량내부"
            family={FONT_FAMILY.MEDIUM}
          />
        </View>
      </View>
    </View>
  );
});

export default memo(VehicleInformation);

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: PADDING1,
  },
  title: {
    marginBottom: PADDING1,
  },
  image: {
    width: (WIDTH - widthScale1(60)) / 2,
    aspectRatio: 1,
    borderRadius: 4,
  },
  textImage: {
    marginTop: heightScale1(10),
    textAlign: 'center',
  },
  view1: {flexDirection: 'row', justifyContent: 'space-between'},
  view2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightScale1(20),
  },
  viewImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lock: {
    position: 'absolute',
  },
});
