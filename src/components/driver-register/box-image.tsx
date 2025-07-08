import {Image, View} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {ImageProps} from '~constants/types';

interface Props {
  text: string;
  image: ImageProps;
  width: number;
  height: number;
}

const BoxImage: React.FC<Props> = memo(props => {
  const {text, image, width, height} = props;
  return (
    <View
      style={{
        width: widthScale(width),
        height: heightScale(height),
      }}>
      {/* <FastImage source={{uri: image}} />  */}
      <Image source={image} style={{width: widthScale(width), height: heightScale(height)}} />
      <CustomText string={text} textStyle={{paddingTop: heightScale(6), alignSelf: 'center'}} />
    </View>
  );
});

export default BoxImage;
