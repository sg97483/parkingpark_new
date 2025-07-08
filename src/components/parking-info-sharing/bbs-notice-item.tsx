import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {BBSNoticeProps} from '~constants/types';
import HStack from '~components/h-stack';
import {ICONS} from '~/assets/images-path';
import {PADDING} from '~constants/constant';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import moment from 'moment';
import {colors} from '~styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';

interface Props {
  item: BBSNoticeProps;
}

const BBSNoticeItem: React.FC<Props> = memo(props => {
  const {item} = props;

  const navigation: UseRootStackNavigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(ROUTE_KEY.BBSNoticeDetail, {item});
      }}>
      <HStack style={styles.container}>
        <Image source={ICONS.icon_notice} style={styles.noticeIcon} resizeMode="contain" />
        <View style={styles.contentWrapper}>
          <CustomText string={item?.subject || ''} family={FONT_FAMILY.BOLD} color={'#D75E0E'} />
          <CustomText
            string={item?.text || ''}
            textStyle={{
              marginVertical: heightScale(10),
            }}
            color={'#8C5A43'}
          />
          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <CustomText
              string={moment(item?.regdate * 1000).format('MM.DD HH:mm')}
              size={FONT.CAPTION_2}
              color={colors.darkGray}
            />
            <HStack>
              <Icon name="chat-processing" size={widthScale(15)} color={'#E58603'} />
              <CustomText string={` ${item?.replyCount}`} size={FONT.CAPTION_2} color={'#E58603'} />
            </HStack>
          </HStack>
        </View>
      </HStack>
    </TouchableOpacity>
  );
});

export default BBSNoticeItem;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    backgroundColor: '#F2EEE3',
  },
  noticeIcon: {
    width: widthScale(40),
    aspectRatio: 1,
  },
  contentWrapper: {
    flex: 1,
    marginLeft: widthScale(15),
  },
});
