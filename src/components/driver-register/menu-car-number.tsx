import {StyleSheet, View} from 'react-native';
import React, {memo, useState} from 'react';
import {PADDING} from '~constants/constant';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import HStack from '~components/h-stack';
import Button from '~components/button';
import {strings} from '~constants/strings';
import CustomText from '~components/custom-text';
import {FONT} from '~constants/enum';

interface Props {}

const MenuCarNumber: React.FC<Props> = memo(props => {
  const {} = props;

  const [selectDefault, setDefault] = useState<boolean>(false);

  return (
    <View style={[styles.container, selectDefault ? {borderColor: colors.primary} : {}]}>
      <HStack style={{justifyContent: 'space-between'}}>
        <View>
          <CustomText string="12가1234" size={FONT.CAPTION_7} color={colors.menuTextColor} />
          <CustomText
            string={'소나타\u202221년식'}
            size={FONT.CAPTION_6}
            color={colors.grayText}
            textStyle={{paddingTop: heightScale(4)}}
          />
        </View>
        <Button
          text={strings.driver_register.choose}
          onPress={() => setDefault(true)}
          style={{
            borderRadius: widthScale(8),
            paddingHorizontal: widthScale(10),
            backgroundColor: selectDefault ? colors.primary : colors.white,
            borderColor: selectDefault ? colors.primary : colors.disableButton,
          }}
          textColor={selectDefault ? colors.white : colors.lineCancel}
        />
      </HStack>
    </View>
  );
});

export default MenuCarNumber;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    borderWidth: 1,
    borderRadius: widthScale(8),
    borderColor: colors.grayCheckBox,
  },
});
