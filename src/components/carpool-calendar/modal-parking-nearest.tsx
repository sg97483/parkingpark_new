import {useNavigation} from '@react-navigation/native';
import React, {forwardRef, memo, Ref, useImperativeHandle, useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {makeCommaNumber} from '~utils/common';

export interface ModalParkingNearestRefs {
  show: (data: any) => void;
  hide: () => void;
}
interface Props {
  onPressHide?: () => void;
}

const ModalParkingNearest = forwardRef((props: Props, ref: Ref<ModalParkingNearestRefs>) => {
  const {onPressHide} = props;

  const [visible, setVisible] = useState(false);

  const [data, setData] = useState({onedayTicketCost: 0, garageName: '', id: 0});

  const navigation = useNavigation<UseRootStackNavigation>();

  useImperativeHandle(ref, () => ({show, hide}), []);

  const show = (data: any) => {
    setData(data);
    setVisible(true);
  };
  const hide = () => setVisible(false);

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      visible={visible}
      onDismiss={hide}
      transparent
      onRequestClose={hide}>
      <View style={styles.container}>
        <View style={styles.content}>
          <CustomText
            string={'등록한 목적지 근처에\n파킹박 제휴주차장이 있어요!\n주차장을 확인하시겠습니까?'}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
            lineHeight={heightScale1(25.2)}
            textStyle={{textAlign: 'center'}}
            forDriveMe
          />

          <View style={styles.viewPrice}>
            <View style={{gap: heightScale1(6)}}>
              <CustomText
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                size={FONT.CAPTION_6}
                string={data?.garageName}
                lineHeight={heightScale1(20)}
                color={colors.menuTextColor}
              />
              <CustomText
                forDriveMe
                family={FONT_FAMILY.REGULAR}
                size={FONT.CAPTION_6}
                string="평일 당일권"
                lineHeight={heightScale1(20)}
                color={colors.grayText}
              />
            </View>
            <CustomText
              forDriveMe
              lineHeight={heightScale1(20)}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_6}
              string={`${makeCommaNumber(data.onedayTicketCost)}원`}
              color={colors.menuTextColor}
            />
          </View>

          <CustomText
            forDriveMe
            lineHeight={heightScale1(20)}
            size={FONT.CAPTION_6}
            color={colors.grayText2}
            textStyle={{marginTop: heightScale1(6), textAlign: 'center'}}
            string={'파킹박을 통해 평균 60% 할인된 금액으로\n주차권을 구매하실수 있습니다.'}
          />
          <HStack style={styles.row}>
            <CustomButton
              buttonHeight={58}
              type="TERTIARY"
              onPress={() => {
                hide();
                onPressHide?.();
              }}
              text={'닫기'}
              buttonStyle={styles.leftButton}
            />

            <CustomButton
              buttonHeight={58}
              onPress={() => {
                hide();
                navigation.navigate(ROUTE_KEY.ParkingDetails, {id: data.id});
              }}
              text={'주차장 보기'}
              buttonStyle={styles.leftButton}
            />
          </HStack>
        </View>
      </View>
    </Modal>
  );
});

export default memo(ModalParkingNearest);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.modal,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: widthScale1(310),
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(20),
    borderRadius: widthScale1(8),
  },
  row: {
    marginTop: heightScale1(30),
    gap: widthScale1(10),
  },
  leftButton: {
    flex: 1,
  },
  viewPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: widthScale1(14),
    backgroundColor: colors.policy,
    borderRadius: 8,
    marginTop: heightScale1(20),
  },
});
