import {useNavigation} from '@react-navigation/native';
import React, {memo, useEffect} from 'react';
import {DeviceEventEmitter, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMAGES} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetUserInfoQuery} from '~services/userServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getImageURL} from '~utils/getImageURL';

interface Props {}

const UserInfo: React.FC<Props> = memo(props => {
  const navigation: UseRootStackNavigation = useNavigation();

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {refetch} = useGetUserInfoQuery(
    {
      id: userToken?.id,
      password: userToken?.password,
    },
    {skip: !userToken?.id || !userToken?.password},
  );

  useEffect(() => {
    const userUpdateListener = DeviceEventEmitter.addListener('UPDATED_USER', () => {
      refetch();
    });

    return () => {
      userUpdateListener.remove();
    };
  }, []);

  const userData = useAppSelector(state => state?.userReducer?.user);

  const handleLogin = () => {
    if (userData) {
      navigation.navigate(ROUTE_KEY.ProfileManagement);
    } else {
      navigation.navigate(ROUTE_KEY.Login);
    }
  };

  const handleSetting = () => {
    if (userData) {
      navigation.navigate(ROUTE_KEY.Setting);
    } else {
      navigation.navigate(ROUTE_KEY.Login);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={handleLogin}>
        <View style={styles.leftContent}>
          {userData ? (
            userData?.photoId ? (
              <Image
                source={{
                  uri: getImageURL(Number(userData?.photoId), true),
                }}
                style={styles.profileFace}
              />
            ) : (
              <Image source={IMAGES.profile_face} style={styles.profileFace} />
            )
          ) : null}
          <CustomText
            numberOfLines={1}
            string={userData ? userData?.nic : '로그인하세요'}
            size={FONT.SUB_HEAD}
            family={FONT_FAMILY.BOLD}
          />
        </View>

        <TouchableOpacity onPress={handleSetting}>
          <Icon name="cog" size={widthScale(25)} color={colors.black} />
        </TouchableOpacity>
      </TouchableOpacity>

      <HStack style={styles.row}>
        <TouchableOpacity
          onPress={() => {
            if (!userToken?.id || !userToken?.password) {
              navigation.navigate(ROUTE_KEY.Login);
              showMessage({
                message: strings?.general_text?.login_first,
              });
            } else {
              navigation.navigate(ROUTE_KEY.UsageHistoryOld);
            }
          }}>
          <HStack>
            <CustomText string={strings.drawer.usage_history} />
            <Icon name="chevron-right" size={widthScale(25)} color={colors.black} />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!userToken?.id || !userToken?.password) {
              navigation.navigate(ROUTE_KEY.Login);
              showMessage({
                message: strings?.general_text?.login_first,
              });
            } else {
              navigation.navigate(ROUTE_KEY.ProfileManagementOld);
            }
          }}>
          <HStack>
            <CustomText string={strings.drawer.information} />
            <Icon name="chevron-right" size={widthScale(25)} color={colors.black} />
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!userToken?.id || !userToken?.password) {
              navigation.navigate(ROUTE_KEY.Login);
              showMessage({
                message: strings?.general_text?.login_first,
              });
            } else {
              navigation.navigate(ROUTE_KEY.DepositMoney);
            }
          }}>
          <HStack>
            <CustomText string={strings.drawer.middle_charge} />
            <Icon name="chevron-right" size={widthScale(25)} color={colors.black} />
          </HStack>
        </TouchableOpacity>
      </HStack>
    </View>
  );
});

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: widthScale(10),
    marginTop: PADDING,
    padding: PADDING / 2,
    marginHorizontal: widthScale(3),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  profileFace: {
    width: widthScale(45),
    height: widthScale(45),
    marginRight: widthScale(10),
    borderRadius: 999,
    overflow: 'hidden',
  },
  row: {
    justifyContent: 'space-between',
    marginTop: heightScale(10),
    flexWrap: 'wrap',
  },
});
