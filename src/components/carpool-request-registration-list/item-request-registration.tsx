import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AppModal from '~components/app-modal';
import CustomButton from '~components/commons/custom-button';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useDeleteMyRouteMutation} from '~services/passengerServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  item: DriverRoadDayModel;
  onDeletedItem?: () => void;
  viewMode?: boolean;
}

const ItemRequestRegistration = (props: Props) => {
  const {item, onDeletedItem, viewMode = false} = props;

  const navigation = useNavigation<UseRootStackNavigation>();

  const [deleteRoute, {isLoading}] = useDeleteMyRouteMutation();
  const {userID} = userHook();

  const handleDeleteRoute = useCallback(() => {
    AppModal.show({
      isTwoButton: true,
      title: '등록된 운행내역을 삭제하시겠습니까?',
      content: '삭제된 운행 등록내역은 복구 불가합니다.',
      textNo: '닫기',
      textYes: '삭제',
      yesFunc: () => {
        deleteRoute({
          c_memberId: userID as number,
          id: item?.id,
        })
          .unwrap()
          .then(res => {
            if (res !== '200') {
              showMessage({
                message: strings.general_text?.please_try_again,
              });
              return;
            }

            onDeletedItem && onDeletedItem();
          });
      },
    });
  }, [item]);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(ROUTE_KEY.CarpoolRequestDetail, {
          item: item,
        })
      }
      style={styles.containerStyle}>
      <HStack
        style={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        <View style={{gap: heightScale1(10)}}>
          <HStack style={styles.headerStyle}>
            <RouteBadge type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />
            <CustomText
              forDriveMe
              size={FONT.CAPTION_7}
              family={FONT_FAMILY.SEMI_BOLD}
              string={item?.state === 'E' ? '예약완료' : '요청완료'}
              color={colors.heavyGray}
            />
          </HStack>
          <CustomText
            forDriveMe
            size={FONT.BODY}
            family={FONT_FAMILY.SEMI_BOLD}
            string={item?.selectDay}
          />
        </View>

        {viewMode ? null : (
          <CustomButton
            buttonStyle={styles.deleteButtonStyle}
            type="TERTIARY"
            outLine
            text="삭제"
            buttonHeight={38}
            borderRadiusValue={6}
            textSize={FONT.CAPTION_6}
            onPress={handleDeleteRoute}
            isLoading={isLoading}
          />
        )}
      </HStack>

      <RoutePlanner
        timeStart={item?.startTime}
        timeArrive={item?.endTime}
        arriveAddress={item?.endPlace}
        startAddress={item?.startPlace}
        isParking={!!item?.endParkId}
        isParkingFrom={!!item?.startParkId}
      />

      <InfoPriceRoute
        price={item?.price}
        onPress={() =>
          navigation.navigate(ROUTE_KEY.CarpoolRequestDetail, {
            item: item,
          })
        }
      />
    </Pressable>
  );
};

export default memo(ItemRequestRegistration);

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    gap: heightScale1(20),
  },
  headerStyle: {
    gap: widthScale1(10),
  },
  deleteButtonStyle: {
    paddingHorizontal: widthScale1(10),
    minWidth: widthScale1(45),
  },
});
