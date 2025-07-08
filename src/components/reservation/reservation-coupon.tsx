import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import {CouponProps} from '~constants/types';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT} from '~constants/enum';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {Menu} from 'react-native-paper';

interface Props {
  data: CouponProps[];
  onPress: (value: CouponProps) => void;
}

const ReservationCoupon: React.FC<Props> = memo(props => {
  const {data, onPress} = props;

  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = useState<string>('쿠폰을 선택해주세요.');

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <HStack
      style={{
        marginBottom: PADDING,
      }}>
      <View
        style={{
          width: widthScale(70),
        }}>
        <CustomText string="쿠폰사용" />
      </View>
      <View style={{flex: 1}}>
        {data?.length ? (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu} style={styles.blankBox}>
                <CustomText string={title} size={FONT.CAPTION} />
              </TouchableOpacity>
            }>
            {data?.map((item, index) => {
              return (
                <Menu.Item
                  key={index}
                  onPress={() => {
                    setTitle(`${item?.c_name}/할인금액: ${item?.c_price}`);
                    onPress && onPress(item);
                    closeMenu();
                  }}
                  title={`${item?.c_name}/할인금액: ${item?.c_price}`}
                />
              );
            })}
          </Menu>
        ) : (
          <View style={styles.blankBox}>
            <CustomText string="쿠폰없음" size={FONT.CAPTION} />
          </View>
        )}
      </View>
    </HStack>
  );
});

export default ReservationCoupon;

const styles = StyleSheet.create({
  title: {
    width: widthScale(70),
  },
  blankBox: {
    borderWidth: 1.7,
    width: widthScale(170),
    minHeight: heightScale(30),
    justifyContent: 'center',
    borderRadius: widthScale(5),
    borderColor: colors.gray,
    paddingHorizontal: widthScale(5),
    height: heightScale(50),
  },
});
