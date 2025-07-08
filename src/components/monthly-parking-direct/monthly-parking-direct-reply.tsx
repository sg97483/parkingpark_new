import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import React, {memo, useEffect} from 'react';
import {useGetMonthlyParkingDirectReplyQuery} from '~services/monthlyParkingDirectServices';
import {PADDING} from '~constants/constant';
import {widthScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import moment from 'moment';
import {getTimeAgo} from '~utils/hourUtils';
import {EMIT_EVENT, FONT, FONT_FAMILY, GENDER} from '~constants/enum';
import {colors} from '~styles/colors';

interface Props {
  BBSID: number;
}

const MonthlyParkingDirectReply: React.FC<Props> = memo(props => {
  const {BBSID} = props;

  const {data: LIST_REPLY, refetch} = useGetMonthlyParkingDirectReplyQuery(
    {
      id: BBSID,
      lastID: 0,
    },
    {skip: !BBSID},
  );

  useEffect(() => {
    const addCommentListeners = DeviceEventEmitter.addListener(
      EMIT_EVENT.MONTHLY_PARKING_DIRECT,
      () => {
        refetch();
      },
    );

    return () => {
      addCommentListeners.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {LIST_REPLY?.map((item, index) => {
        return (
          <View style={styles.content} key={index}>
            <HStack style={styles.headerWrapper}>
              <HStack>
                <CustomText
                  color={item?.gender === GENDER.MALE ? colors.darkBlue : colors.pink}
                  string={`[${item?.memberNic}] `}
                  family={FONT_FAMILY.SEMI_BOLD}
                />
                <CustomText
                  string={`| ${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
                  size={FONT.CAPTION_2}
                  color={colors.darkGray}
                />
              </HStack>
              {getTimeAgo(item?.regdate * 1000) ? (
                <CustomText
                  size={FONT.CAPTION_3}
                  color={colors.darkGray}
                  string={`${getTimeAgo(item?.regdate * 1000)}`}
                />
              ) : null}
            </HStack>
            <CustomText textStyle={{marginTop: 5}} string={`답글: ${item?.text}`} />
          </View>
        );
      })}
    </View>
  );
});

export default MonthlyParkingDirectReply;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: widthScale(35) + PADDING / 2,
  },
  content: {
    marginBottom: PADDING,
  },
  headerWrapper: {
    justifyContent: 'space-between',
  },
});
