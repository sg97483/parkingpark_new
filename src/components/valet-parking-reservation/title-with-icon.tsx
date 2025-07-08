import {StyleSheet} from 'react-native';
import React, {memo} from 'react';
import HStack from '~components/h-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {FONT} from '~constants/enum';

interface Props {
  title: string;
  subTitle?: string;
}

const TitleWithIcon: React.FC<Props> = memo(props => {
  const {title, subTitle} = props;
  return (
    <HStack style={styles.menuViewWrapper}>
      <Icon name="chevron-right-circle-outline" size={widthScale(25)} color={colors.blue} />
      <CustomText
        string={title}
        textStyle={{
          marginHorizontal: PADDING / 2,
        }}
      />
      {subTitle && <CustomText string={subTitle} color={colors.blue} size={FONT.CAPTION_2} />}
    </HStack>
  );
});
export default TitleWithIcon;

const styles = StyleSheet.create({
  menuViewWrapper: {
    paddingHorizontal: PADDING,
    marginVertical: PADDING / 2,
  },
});
