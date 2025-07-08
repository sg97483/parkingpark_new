import React, {ReactNode, memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import {FONT} from '~constants/enum';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  image: ReactNode;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const InsuranceCompanyCard: React.FC<Props> = memo(props => {
  const {image, onPress, containerStyle = {}} = props;

  return (
    <View style={[styles.container, containerStyle]}>
      {React.cloneElement(image as any, {
        style: {
          alignSelf: 'center',
        },
      })}

      <CustomButton
        type="TERTIARY"
        text={strings.driver_register.choose}
        onPress={onPress}
        borderRadiusValue={6}
        buttonHeight={38}
        textSize={FONT.CAPTION_6}
      />
    </View>
  );
});

export default InsuranceCompanyCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: widthScale1(8),
    borderColor: colors.borderDashed,
    flex: 1,
    padding: widthScale1(14),
    gap: heightScale1(10),
    marginBottom: heightScale1(10),
  },
});
