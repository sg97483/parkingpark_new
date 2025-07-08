import {StyleSheet, TouchableOpacity, View, Modal, FlatList} from 'react-native';
import React, {memo, useState} from 'react';
import {CouponProps} from '~constants/types';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT} from '~constants/enum';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';

interface Props {
  data: CouponProps[];
  onPress: (value: CouponProps) => void;
}

const ReservationCarpoolCoupon: React.FC<Props> = memo(props => {
  const {data, onPress} = props;

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState<string>('쿠폰을 선택해주세요.');

  const openMenu = () => {
    console.log('Menu opened');
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        console.log('Coupon selected:', item);
        setTitle(`${item?.c_name}/할인금액: ${item?.c_price}`);
        onPress(item);
        closeMenu();
      }}
      style={styles.menuItem}>
      <CustomText string={`${item?.c_name}/할인금액: ${item?.c_price}`} size={FONT.CAPTION} />
    </TouchableOpacity>
  );

  return (
    <>
      <HStack style={{marginBottom: PADDING}}>
        <View style={{width: widthScale(70)}}>
          <CustomText string="쿠폰사용" />
        </View>
        <View style={{flex: 1}}>
          {data?.length ? (
            <TouchableOpacity onPress={openMenu} style={styles.blankBox}>
              <CustomText string={title} size={FONT.CAPTION} />
            </TouchableOpacity>
          ) : (
            <View style={styles.blankBox}>
              <CustomText string="쿠폰없음" size={FONT.CAPTION} />
            </View>
          )}
        </View>
      </HStack>
      <Modal transparent={true} visible={visible} onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu}>
          <View style={styles.menuContainer}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
});

export default ReservationCarpoolCoupon;

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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
});
