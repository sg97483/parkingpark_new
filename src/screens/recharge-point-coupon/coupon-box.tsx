import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import WebView from 'react-native-webview';
import Button from '~components/button';
import CouponItem from '~components/coupon-management/coupon-item';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import Spinner from '~components/spinner';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {CouponProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {useGetListCouponQuery} from '~services/couponServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const CouponBox = memo((props: RootStackScreenProps<'CouponBox'>) => {
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [couponCode, setCouponCode] = useState<string>('');
  const [showWebview, setShowWebview] = useState<boolean>(false);

  const {data, refetch} = useGetListCouponQuery({
    id: userToken?.id,
    pass: userToken?.password,
  });

  const handleAddCoupon = () => {
    Spinner.show();
    setShowWebview(true);
  };

  const renderItem = useCallback(({item}: {item: CouponProps}) => {
    return <CouponItem item={item} />;
  }, []);

  return (
    <FixedContainer>
      <CustomHeader text={strings.coupon_box.title} />

      <View style={styles.content}>
        <CustomText
          string={data ? `쿠폰함 ${data?.length}장` : '쿠폰함 0장'}
          family={FONT_FAMILY.BOLD}
          size={FONT.TITLE_2}
          forDriveMe
        />

        {/* search input */}
        <HStack style={{marginVertical: PADDING}}>
          <TextInput
            value={couponCode}
            style={styles.input}
            placeholder={strings.coupon_box.search_placeholder}
            onChangeText={setCouponCode}
            placeholderTextColor={colors.grayText}
          />
          <Button
            text={strings.coupon_box.coupon_registration}
            style={styles.button}
            color={colors.blackGray}
            borderColor={colors.transparent}
            onPress={handleAddCoupon}
          />
        </HStack>

        <Divider />
      </View>

      <FlashList
        data={data}
        estimatedItemSize={20}
        renderItem={renderItem}
        scrollEnabled
        contentContainerStyle={{
          paddingBottom: PADDING,
        }}
        showsVerticalScrollIndicator={false}
      />

      {showWebview ? (
        <WebView
          source={{
            uri: `http://cafe.wisemobile.kr/imobile/partner_list/chargemoney_update.php?mmid=${userToken?.id}&c_number=${couponCode}`,
          }}
          onLoadEnd={() => {
            refetch();
            Spinner.hide();
            setShowWebview(false);
          }}
          originWhitelist={['*']}
        />
      ) : null}
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: PADDING,
    marginTop: PADDING_HEIGHT,
  },
  input: {
    flex: 1,
    height: heightScale(45),
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: widthScale(5),
    padding: PADDING / 2,
  },
  button: {
    borderRadius: widthScale(5),
    paddingHorizontal: PADDING / 1.5,
    marginLeft: PADDING / 2,
  },
  coupon: {
    marginTop: PADDING,
  },
});

export default memo(CouponBox);
