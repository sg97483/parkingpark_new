import axios from 'axios';
import React, {forwardRef, memo, Ref, useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Cell, Table, TableWrapper} from 'react-native-table-component';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {
  IS_IOS,
  PADDING,
  PADDING_HEIGHT,
  WEATHER_APP_GOOGLE_PLAY,
  WEATHER_APP_STORE,
  width,
} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {WeatherProps} from '~constants/types';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {
  formatIndexWeather,
  getIndexWeather,
  getTodayWeatherText,
  handleOpenAppInStore,
} from '~utils/index';

export interface WeatherModalRefObject {
  show: () => void;
  hide: () => void;
}

const ModalWeather = forwardRef((_, ref: Ref<WeatherModalRefObject>) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [today, setToday] = useState<string>('오늘');
  const [rowTableToday, setRowTableToday] = useState<number>(0);
  const [rowTableTomorrow, setRowTableTomorrow] = useState<number>(0);
  const [hours, setHours] = useState<string[]>();
  const [chance, setChance] = useState<string[]>();
  const [temp, setTemp] = useState<string[]>();
  const [humidity, setHumidity] = useState<string[]>();
  const [weathers, setWeathers] = useState<WeatherProps[]>([]);

  React.useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);
  const code = useAppSelector(state => state?.weatherReducer?.codeRegion?.code);
  const weatherData = useAppSelector(state => state?.weatherReducer?.weatherData);

  useEffect(() => {
    initWeather();
  }, [code, weatherData]);

  const initWeather = () => {
    const url = `http://oapi.wisemobile.co.kr/iOS_Data/DFS_${code}.dat`;
    axios
      .get(url)
      .then(res => {
        let index = getIndexWeather(weatherData);
        let blankCount = getBlankCount(res?.data.toString(), index);
        index = index - blankCount;

        initWeatherTitle(res?.data, index);

        initHours(index);
        initWeathers(index);
        initTemp(index);
        initChance(index);
        initHumidity(index);
      })
      .catch(() => {});
  };

  const getBlankCount = (res: string, index: number): number => {
    const index1: string = formatIndexWeather(index + 1);
    const index2: string = formatIndexWeather(index + 2);
    const index3: string = formatIndexWeather(index + 3);
    const index4: string = formatIndexWeather(index + 4);
    const index5: string = formatIndexWeather(index + 5);
    const index6: string = formatIndexWeather(index + 6);

    const name1: string = '$SHRT_WC_' + index1 + ' =';
    const name2: string = '$SHRT_WC_' + index2 + ' =';
    const name3: string = '$SHRT_WC_' + index3 + ' =';
    const name4: string = '$SHRT_WC_' + index4 + ' =';
    const name5: string = '$SHRT_WC_' + index5 + ' =';
    const name6: string = '$SHRT_WC_' + index6 + ' =';
    const nameLast: string = '$SHRT_RN_PRB_01 =';

    let value1: string = '';
    let value2: string = '';
    let value3: string = '';
    let value4: string = '';
    let value5: string = '';
    let value6: string = '';

    const idx1: number = res.indexOf(name1);
    const idxLast: number = res.indexOf(nameLast);

    const bundle: string = res.substring(idx1, idxLast).trim();
    const arBundle: string[] = bundle.split(';');

    for (let i = 0; i < arBundle.length; i++) {
      const name: string = arBundle[i].split("'")[0].trim();
      if (name === name1) {
        try {
          value1 = arBundle[i].split("'")[1];
        } catch (error) {
          return 6;
        }
      } else if (name === name2) {
        try {
          value2 = arBundle[i].split("'")[1];
        } catch (error) {
          return 5;
        }
      } else if (name === name3) {
        try {
          value3 = arBundle[i].split("'")[1];
        } catch (error) {
          return 4;
        }
      } else if (name === name4) {
        try {
          value4 = arBundle[i].split("'")[1];
        } catch (error) {
          return 3;
        }
      } else if (name === name5) {
        try {
          value5 = arBundle[i].split("'")[1];
        } catch (error) {
          return 2;
        }
      } else if (name === name6) {
        try {
          value6 = arBundle[i].split("'")[1];
        } catch (error) {
          return 1;
        }
      }
    }
    return 0;
  };

  const initWeatherTitle = (res: string, index: number) => {
    const index1: string = formatIndexWeather(index + 1);
    const index2: string = formatIndexWeather(index + 2);
    const index3: string = formatIndexWeather(index + 3);
    const index4: string = formatIndexWeather(index + 4);
    const index5: string = formatIndexWeather(index + 5);
    const index6: string = formatIndexWeather(index + 6);

    const name1: string = '$SHRT_TM_EF_FD_' + index1 + ' =';
    const name2: string = '$SHRT_TM_EF_FD_' + index2 + ' =';
    const name3: string = '$SHRT_TM_EF_FD_' + index3 + ' =';
    const name4: string = '$SHRT_TM_EF_FD_' + index4 + ' =';
    const name5: string = '$SHRT_TM_EF_FD_' + index5 + ' =';
    const name6: string = '$SHRT_TM_EF_FD_' + index6 + ' =';
    const nameLast: string = '$SHRT_TM_EF_HH_01 =';

    let value1: string = '';
    let value2: string = '';
    let value3: string = '';
    let value4: string = '';
    let value5: string = '';
    let value6: string = '';

    const idx1: number = res.indexOf(name1);
    const idxLast: number = res.indexOf(nameLast);

    const bundle: string = res.substring(idx1, idxLast).trim();

    const arBundle: string[] = bundle.split(';');
    for (let i = 0; i < arBundle.length; i++) {
      let name: string = arBundle[i].split("'")[0].trim();
      if (name === name1) {
        value1 = arBundle[i].split("'")[1];
      } else if (name === name2) {
        value2 = arBundle[i].split("'")[1];
      } else if (name === name3) {
        value3 = arBundle[i].split("'")[1];
      } else if (name === name4) {
        value4 = arBundle[i].split("'")[1];
      } else if (name === name5) {
        value5 = arBundle[i].split("'")[1];
      } else if (name === name6) {
        value6 = arBundle[i].split("'")[1];
      }
    }
    if (value6 === '오늘') {
      setToday('오늘 ' + getTodayWeatherText(res, index));
      setRowTableToday(0);
      setRowTableTomorrow(1);
    } else if (value5 === '오늘') {
      setToday('오늘 ' + getTodayWeatherText(res, index));
      setRowTableToday(5);
      setRowTableTomorrow(1);
    } else if (value4 === '오늘') {
      setToday('오늘 ' + getTodayWeatherText(res, index));
      setRowTableToday(4);
      setRowTableTomorrow(6);
    } else if (value3 === '오늘') {
      setToday('오늘 ' + getTodayWeatherText(res, index));
      setRowTableToday(1);
      setRowTableTomorrow(1);
    } else if (value2 === '오늘') {
      setToday('오늘 ' + getTodayWeatherText(res, index));
      setRowTableToday(2);
      setRowTableTomorrow(4);
    } else if (value1 === '오늘') {
      setToday('오늘 ' + getTodayWeatherText(res, index));
      setRowTableToday(1);
      setRowTableTomorrow(5);
    } else {
      setToday('오늘');
      setRowTableToday(0);
      setRowTableTomorrow(1);
    }
  };

  const initHours = (index: number) => {
    const arr = [];
    for (let i = index; i < index + 6; i++) {
      let hour = weatherData
        ? weatherData?.[`SHRT_TM_EF_HH_${formatIndexWeather(i + 1)}`] + ':00'
        : '';
      arr.push(hour);
    }
    setHours(arr);
  };

  const initWeathers = (index: number) => {
    const arr: WeatherProps[] = [];
    for (let i = index; i < index + 6; i++) {
      let image = weatherData
        ? Number.parseInt(weatherData?.[`SHRT_WI_${formatIndexWeather(i + 1)}`])
        : 0;
      let desc = weatherData ? weatherData?.[`SHRT_WC_${formatIndexWeather(i + 1)}`] : '';
      arr.push({
        image: image,
        desc: desc,
      });
    }
    setWeathers(arr);
  };

  const initChance = (index: number) => {
    const arr: string[] = [];
    for (let i = index; i < index + 6; i++) {
      let chance = weatherData
        ? weatherData?.[`SHRT_RN_PRB_${formatIndexWeather(i + 1)}`] + '%'
        : '';
      arr.push(chance);
    }
    setChance(arr);
  };

  const initTemp = (index: number) => {
    const arr: string[] = [];
    for (let i = index; i < index + 6; i++) {
      let temp = weatherData ? weatherData?.[`SHRT_TA_${formatIndexWeather(i + 1)}`] : '';
      arr.push(temp);
    }
    setTemp(arr);
  };

  const initHumidity = (index: number) => {
    const arr: string[] = [];
    for (let i = index; i < index + 6; i++) {
      let humidity = weatherData ? weatherData?.[`SHRT_TA_${formatIndexWeather(i + 1)}`] + '%' : '';
      arr.push(humidity);
    }
    setHumidity(arr);
  };

  {
    /*const initWeatherIcon = (iconNumber: number) => {
    switch (iconNumber) {
      case 1:
        return ICONS.weather_1;
      case 2:
        return ICONS.weather_2;
      case 3:
        return ICONS.weather_3;
      case 4:
        return ICONS.weather_4;
      case 5:
        return ICONS.weather_5;
      case 6:
        return ICONS.weather_6;
      case 7:
        return ICONS.weather_7;
      case 8:
        return ICONS.weather_8;
      case 9:
        return ICONS.weather_9;
      case 10:
        return ICONS.weather_10;
      case 11:
        return ICONS.weather_11;
      case 12:
        return ICONS.weather_12;
      case 13:
        return ICONS.weather_13;
      case 14:
        return ICONS.weather_14;
      case 15:
        return ICONS.weather_15;
      case 16:
        return ICONS.weather_16;
      case 17:
        return ICONS.weather_17;
      case 18:
        return ICONS.weather_18;
      case 19:
        return ICONS.weather_19;
      case 20:
        return ICONS.weather_20;
      case 21:
        return ICONS.weather_21;
      default:
        return ICONS.weather_22;
    }
  };*/
  }

  const handleOpenApp = () => {
    if (IS_IOS) {
      handleOpenAppInStore(WEATHER_APP_STORE);
    } else {
      handleOpenAppInStore(WEATHER_APP_GOOGLE_PLAY);
    }
  };

  return (
    <Modal useNativeDriver isVisible={isVisible} onDismiss={hide}>
      <View style={styles.container}>
        {/* header */}

        <View style={styles.header}>
          <View style={[styles.headerLeft, {flex: rowTableToday + 1}]}>
            <CustomText
              string={`${today}`}
              family={FONT_FAMILY.BOLD}
              color={colors.white}
              size={FONT.CAPTION}
            />
          </View>

          <View style={[styles.headerRight, {flex: rowTableTomorrow}]}>
            <CustomText
              string={'내일'}
              family={FONT_FAMILY.BOLD}
              color={colors.white}
              size={FONT.CAPTION}
            />
          </View>
        </View>

        <Table borderStyle={{borderWidth: 1, borderColor: colors.grayText}}>
          <TableWrapper style={styles.wrapper}>
            <Cell
              data={
                <CustomText
                  string={strings?.modal_weather?.hour}
                  size={FONT.CAPTION_4}
                  textStyle={{
                    textAlign: 'center',
                  }}
                  color={colors.grayText}
                  family={FONT_FAMILY.BOLD}
                />
              }
              style={{flex: 1}}
            />
            {hours?.length ? (
              hours?.map((item, index) => {
                return (
                  <Cell
                    key={index}
                    data={
                      <CustomText
                        string={item}
                        family={FONT_FAMILY.SEMI_BOLD}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={{flex: 1, alignItems: 'center'}}
                  />
                );
              })
            ) : (
              <></>
            )}
          </TableWrapper>

          <TableWrapper style={styles.wrapper}>
            <Cell
              data={
                <CustomText
                  string={strings?.modal_weather?.weather}
                  size={FONT.CAPTION_4}
                  textStyle={{
                    textAlign: 'center',
                  }}
                  color={colors.grayText}
                  family={FONT_FAMILY.BOLD}
                />
              }
              style={{flex: 1}}
            />
            {weathers?.length ? (
              weathers?.map((item, index) => {
                return (
                  <Cell
                    key={index}
                    data={
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {item?.image ? (
                          <Image
                            source={initWeatherIcon(item?.image)}
                            style={styles.iconWeather}
                            resizeMode="contain"
                          />
                        ) : (
                          <></>
                        )}
                        <CustomText
                          string={item?.desc}
                          family={FONT_FAMILY.SEMI_BOLD}
                          size={FONT.CAPTION_5}
                          color={colors.black}
                          numberOfLines={1}
                          textStyle={{marginTop: heightScale(2)}}
                        />
                      </View>
                    }
                    style={{flex: 1}}
                  />
                );
              })
            ) : (
              <></>
            )}
          </TableWrapper>

          <TableWrapper style={styles.wrapper}>
            <Cell
              data={
                <CustomText
                  string={strings?.modal_weather?.temperatures}
                  size={FONT.CAPTION_4}
                  textStyle={{
                    textAlign: 'center',
                  }}
                  color={colors.grayText}
                  family={FONT_FAMILY.BOLD}
                />
              }
              style={{flex: 1}}
            />

            {temp?.length ? (
              temp?.map((item, index) => {
                return (
                  <Cell
                    key={index}
                    data={
                      <HStack>
                        <CustomText
                          string={item}
                          family={FONT_FAMILY.BOLD}
                          size={FONT.CAPTION}
                          numberOfLines={1}
                        />
                        {item ? (
                          <Image
                            source={ICONS.icon_c}
                            style={styles.iconSize20}
                            resizeMode="contain"
                          />
                        ) : (
                          <></>
                        )}
                      </HStack>
                    }
                    style={{flex: 1, alignItems: 'center'}}
                  />
                );
              })
            ) : (
              <></>
            )}
          </TableWrapper>

          <TableWrapper style={styles.wrapper}>
            <Cell
              data={
                <CustomText
                  string={strings?.modal_weather?.probability}
                  size={FONT.CAPTION_4}
                  textStyle={{
                    textAlign: 'center',
                  }}
                  color={colors.grayText}
                  family={FONT_FAMILY.BOLD}
                />
              }
              style={{flex: 1}}
            />

            {chance?.length ? (
              chance?.map((item, index) => {
                return (
                  <Cell
                    key={index}
                    data={
                      <CustomText
                        string={item}
                        family={FONT_FAMILY.BOLD}
                        color={colors.darkBlue}
                        size={FONT.CAPTION}
                        numberOfLines={1}
                      />
                    }
                    style={{flex: 1, alignItems: 'center'}}
                  />
                );
              })
            ) : (
              <></>
            )}
          </TableWrapper>

          <TableWrapper style={styles.wrapper}>
            <Cell
              data={
                <CustomText
                  string={strings?.modal_weather?.humidity}
                  size={FONT.CAPTION_4}
                  textStyle={{
                    textAlign: 'center',
                  }}
                  color={colors.grayText}
                  family={FONT_FAMILY.BOLD}
                />
              }
              style={{flex: 1}}
            />

            {humidity?.length ? (
              humidity?.map((item, index) => {
                return (
                  <Cell
                    key={index}
                    data={
                      <CustomText
                        string={item}
                        family={FONT_FAMILY.BOLD}
                        size={FONT.CAPTION}
                        color={colors.darkBlue}
                        numberOfLines={1}
                      />
                    }
                    style={{flex: 1, alignItems: 'center'}}
                  />
                );
              })
            ) : (
              <></>
            )}
          </TableWrapper>
        </Table>

        <TouchableOpacity
          style={{alignItems: 'center', marginTop: PADDING_HEIGHT / 2}}
          onPress={hide}>
          <Image source={ICONS.btn_ok} style={styles.btnOk} resizeMode="contain" />
        </TouchableOpacity>

        <HStack style={styles.footer}>
          <TouchableOpacity onPress={handleOpenApp}>
            <Image source={ICONS.img_ci} style={styles.imgIc} resizeMode="contain" />
          </TouchableOpacity>
          <CustomText
            string={strings.modal_weather.open_weather_text}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION}
            color={colors.darkGray}
            textStyle={{
              flex: 1,
              marginLeft: PADDING / 2,
            }}
          />
        </HStack>
      </View>
    </Modal>
  );
});

export default memo(ModalWeather);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: width * 0.9,
    alignSelf: 'center',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: heightScale(50),
  },
  headerLeft: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    height: heightScale(45),
  },
  wrapper: {
    flexDirection: 'row',
    height: heightScale(50),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWeather: {
    width: widthScale(25),
    height: heightScale(25),
    tintColor: colors.darkBlue,
  },
  cellStyle: {
    paddingHorizontal: widthScale(5),
    paddingVertical: heightScale(2),
  },
  iconSize20: {
    width: widthScale(12),
    height: heightScale(12),
    tintColor: colors.black,
    position: 'absolute',
    right: -12,
    top: 0,
  },
  btnOk: {
    width: widthScale(100),
    height: heightScale(50),
  },
  imgIc: {
    width: widthScale(50),
    height: heightScale(40),
    marginLeft: widthScale(10),
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: PADDING_HEIGHT / 2,
    marginBottom: PADDING_HEIGHT,
  },
});
