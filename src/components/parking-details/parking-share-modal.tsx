import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {PADDING, width} from '~constants/constant';
import {FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {heightScale, widthScale} from '~styles/scaling-utils';
import HStack from '~components/h-stack';
import {ICONS} from '~/assets/images-path';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Divider from '~components/divider';
import Share, {ShareSingleOptions} from 'react-native-share';
import {getNumberWithCommas} from '~utils/numberUtils';
import KakaoShareLink from 'react-native-kakao-share-link';
import {ParkingProps} from '~constants/types';

interface Props {
  parkignID: number;
  garagePrice: number;
  garageName: string;
  item: ParkingProps;
}

export interface ParkingShareModalRefs {
  show: () => void;
  hide: () => void;
}

const ParkingShareModal = forwardRef((props: Props, ref) => {
  const {parkignID, garagePrice, garageName, item} = props;

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [linkShare, setLinkShare] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  useEffect(() => {
    if (parkignID) {
      // 새로운 긴 딥링크 주소를 직접 생성합니다.
      const newLongLink = `https://cafe.wisemobile.kr/parking/${parkignID}`;
      setLinkShare(newLongLink);
      setIsLoading(false);
    }
  }, [parkignID]);

  const getAddress = (): string => {
    if (!item?.addressOld || item.addressOld.length == 0) {
      return `${item?.state} ${item?.city} ${item?.addressNew}`;
    } else {
      return `${item?.state} ${item?.city} ${item?.addressOld}`;
    }
  };

  const getGaragePrice = (): string => {
    const garagePrice = `${-item?.icon}`;
    const price_kind = Number(garagePrice?.substring(garagePrice?.length - 1));

    if (item?.ticketPartnerYN === IS_ACTIVE.YES) {
      switch (price_kind) {
        case 1:
          return `(3시간) ${getNumberWithCommas(-item?.icon - 1)} 원`;
        case 2:
          return `(6시간) ${getNumberWithCommas(-item?.icon - 2)} 원`;
        case 3:
          return `(종일권) ${getNumberWithCommas(-item?.icon - 3)} 원`;
        case 4:
          return `(월주차) ${getNumberWithCommas(-item?.icon - 4)} 원`;
        case 5:
          return `(2시간) ${getNumberWithCommas(-item?.icon - 5)} 원`;
        case 6:
          return `(4시간) ${getNumberWithCommas(-item?.icon - 6)} 원`;
        default:
          return '';
      }
    } else {
      return '';
    }
  };

  return (
    <ReactNativeModal
      onBackButtonPress={hide}
      onBackdropPress={hide}
      isVisible={isVisible}
      useNativeDriver={true}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <CustomText
            string="공유 방법을 선택해 주세요."
            color={colors.red}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </View>

        {/* KakaoTalk */}
        <TouchableOpacity
          onPress={async () => {
            try {
              await KakaoShareLink.sendFeed({
                content: {
                  title: `${garageName}\n${getGaragePrice()}`,
                  description: `${getAddress()}\n${item?.issue_text}`,
                  imageUrl:
                    item?.image1 || 'http://cafe.wisemobile.kr:8080/resources/parkImage/icon.png',
                  link: {
                    mobileWebUrl: linkShare,
                    webUrl: linkShare,
                  },
                },
                buttons: [],
              });
            } catch (e) {
              console.error(e);
            }
            hide();
          }}
          style={[styles.buttonWrapper, {marginTop: 0}]}>
          <HStack>
            <Image source={ICONS.kakaotalk_logo} style={styles.logo} />
            <CustomText string="카카오톡" />
          </HStack>
        </TouchableOpacity>
        <Divider />

        {/* Facebook */}
        <TouchableOpacity
          disabled={isLoading}
          onPress={async () => {
            const shareOptions: ShareSingleOptions = {
              url: linkShare,
              social: Share.Social.FACEBOOK,
            };

            Share.shareSingle(shareOptions)
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                err && console.log(err);
              });
          }}
          style={styles.buttonWrapper}>
          <HStack>
            <Image source={ICONS.facebook_logo} style={styles.logo} />
            <CustomText string="페이스북" />
          </HStack>
        </TouchableOpacity>
        <Divider />

        {/* Twitter */}
        {/*<TouchableOpacity
          disabled={isLoading}
          onPress={async () => {
            Share.shareSingle({
              social: Share.Social.TWITTER,
              message: IS_ANDROID
                ? ''
                : `주차비를 아끼는 앱, 파킹박\n${garageName}\n${getNumberWithCommas(
                    garagePrice
                  )}원`,
              url: IS_IOS
                ? linkShare
                : `주차비를 아끼는 앱, 파킹박\n${garageName}\n${getNumberWithCommas(
                    garagePrice
                  )}원\n${linkShare}`,
            });
          }}
          style={styles.buttonWrapper}>
          <HStack>
            <Image source={ICONS.twitter_logo} style={styles.logo} />
            <CustomText string="트위터" />
          </HStack>
        </TouchableOpacity>
        <Divider />*/}

        {/* Other */}
        <TouchableOpacity
          disabled={isLoading}
          onPress={async () => {
            await Share.open({
              message: '[파킹박]\n주차비를 아끼는 앱, 파킹박\n주차장 보러가기\n',
              url: linkShare,
            });
          }}
          style={styles.buttonWrapper}>
          <HStack>
            <View style={styles.logo}>
              <Icon name="dots-horizontal" color={colors.darkGray} size={widthScale(45)} />
            </View>
            <CustomText string="기타" />
          </HStack>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
});

export default ParkingShareModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: width * 0.8,
    alignSelf: 'center',
  },
  headerWrapper: {
    height: heightScale(45),
    justifyContent: 'center',
    paddingHorizontal: PADDING,
  },
  logo: {
    width: widthScale(45),
    height: widthScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: PADDING / 2,
    backgroundColor: colors.gray,
    borderRadius: widthScale(5),
  },
  buttonWrapper: {
    height: heightScale(50),
    justifyContent: 'center',
    paddingHorizontal: PADDING,
    marginVertical: heightScale(5),
  },
});
