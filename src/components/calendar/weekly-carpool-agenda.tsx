import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {memo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {DateData} from 'react-native-calendars';
import CustomButton from '~components/commons/custom-button';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {calculateDate} from '~utils/hourUtils';
import CustomText from '../custom-text';
import HStack from '../h-stack';
import BookingStatus from './booking-status';

interface Props {
  myRoadRegisterd: DriverRoadDayModel[];
  isLoading: boolean;
}

const WeeklyCarpoolAgenda: React.FC<Props> = memo(props => {
  const {myRoadRegisterd, isLoading} = props;
  const navigation = useNavigation<UseRootStackNavigation>();

  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  return (
    <View style={styles.container}>
      <HStack style={styles.headerContainer}>
        <CustomText
          string="주간카풀캘린더"
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          forDriveMe
          lineHeight={heightScale1(22)}
        />
        <HStack>
          <HStack style={styles.bookingDoneContainer}>
            <View style={styles.doneDot} />
            <CustomText
              string="예약완료"
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              forDriveMe
              color={colors.grayText2}
            />
          </HStack>
          <HStack>
            <View style={styles.finishedAppointmentDot} />
            <CustomText
              string="등록완료"
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              forDriveMe
              color={colors.grayText2}
            />
          </HStack>
        </HStack>
      </HStack>
      <HStack style={styles.daysNameContainer}>
        <CustomText
          string={'월요일'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_4}
          color={colors.heavyGray}
          lineHeight={fontSize1(15)}
          textStyle={styles.dayName}
          forDriveMe
        />
        <CustomText
          string={'화요일'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_4}
          color={colors.heavyGray}
          lineHeight={fontSize1(15)}
          textStyle={styles.dayName}
          forDriveMe
        />
        <CustomText
          string={'수요일'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_4}
          color={colors.heavyGray}
          lineHeight={fontSize1(15)}
          textStyle={styles.dayName}
          forDriveMe
        />
        <CustomText
          string={'목요일'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_4}
          color={colors.heavyGray}
          lineHeight={fontSize1(15)}
          textStyle={styles.dayName}
          forDriveMe
        />
        <CustomText
          string={'금요일'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_4}
          color={colors.heavyGray}
          lineHeight={fontSize1(15)}
          textStyle={styles.dayName}
          forDriveMe
        />
      </HStack>
      <HStack pointerEvents="none" style={styles.weekContainer}>
        {calculateDate().map((item: DateData, index: number) => {
          const isSelected = item?.dateString === selectedDate;
          return (
            <View key={index.toString()}>
              <Pressable
                disabled={
                  dayjs(dayjs().format('YYYY-MM-DD')).valueOf() > dayjs(item?.dateString).valueOf()
                }
                style={styles.dayContainer}
                onPress={() => setSelectedDate(item?.dateString)}>
                <View
                  style={[
                    styles.dayViewContainer,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.white,
                    },
                  ]}>
                  <CustomText
                    string={dayjs(item?.dateString).date().toString()}
                    family={FONT_FAMILY.SEMI_BOLD}
                    size={FONT.BODY}
                    color={
                      dayjs(dayjs().format('YYYY-MM-DD')).valueOf() <=
                      dayjs(item?.dateString).valueOf()
                        ? isSelected
                          ? colors.white
                          : colors.menuTextColor
                        : colors.disableButton
                    }
                    forDriveMe
                  />
                </View>
              </Pressable>

              <BookingStatus date={item} bookingData={myRoadRegisterd} isWeekly />
            </View>
          );
        })}
      </HStack>

      <CustomButton
        onPress={() => {
          navigation.navigate(ROUTE_KEY.CarpoolCalendar);
        }}
        text="카풀 운행등록"
        buttonHeight={58}
        type="TERTIARY"
        outLine
        isLoading={isLoading}
      />
    </View>
  );
});

export default WeeklyCarpoolAgenda;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: heightScale1(20),
    paddingHorizontal: PADDING,
    borderRadius: scale1(8),
  },
  headerContainer: {
    justifyContent: 'space-between',
  },
  bookingDoneContainer: {marginRight: scale1(16)},
  doneDot: {
    height: scale1(10),
    aspectRatio: 1,
    backgroundColor: colors.success,
    borderRadius: 99,
    marginRight: scale1(5),
  },
  finishedAppointmentDot: {
    height: scale1(10),
    aspectRatio: 1,
    backgroundColor: colors.disableButton,
    borderRadius: 99,
    marginRight: scale1(5),
  },
  dayName: {
    width: widthScale1(37),
    textAlign: 'center',
  },
  dayContainer: {
    width: widthScale1(37),
    height: heightScale1(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: heightScale1(20),
  },
  daysNameContainer: {
    justifyContent: 'space-between',
    marginTop: heightScale1(20),
    marginBottom: heightScale1(16),
  },
  dayViewContainer: {
    width: scale1(30),
    height: scale1(30),
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
