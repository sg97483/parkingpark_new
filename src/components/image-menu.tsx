import React, {memo, useState} from 'react';
import {Image, ImageSourcePropType, ImageStyle, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ICONS} from '~/assets/images-path';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';
import HStack from './h-stack';

interface Props {
  icon: ImageSourcePropType | undefined;
  name: string;
  onPress: () => void;
  iconStyle?: ImageStyle;
  disabled?: boolean;
  children?: {title: string; onPress?: () => void}[];
}

const ImageMenu: React.FC<Props> = memo(props => {
  const {icon, name, onPress, iconStyle, children, disabled = false} = props;
  const [isShowChildern, setIsShowChildern] = useState(false);

  const showChildern = () => {
    setIsShowChildern(!isShowChildern);
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity disabled={disabled} onPress={children ? showChildern : onPress}>
        <HStack style={styles.container}>
          <Image source={icon} style={[styles.icon, iconStyle]} resizeMode="contain" />
          <CustomText string={name} style={styles.textStyle} />
        </HStack>
      </TouchableOpacity>

      {isShowChildern && (
        <View style={styles.viewChildern}>
          {children?.map(e => (
            <TouchableOpacity key={JSON.stringify(e)} onPress={e?.onPress}>
              <HStack style={styles.container}>
                <Image
                  source={ICONS.icons8_plus_math}
                  style={styles.iconChildern}
                  resizeMode="contain"
                />
                <CustomText string={e.title} style={styles.textChildren} />
              </HStack>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
});

export default ImageMenu;

const styles = StyleSheet.create({
  icon: {
    width: widthScale(16),
    height: widthScale(16),
    padding: 18,
  },
  textStyle: {
    paddingLeft: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    paddingVertical: heightScale(6),
  },
  viewChildern: {
    marginLeft: widthScale(15),
  },
  iconChildern: {
    width: widthScale(28),
    height: widthScale(28),
    tintColor: colors.red,
  },
  textChildren: {
    paddingLeft: widthScale(5),
    flex: 1,
  },
});
