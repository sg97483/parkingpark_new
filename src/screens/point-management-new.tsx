import React, {memo, useCallback, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import WebView from 'react-native-webview';
import {ICONS} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PointManagementItem from '~components/point-management-item';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const DATA = [
  {
    id: 1,
    title: '차량정보 입력',
    date: '2022.12.21',
    money: 1000,
    type: '충전',
  },
  {
    id: 2,
    title: '성수 무신사캠퍼스 주차장',
    date: '2022.12.21',
    money: -1000,
    type: '사용',
  },
];

const PointManagementNew = memo((props: RootStackScreenProps<'PointManagementNew'>) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const renderItem = useCallback(({item}: {item: any}) => {
    return <PointManagementItem item={item} />;
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text={strings.point_management.title} />

      <View style={styles.content}>
        <View style={styles.wrapper}>
          <CustomText string={strings.point_management.available} family={FONT_FAMILY.SEMI_BOLD} />
          <HStack style={{marginTop: heightScale(10)}}>
            <CustomText
              string="41,990 "
              color={colors.primary}
              family={FONT_FAMILY.BOLD}
              size={FONT.BODY}
            />
            <CustomText string={strings.general_text.won} />
          </HStack>
        </View>

        <HStack style={styles.buttonWrapper}>
          <TouchableOpacity style={{marginRight: PADDING}}>
            <HStack>
              <CustomText string={strings.usage_history.all} />
              <Image source={ICONS.arrow_down} style={styles.arrowDown} resizeMode="contain" />
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity>
            <HStack>
              <CustomText string={`12${strings.usage_history.month}`} />
              <Image source={ICONS.arrow_down} style={styles.arrowDown} resizeMode="contain" />
            </HStack>
          </TouchableOpacity>
        </HStack>

        <Divider style={styles.divider} />

        {/* <FlashList
            data={DATA}
            estimatedItemSize={200}
            renderItem={renderItem}
            contentContainerStyle={styles.flatlist}
          /> */}
      </View>
      <View style={{flex: 1}}>
        <WebView
          source={{
            uri: `http://cafe.wisemobile.kr/imobile/partner_list/point_list_view.php?mmid=${userToken?.id}`,
          }}
          onLoadEnd={() => setIsLoading(false)}
          originWhitelist={['*']}
        />

        {isLoading ? (
          <View style={styles.placeholderView}>
            <ActivityIndicator color={colors.red} />
          </View>
        ) : null}
      </View>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: PADDING / 2,
  },
  wrapper: {
    backgroundColor: colors.lightGray,
    padding: PADDING,
    borderRadius: widthScale(10),
    marginTop: PADDING_HEIGHT,
  },
  buttonWrapper: {
    alignSelf: 'flex-end',
    marginRight: PADDING,
    marginTop: PADDING_HEIGHT,
  },
  arrowDown: {
    width: widthScale(24),
    height: heightScale(24),
  },
  divider: {
    marginTop: PADDING_HEIGHT,
  },
  flatlist: {
    paddingHorizontal: PADDING / 2,
    paddingBottom: PADDING_HEIGHT,
  },
  placeholderView: {
    flex: 1,
    position: 'absolute',
    backgroundColor: colors.white,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
});

export default PointManagementNew;
