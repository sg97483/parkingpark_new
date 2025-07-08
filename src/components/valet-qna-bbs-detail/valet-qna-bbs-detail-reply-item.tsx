import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY, GENDER, IS_ACTIVE} from '~constants/enum';
import {ReplyProps} from '~constants/types';
import {RootState} from '~store/store';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getBeforeTime} from '~utils/hourUtils';

interface IProps {
  item: ReplyProps;
  onPressReview: () => void;
  onPressDelete: (item: ReplyProps) => void;
}

const ValetQnaBbsDetailReplyItem: React.FC<IProps> = ({
  item,
  onPressReview,
  onPressDelete,
}: IProps) => {
  const memberNic = item?.memberNic || '';
  const text = item?.text || '';
  const gender = item?.gender || '';
  const regDate = item?.regdate || 0;
  const beforeTime = getBeforeTime(regDate * 1000);
  const memberId = item?.memberId || 0;
  const userToken = useSelector((state: RootState) => state.userReducer.userToken);

  const isVisibleDeleteBtn = memberId === userToken?.id || userToken?.adminYN === IS_ACTIVE.YES;

  return (
    <TouchableWithoutFeedback>
      {/* 👇 이 부분이 수정되었습니다. (그림자를 담당하는 View로 감싸기) */}
      <View style={styles.shadowContainer}>
        <View style={styles.contentWrapper}>
          <HStack style={{justifyContent: 'space-between'}}>
            {/* left content */}
            <HStack>
              <CustomText
                string={memberNic}
                color={gender === GENDER.MALE ? colors.littlePurple : colors.originalPink}
                family={FONT_FAMILY.SEMI_BOLD}
              />
              <View style={styles.divider} />
              <CustomText
                string={`${moment(regDate * 1000).format('MM.DD HH:mm')} `}
                size={FONT.CAPTION_2}
                color={colors.darkGray}
              />
            </HStack>

            {/* right content */}
            {beforeTime ? (
              <HStack>
                <Image source={ICONS.icon_time} style={styles.iconTime} />
                <CustomText
                  string={beforeTime}
                  size={FONT.CAPTION_3}
                  color={colors.darkGray}
                  textStyle={{marginLeft: heightScale(5)}}
                />
              </HStack>
            ) : null}
          </HStack>

          <CustomText string={text} size={FONT.CAPTION_2} textStyle={{marginTop: PADDING / 2}} />

          <HStack style={styles.buttonWrapper}>
            {isVisibleDeleteBtn ? ( // 삭제 버튼 조건부 렌더링은 유지, 답글 버튼은 onPressReview로 대체된 것으로 보임
              <TouchableOpacity onPress={() => onPressDelete(item)}>
                <Image
                  source={ICONS.btn_reply_delete}
                  style={styles.deleteReply}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null}
            {/* 원래 코드에서는 isVisibleDeleteBtn 조건일 때 chevron_right (답글달기 추정) 아이콘이 있었고,
                그 옆에 항상 btn_reply_delete (삭제하기) 아이콘이 있었습니다.
                UX상 isVisibleDeleteBtn (내가 쓴 글 또는 관리자)일 때만 삭제가 가능하고,
                onPressReview (답글달기)는 다른 조건이거나 항상 가능해야 할 수 있습니다.
                아래는 원래 구조를 최대한 따르되, isVisibleDeleteBtn 로직을 삭제 버튼에만 적용한 예입니다.
                만약 답글달기(onPressReview) 버튼이 항상 보여야 한다면 아래 주석을 해제하고,
                isVisibleDeleteBtn과 별개로 렌더링하거나, 다른 조건을 사용해야 합니다.
             */}
            {/* <TouchableOpacity onPress={onPressReview} style={{ marginRight: isVisibleDeleteBtn ? PADDING / 2 : 0 }}>
              <Image
                source={ICONS.chevron_right} // 이 아이콘이 '답글달기' 기능이라면 명확한 아이콘으로 교체하는 것이 좋습니다.
                style={styles.chevronRight}
                resizeMode="contain"
              />
            </TouchableOpacity> */}
          </HStack>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ValetQnaBbsDetailReplyItem;

const styles = StyleSheet.create({
  // container 스타일은 사용되지 않아 제거했습니다.
  // 그림자를 담당하는 외부 컨테이너
  shadowContainer: {
    marginBottom: heightScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  // 실제 내용을 담는 내부 컨테이너
  contentWrapper: {
    minHeight: heightScale(100),
    backgroundColor: colors.white,
    padding: PADDING / 2,
    // borderRadius가 있다면 여기에 추가하고 overflow: 'hidden'을 설정하는 것이 좋습니다.
    // 예: borderRadius: widthScale(8), overflow: 'hidden',
  },
  divider: {
    width: 1,
    height: heightScale(20),
    backgroundColor: colors.gray,
    marginHorizontal: widthScale(5),
  },
  iconTime: {
    width: widthScale(14),
    height: heightScale(14),
    resizeMode: 'contain',
    tintColor: colors.darkGray,
  },
  chevronRight: {
    // 이 스타일은 현재 JSX에서 직접 사용되지 않습니다.
    width: widthScale(36),
    height: heightScale(36),
    tintColor: colors.gray,
  },
  deleteReply: {
    width: widthScale(50),
    height: heightScale(40),
  },
  buttonWrapper: {
    marginTop: PADDING_HEIGHT / 2,
    // marginLeft: -PADDING / 2, // 왼쪽 정렬을 위해 제거하거나 조정 가능
    justifyContent: 'flex-end', // 버튼들을 오른쪽으로 정렬
  },
});
