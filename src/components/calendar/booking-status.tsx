import moment from 'moment';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {DateData} from 'react-native-calendars';
import CustomDot from '~components/custom-dot';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {colors} from '~styles/colors';
import {heightScale1, scale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';

interface BookingStatusProps {
  bookingData?: DriverRoadDayModel[];
  date: DateData;
  isWeekly?: boolean;
}

const BookingStatus: React.FC<BookingStatusProps> = memo(props => {
  const {bookingData, date, isWeekly} = props;

  const workBooking = bookingData?.find(
    (item: DriverRoadDayModel) =>
      moment(item?.selectDay, 'YYYY.MM.DD').format('YYYY-MM-DD') === date.dateString &&
      item?.carInOut === 'in',
  );

  const homeBooking = bookingData?.find(
    (item: DriverRoadDayModel) =>
      moment(item?.selectDay, 'YYYY.MM.DD').format('YYYY-MM-DD') === date.dateString &&
      item?.carInOut === 'out',
  );

  if (
    ((dayjs().date() === date.day || dayjs().valueOf() <= date.timestamp) && workBooking) ||
    homeBooking
  ) {
    return (
      <View
        style={{
          alignItems: 'center',
          marginTop: isWeekly ? heightScale1(10) : 0,
        }}>
        {/* Way to work */}
        {workBooking ? (
          <HStack
            style={{
              height: heightScale1(15),
            }}>
            {workBooking?.state === 'E' || workBooking?.state === 'R' ? (
              <CustomDot style={styles.miniDotContainer} color={colors.success} size={scale1(8)} />
            ) : (
              <CustomDot
                style={styles.miniDotContainer}
                color={colors.disableButton}
                size={scale1(8)}
              />
            )}
            <CustomText
              string="출근"
              size={FONT.CAPTION_4}
              family={FONT_FAMILY.SEMI_BOLD}
              forDriveMe
            />
          </HStack>
        ) : (
          <View style={{height: heightScale1(15)}} />
        )}

        <View
          style={{
            height: heightScale1(4),
          }}
        />

        {/* way to home */}
        {homeBooking ? (
          <HStack
            style={{
              height: heightScale1(15),
            }}>
            {homeBooking?.state === 'E' || homeBooking?.state === 'R' ? (
              <CustomDot style={styles.miniDotContainer} color={colors.success} size={scale1(8)} />
            ) : (
              <CustomDot
                style={styles.miniDotContainer}
                color={colors.disableButton}
                size={scale1(8)}
              />
            )}
            <CustomText
              string="퇴근"
              size={FONT.CAPTION_4}
              family={FONT_FAMILY.SEMI_BOLD}
              forDriveMe
            />
          </HStack>
        ) : null}
      </View>
    );
  }
  return <></>;
});

export default BookingStatus;

const styles = StyleSheet.create({
  dotContainer: {
    marginRight: scale1(5),
  },
  miniDotContainer: {
    marginRight: scale1(4),
  },
});
