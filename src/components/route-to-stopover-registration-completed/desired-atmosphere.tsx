import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {generateRandomId} from '~utils/encrypt';

interface Props {
  data: string[];
}

const DesiredAtmosphere = (props: Props) => {
  const {data} = props;

  return (
    <View style={styles.view}>
      <CustomText
        forDriveMe
        family={FONT_FAMILY.SEMI_BOLD}
        size={FONT.BODY}
        string="원하는 분위기"
        textStyle={styles.title}
      />
      <View style={styles.viewText}>
        {data?.map(item => (
          <View key={generateRandomId()} style={styles.button}>
            <CustomText forDriveMe color={colors.menuTextColor} string={item} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default memo(DesiredAtmosphere);
const styles = StyleSheet.create({
  title: {
    marginBottom: heightScale(20),
  },
  view: {
    paddingHorizontal: PADDING,
    marginTop: heightScale(30),
  },
  button: {
    paddingHorizontal: widthScale(14),
    paddingVertical: heightScale(6),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.disableButton,
    marginRight: widthScale(10),
    marginBottom: widthScale(10),
  },
  viewText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: heightScale(20),
  },
});
