import {useKeyboard} from '@react-native-community/hooks';
import React, {memo, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {Cell, Table, TableWrapper} from 'react-native-table-component';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import RegisterParkingSharedDetailImageList from '~components/register-parking-shared/register-parking-shared-detail-image-list';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {MonthlyParkingDirectProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useGetParkingSharedDetailQuery,
  useGetParkingSharedImageQuery,
} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getImageURL} from '~utils/getImageURL';

const RegisterParkingSharedDetail = memo(
  (props: RootStackScreenProps<'RegisterParkingSharedDetail'>) => {
    const keyboard = useKeyboard();
    const {navigation} = props;

    const userToken = useAppSelector(state => state?.userReducer?.userToken);

    const {data} = useGetParkingSharedDetailQuery({
      parkingLotId: userToken?.parkingLotId,
      s_memberId: userToken?.id,
      memberPwd: userToken?.password,
    });

    const {data: shareImages} = useGetParkingSharedImageQuery({
      parkingLotId: userToken?.parkingLotId,
      s_memberId: userToken?.id,
      memberPwd: userToken?.password,
    });

    const [parkingShared, setParkingShared] = useState<MonthlyParkingDirectProps>();

    useEffect(() => {
      if (data?.length) {
        // get latest item
        setParkingShared(data[data?.length - 1]);
      }
    }, [data]);

    return (
      <FixedContainer>
        <CustomHeader text={strings.register_parking_shared_detail.header} />

        <KeyboardAvoidingView style={styles.content} behavior={'padding'}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 2}}>
              <Table borderStyle={{borderWidth: 1}}>
                {/* garage name */}
                <TableWrapper style={styles.wrapper}>
                  <Cell
                    data={
                      <CustomText
                        string={strings.register_parking_shared_detail.garage_name}
                        size={FONT.CAPTION}
                        textStyle={{
                          textAlign: 'center',
                        }}
                        color={colors.primary}
                        family={FONT_FAMILY.BOLD}
                      />
                    }
                    style={{width: widthScale(120)}}
                  />
                  <Cell
                    data={
                      <CustomText
                        string={
                          parkingShared?.s_garageName ||
                          strings.register_parking_shared_detail.holder_garage_name
                        }
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                      />
                    }
                    style={styles.cellStyle}
                    flex={2}
                  />
                </TableWrapper>

                {/* garage info */}
                <TableWrapper style={styles.wrapper}>
                  <Cell
                    data={
                      <CustomText
                        string={strings.register_parking_shared_detail.garage_info}
                        size={FONT.CAPTION}
                        textStyle={{
                          textAlign: 'center',
                        }}
                        color={colors.primary}
                        family={FONT_FAMILY.BOLD}
                      />
                    }
                    style={{width: widthScale(120)}}
                  />
                  <Cell
                    data={
                      <CustomText
                        string={
                          parkingShared?.s_garageInfo ||
                          strings.register_parking_shared_detail.holder_garage_info
                        }
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={styles.cellStyle}
                    flex={2}
                  />
                </TableWrapper>

                {/* garage address */}
                <TableWrapper style={styles.wrapper}>
                  <Cell
                    data={
                      <CustomText
                        string={strings.register_parking_shared_detail.garage_address}
                        size={FONT.CAPTION}
                        textStyle={{
                          textAlign: 'center',
                        }}
                        color={colors.primary}
                        family={FONT_FAMILY.BOLD}
                      />
                    }
                    style={{width: widthScale(120)}}
                  />
                  <Cell
                    data={
                      <CustomText
                        string={
                          parkingShared?.s_garageAddress ||
                          strings.register_parking_shared_detail.holder_garage_address
                        }
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    flex={2}
                  />
                </TableWrapper>

                {/* garage charge */}
                <TableWrapper style={styles.wrapper}>
                  <Cell
                    data={
                      <CustomText
                        string={strings.register_parking_shared_detail.garage_charge}
                        size={FONT.CAPTION}
                        textStyle={{
                          textAlign: 'center',
                        }}
                        color={colors.primary}
                        family={FONT_FAMILY.BOLD}
                      />
                    }
                    style={{width: widthScale(120)}}
                  />
                  <Cell
                    data={
                      <CustomText
                        string={
                          parkingShared?.s_garagePay ||
                          strings.register_parking_shared_detail.holder_garage_charge
                        }
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={styles.cellStyle}
                    flex={1}
                  />
                </TableWrapper>

                {/* garage number */}
                <TableWrapper style={styles.wrapper}>
                  <Cell
                    data={
                      <CustomText
                        string={strings.register_parking_shared_detail.garage_num}
                        size={FONT.CAPTION}
                        textStyle={{
                          textAlign: 'center',
                        }}
                        color={colors.primary}
                        family={FONT_FAMILY.BOLD}
                      />
                    }
                    style={{width: widthScale(120)}}
                  />
                  <Cell
                    data={
                      <CustomText
                        string={
                          parkingShared?.s_shareSpace ||
                          strings.register_parking_shared_detail.holder_garage_num
                        }
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    flex={2}
                  />
                </TableWrapper>

                {/* pay day */}
                <TableWrapper style={styles.wrapper}>
                  <Cell
                    data={
                      <CustomText
                        string={strings.register_parking_shared_detail.pay_day}
                        size={FONT.CAPTION}
                        textStyle={{
                          textAlign: 'center',
                        }}
                        color={colors.primary}
                        family={FONT_FAMILY.BOLD}
                      />
                    }
                    style={{width: widthScale(120)}}
                  />
                  <Cell
                    data={
                      <CustomText
                        string={
                          parkingShared?.s_gday ||
                          strings.register_parking_shared_detail.holder_garage_day
                        }
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    flex={2}
                  />
                </TableWrapper>

                {/* pay time */}
                <TableWrapper style={styles.wrapper}>
                  <Cell
                    data={
                      <CustomText
                        string={strings.register_parking_shared_detail.pay_time}
                        size={FONT.CAPTION}
                        textStyle={{
                          textAlign: 'center',
                        }}
                        color={colors.primary}
                        family={FONT_FAMILY.BOLD}
                      />
                    }
                    style={{width: widthScale(120)}}
                  />
                  <Cell
                    data={
                      <CustomText
                        string={
                          parkingShared?.s_gtime ||
                          strings.register_parking_shared_detail.holder_garage_time
                        }
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    flex={2}
                  />
                </TableWrapper>

                {/* pNum */}
                <TableWrapper style={styles.wrapper}>
                  <Cell
                    data={
                      <CustomText
                        string={strings.register_parking_shared_detail.shared_pnum}
                        size={FONT.CAPTION}
                        textStyle={{
                          textAlign: 'center',
                        }}
                        color={colors.primary}
                        family={FONT_FAMILY.BOLD}
                      />
                    }
                    style={{width: widthScale(120)}}
                  />
                  <Cell
                    data={
                      <CustomText
                        string={
                          parkingShared?.pnum ||
                          strings.register_parking_shared_detail.holder_garage_pnum
                        }
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    flex={2}
                  />
                </TableWrapper>
              </Table>

              <View style={{marginTop: PADDING_HEIGHT}}>
                <CustomText
                  string={strings.register_parking_shared.rule_upload_photo}
                  family={FONT_FAMILY.SEMI_BOLD}
                />
                <RegisterParkingSharedDetailImageList
                  image1={shareImages ? getImageURL(shareImages[0].carImage1Id, false) : undefined}
                  image2={shareImages ? getImageURL(shareImages[0].carImage2Id, false) : undefined}
                  image3={shareImages ? getImageURL(shareImages[0].carImage3Id, false) : undefined}
                  image4={shareImages ? getImageURL(shareImages[0].carImage4Id, false) : undefined}
                  style={{marginTop: PADDING_HEIGHT / 2}}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </FixedContainer>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    height: heightScale(50),
  },
  title: {
    flex: 1,
  },
  textInput: {
    width: '100%',
    minHeight: heightScale(40),
  },
  btnPmonth: {
    width: widthScale(40),
    height: heightScale(40),
  },
  inputBorder: {
    flex: 1,
    marginRight: widthScale(5),
    paddingVertical: heightScale(5),
    borderColor: colors.gray,
    borderWidth: 1,
  },
  cellStyle: {
    paddingHorizontal: widthScale(5),
    paddingVertical: heightScale(2),
  },
  footer: {},
  content: {
    flex: 1,
    paddingHorizontal: PADDING / 2,
  },
  button: {
    width: widthScale(150),
    height: heightScale(40),
    borderRadius: widthScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default RegisterParkingSharedDetail;
