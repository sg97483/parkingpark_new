import {Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {IMAGES} from '~/assets/images-path';
import SquareButton from '~components/square-button';
import notifee from '@notifee/react-native';
import Button from '~components/button';
import {colors} from '~styles/colors';
import moment from 'moment';
import {createNotificationWithTime, sleep} from '~utils/index';
import Logger from '~utils/logger';
import {showMessage} from 'react-native-flash-message';
import {RootStackScreenProps} from '~navigators/stack';
import _ from 'lodash';

const ParkingAlarmMenu = (props: RootStackScreenProps<'ParkingAlarmMenu'>) => {
  const {navigation, route} = props;
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const [textBook, setTextBook] = useState('');

  const [isShowButtonBook, setIsShowButtonBook] = useState(true);
  const refHour = useRef<TextInput>(null);
  const refMinute = useRef<TextInput>(null);

  useEffect(() => {
    checkNotife();
    notifee.onForegroundEvent(() => checkNotife());
  }, []);

  const checkNotife = () => {
    notifee.getTriggerNotifications().then((res: any) => {
      if (res.length) {
        if (res[0].notification.title == '파킹박주차알람') {
          const date = moment(res[0].trigger?.timestamp);
          setHour(parseInt(date.format('hh')));
          setMinute(parseInt(date.format('mm')));
          setIsAM(date.format('a') == 'am');
          setIsShowButtonBook(false);
          setTextBook(
            `알람시간 : ${date.format('MM')}월 ${date.format('DD')}일 ${date.format(
              'hh',
            )}시 ${date.format('mm')}분`,
          );
        }
      } else {
        const newDate = moment(new Date().valueOf());
        setHour(parseInt(newDate.format('hh')));
        setMinute(parseInt(newDate.format('mm')));
        setIsAM(newDate.format('a') == 'am');
        setIsShowButtonBook(true);
      }
    });
  };
  const createNotife = async (hourBook: number, minuteBook: number, isAMBook: boolean) => {
    await notifee.cancelAllNotifications();
    const date = new Date(Date.now());
    date.setHours(hourBook + (isAMBook ? 0 : 12));
    date.setMinutes(minuteBook);

    await createNotificationWithTime(date.getTime())
      .then(() => {
        const day = moment(date.valueOf());
        setTextBook(
          `알람시간 : ${day.format('MM')}월 ${day.format('DD')}일 ${day.format(
            'hh',
          )}시 ${day.format('mm')}분`,
        );
        setIsShowButtonBook(false);
        Logger('info', 'Đã tạo báo thức với: ' + `${hourBook} giờ : ${minuteBook} phút`);
      })
      .catch(e => {
        showMessage({
          message: '이미 알람 시간이 지났습니다. 알람 시간을 다시 설정해 주세요',
        });
        return;
      });
  };

  const onPressBtn = async (numberAdd: number) => {
    const newDate = moment(new Date().valueOf());
    newDate.add(numberAdd, 'minute');
    const hourBook = parseInt(newDate.format('hh'));
    const minuteBook = parseInt(newDate.format('mm'));
    const isAMBook = newDate.format('a') == 'am';

    setHour(hourBook);
    setMinute(minuteBook);
    setIsAM(isAMBook);
    await sleep(100);
    await createNotife(hourBook, minuteBook, isAMBook);
    refHour.current?.blur();
    refMinute.current?.blur();
  };

  const onPressAM = () => setIsAM(!isAM);

  const onPressAddMinute = () => {
    const newDate = new Date();
    const minuteAdd = (minute || newDate.getMinutes()) + 1;
    setMinute(minuteAdd > 60 ? 1 : minuteAdd);
    refHour.current?.blur();
    refMinute.current?.blur();
  };

  const onPressDowMinute = () => {
    const newDate = new Date();
    const minuteAdd = (minute || newDate.getMinutes()) - 1;
    setMinute(minuteAdd < 0 ? 59 : minuteAdd);
    refHour.current?.blur();
    refMinute.current?.blur();
  };
  const onChangeTextMinute = (text: string) => {
    if (!text) {
      setMinute('' as any);
    } else {
      if (parseInt(text) <= 59) {
        setMinute(parseInt(text));
      }
    }
  };
  const onPressAddHour = () => {
    const newDate = moment(new Date().valueOf());
    const hourAdd = (hour || parseInt(newDate.format('hh'))) + 1;
    setHour(hourAdd > 12 ? 1 : hourAdd);
    refHour.current?.blur();
    refMinute.current?.blur();
  };
  const onPressDowHour = () => {
    const newDate = moment(new Date().valueOf());
    const hourAdd = (hour || parseInt(newDate.format('hh'))) - 1;
    setHour(hourAdd < 1 ? 12 : hourAdd);
    refHour.current?.blur();
    refMinute.current?.blur();
  };

  const onChangeTextHour = (text: string) => {
    if (!text) {
      setHour('' as any);
    } else {
      if (parseInt(text) <= 12) {
        setHour(parseInt(text));
      }
    }
  };
  const debounceBtn = _.debounce(async (number: number) => await onPressBtn(number), 200);

  return (
    <FixedContainer>
      <CustomHeader text="주차알람" />
      <ScrollView>
        <Image source={IMAGES.title_rapid_alram} style={styles.image} resizeMode={'contain'} />
        <View style={styles.viewBtn}>
          <TouchableOpacity onPress={() => debounceBtn(50)}>
            <Image source={IMAGES.btn_50min_off} style={styles.btnMin} resizeMode={'contain'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => debounceBtn(110)}>
            <Image source={IMAGES.btn_110min_off} style={styles.btnMin} resizeMode={'contain'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => debounceBtn(170)}>
            <Image source={IMAGES.btn_170min_off} style={styles.btnMin} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>
        <Image source={IMAGES.title_time_alram} style={styles.image} resizeMode={'contain'} />
        <View style={styles.viewButton}>
          <View style={styles.view3}>
            <SquareButton onPress={onPressAddHour} title={'+'} />
            <SquareButton
              refTextInput={refHour}
              isTextInput
              title={hour.toString()}
              onChangeText={onChangeTextHour}
            />
            <SquareButton onPress={onPressDowHour} title={'-'} />
          </View>
          <View style={styles.view3}>
            <SquareButton onPress={onPressAddMinute} title={'+'} />
            <SquareButton
              onChangeText={onChangeTextMinute}
              refTextInput={refMinute}
              isTextInput
              title={minute.toString()}
            />
            <SquareButton onPress={onPressDowMinute} title={'-'} />
          </View>
          <View style={styles.view3}>
            <SquareButton onPress={onPressAM} title={isAM ? 'AM' : 'PM'} />
          </View>
        </View>

        {isShowButtonBook ? (
          <Button
            text="알람 설정"
            onPress={() => createNotife(hour, minute, isAM)}
            style={styles.button}
          />
        ) : (
          <>
            <Button
              text="알람 설정"
              onPress={async () => {
                await notifee.cancelAllNotifications();
                setIsShowButtonBook(!isShowButtonBook);
              }}
              style={styles.buttonCancel}
            />
            <View style={styles.textBook}>
              <Text>{textBook}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </FixedContainer>
  );
};

export default ParkingAlarmMenu;

const styles = StyleSheet.create({
  image: {
    width: widthScale(100),
    marginHorizontal: widthScale(20),
    marginVertical: heightScale(15),
  },
  btnMin: {
    width: widthScale(100),
    height: widthScale(100),
    marginHorizontal: widthScale(15),
  },
  viewBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  view3: {
    marginHorizontal: widthScale(5),
  },
  button: {
    width: widthScale(280),
    alignSelf: 'center',
    marginTop: heightScale(20),
  },
  buttonCancel: {
    backgroundColor: colors.darkGray,
    borderWidth: 0,
    width: widthScale(280),
    alignSelf: 'center',
    marginTop: heightScale(20),
  },
  textBook: {
    width: widthScale(280),
    alignSelf: 'center',
    marginTop: heightScale(20),
    backgroundColor: colors.gray,
    minHeight: heightScale(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
