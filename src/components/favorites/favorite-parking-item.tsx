import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {FavoriteParkingParkModel} from '~model/parking-park-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  item: FavoriteParkingParkModel;
  onRemovePress: () => void;
}

const FavoriteParkingItem: React.FC<Props> = memo(props => {
  const {item, onRemovePress} = props;
  const navigation = useNavigation<UseRootStackNavigation>();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate(ROUTE_KEY.ParkingDetails, {
          id: item?.parkId,
        });
      }}>
      <PaddingHorizontalWrapper containerStyles={styles.containerStyle} forDriveMe>
        <HStack
          style={{
            gap: widthScale1(10),
          }}>
          <View
            style={{
              flex: 1,
              gap: heightScale1(5),
            }}>
            <HStack style={{gap: widthScale1(4)}}>
              {item?.partnerName ? (
                <View
                  style={[
                    styles.parkingTicketWrapperStyle,
                    {
                      backgroundColor:
                        item?.partnerName === '주차권' ? colors.primary : colors.white,
                    },
                  ]}>
                  <CustomText
                    family={FONT_FAMILY.SEMI_BOLD}
                    size={FONT.CAPTION_4}
                    forDriveMe
                    string={item?.partnerName}
                    color={item?.partnerName === '주차권' ? colors.white : colors.primary}
                  />
                </View>
              ) : null}
              <CustomText
                forDriveMe
                size={FONT.SUB_HEAD}
                family={FONT_FAMILY.MEDIUM}
                string={item?.garageName}
                textStyle={{
                  flexShrink: 1,
                }}
              />
            </HStack>

            <CustomText
              size={FONT.CAPTION}
              color={colors.lineCancel}
              forDriveMe
              string={item?.fullAddr}
            />
          </View>

          <Pressable onPress={onRemovePress} hitSlop={40}>
            <Icons.StarFillBlack />
          </Pressable>
        </HStack>
      </PaddingHorizontalWrapper>
    </Pressable>
  );
});

export default FavoriteParkingItem;

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: PADDING1,
  },
  parkingTicketWrapperStyle: {
    borderWidth: scale1(1),
    paddingHorizontal: widthScale1(6),
    paddingVertical: heightScale1(4),
    borderRadius: scale1(4),
    borderColor: colors.primary,
    minHeight: heightScale1(23),
  },
});
