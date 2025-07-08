import {useNavigation} from '@react-navigation/native';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  memo, // React.memo를 사용하기 위해 memo도 import합니다.
} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import FloatingButton from '~components/commons/floating-button';
import IconButton from '~components/commons/icon-button';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {CarpoolPayHistoryModel} from '~model/passenger-model'; // 이 타입이 정확히 어디서 오는지 확인 필요
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

// Props 인터페이스는 동일하게 유지합니다.
interface Props {
  onViewListPress: (isVisible: boolean) => void;
  onBackToMyLocationPress: () => void;
  haveAReservationIsRunning?: CarpoolPayHistoryModel | undefined;
}

// Ref를 통해 노출할 함수들의 타입을 정의합니다.
export interface MapFooterRefs {
  setShowReturnLocationButton: (value: boolean) => void;
  // 필요하다면 다른 함수들도 여기에 추가할 수 있습니다.
}

// 컴포넌트 이름을 _MapFooter와 같이 내부용으로 변경하거나,
// 바로 MapFooter로 사용해도 되지만, 명확성을 위해 내부용 이름을 사용 후 memo로 감싸겠습니다.
const _MapFooter = forwardRef<MapFooterRefs, Props>((props, ref) => {
  const {onViewListPress, onBackToMyLocationPress, haveAReservationIsRunning} = props;
  const navigation = useNavigation<UseRootStackNavigation>();

  const [showList, setShowList] = useState<boolean>(false);
  const [showReturnButton, setShowReturnButton] = useState<boolean>(true);

  const handleChangeMode = useCallback(() => {
    setShowList((prevValue: boolean) => {
      const newShowListState = !prevValue;
      onViewListPress(newShowListState); // props로 받은 함수 호출
      return newShowListState;
    });
  }, [onViewListPress]); // props로 받은 함수를 의존성 배열에 추가

  const setShowReturnLocationButton = useCallback((value: boolean) => {
    setShowReturnButton(value);
  }, []); // 이 함수의 의존성은 비어있어도 괜찮습니다. setShowReturnButton은 안정적입니다.

  // useImperativeHandle을 사용하여 부모 컴포넌트에서 ref를 통해 호출할 수 있는 함수들을 정의합니다.
  useImperativeHandle(
    ref,
    () => ({
      setShowReturnLocationButton,
    }),
    [setShowReturnLocationButton], // setShowReturnLocationButton이 useCallback으로 메모이즈되었으므로 의존성 배열에 포함
  );

  return (
    <View style={styles.containerStyle}>
      <HStack style={styles.buttonsWrapperStyle}>
        {/* Return my location */}
        {showReturnButton ? (
          <IconButton icon={<Icons.Location />} onPress={onBackToMyLocationPress} />
        ) : (
          // this view used to align View Map/List center
          <View style={{width: widthScale1(40)}} />
        )}

        {/* View Map/List */}
        <FloatingButton
          onPress={handleChangeMode}
          iconPosition="left"
          icon={showList ? <Icons.Marker /> : <Icons.List />}
          text={showList ? '지도보기' : '리스트보기'}
          iconSize={24}
        />

        {/* This view is used to align View Map/List center, mirroring the one for Location button */}
        <View style={{width: widthScale1(40)}} />
      </HStack>

      {haveAReservationIsRunning ? (
        <FloatingButton
          type="black"
          icon={<Icons.ChevronRight />}
          iconPosition={'right'}
          text="이용에 문제가 있으신가요?"
          onPress={() => {
            navigation.navigate(ROUTE_KEY?.ReportDriverStep1, {
              driverID: haveAReservationIsRunning?.d_memberId,
              routeID: haveAReservationIsRunning?.id,
              driverName: haveAReservationIsRunning?.nic,
            });
          }}
        />
      ) : null}
    </View>
  );
});

// React.memo로 감싸서 export 합니다.
// displayName을 설정해주면 디버깅 시 컴포넌트 이름을 명확히 볼 수 있습니다.
_MapFooter.displayName = 'MapFooter';
export default memo(_MapFooter);

const styles = StyleSheet.create({
  containerStyle: {
    position: 'absolute',
    bottom: heightScale1(20),
    paddingHorizontal: PADDING1,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
    gap: PADDING1, // gap prop이 View에서 지원되는지 확인 필요 (최신 React Native는 지원)
    // 지원하지 않는다면, 요소들 사이에 margin을 주는 방식으로 변경해야 할 수 있습니다.
  },
  buttonsWrapperStyle: {
    justifyContent: 'space-between',
    width: '100%',
  },
});
