import moment from 'moment';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import ImageSelector from '~components/commons/image-selector';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import ImageViewer, {ImageViewRefs} from '~components/image-viewer';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ReplyProps} from '~constants/types';
import {userHook} from '~hooks/userHook';
import {RootStackScreenProps} from '~navigators/stack';
import {useLazyValetQnaBbsReplyQuery, useUpdateQNAReadStatusQuery} from '~services/parkingServices';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {getImageURL} from '~utils/getImageURL';
import {getDayName} from '~utils/hourUtils';

const ParkingRequestNoticeBoardDetail = memo(
  (props: RootStackScreenProps<'ParkingRequestNoticeBoardDetail'>) => {
    const {route} = props;
    const notice = route.params?.notice;
    const isReport = route.params?.isReport;

    const imageViewerRef = useRef<ImageViewRefs>(null);
    const [getListReply] = useLazyValetQnaBbsReplyQuery();
    const {userID} = userHook();

    const [lastestReply, setLastestReply] = useState<ReplyProps>();

    useUpdateQNAReadStatusQuery(
      {
        id: notice?.id,
      },
      {skip: userID !== notice?.memberId || notice?.replyYN === 'N'},
    );

    const handleGetListReply = () => {
      getListReply({
        bbsId: notice?.id,
        lastId: 0,
      })
        .unwrap()
        .then((res: ReplyProps[]) => {
          setLastestReply(res[0]);
        });
    };

    useEffect(() => {
      handleGetListReply();
    }, []);

    const isReply = useMemo((): boolean => notice?.replyCount > 0, [notice?.replyCount]);

    const renderStatus = useMemo(() => {
      if (isReport) {
        if (isReply) {
          return '처리완료';
        } else {
          return '처리예정';
        }
      } else {
        if (isReply) {
          return '답변완료';
        } else {
          return '답변대기';
        }
      }
    }, [isReply, isReport]);

    return (
      <FixedContainer>
        <CustomHeader text={isReport ? '상세 신고내역' : '상세 문의내역'} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.containerStyle}>
          <PaddingHorizontalWrapper>
            <HStack style={{gap: widthScale1(4)}}>
              <CustomText
                family={FONT_FAMILY.BOLD}
                string={`${notice?.subject}`}
                textStyle={{flexShrink: 1}}
                size={FONT.BODY}
                forDriveMe
              />
              <Icons.Dot width={widthScale1(2)} height={widthScale1(2)} fill={colors.lineCancel} />

              <CustomText
                string={renderStatus}
                color={Number(notice?.replyCount) > 0 ? colors.disableButton : colors.heavyGray}
                family={FONT_FAMILY.SEMI_BOLD}
                forDriveMe
              />
            </HStack>

            <CustomText
              string={`${moment(notice?.regdate * 1000).format('YY.MM.DD')}(${getDayName(
                moment(notice?.regdate * 1000).valueOf(),
              )}) ${moment(notice?.regdate * 1000).format('HH:mm')}`}
              color={colors.grayText}
              textStyle={styles.timeTextStyle}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
            />
          </PaddingHorizontalWrapper>

          <Divider style={styles.dividerStyle} />

          <PaddingHorizontalWrapper>
            <View style={styles.contentStyle}>
              <CustomText
                lineHeight={heightScale1(20)}
                string={notice?.text}
                family={FONT_FAMILY.MEDIUM}
                forDriveMe
              />
            </View>
          </PaddingHorizontalWrapper>

          <PaddingHorizontalWrapper containerStyles={{marginTop: PADDING1}}>
            <CustomText
              forDriveMe
              string="첨부이미지"
              textStyle={{marginBottom: heightScale1(10)}}
              family={FONT_FAMILY.MEDIUM}
              color={colors.black}
            />

            <ImageSelector
              mode="VIEW"
              imageURI={notice?.photoId ? (getImageURL(notice?.photoId, false) as any) : ''}
            />
          </PaddingHorizontalWrapper>

          {notice?.replyCount > 0 && (
            <View>
              <Divider style={styles.dividerStyle} />
              <PaddingHorizontalWrapper>
                <HStack
                  style={{
                    marginBottom: PADDING1,
                    gap: widthScale1(2),
                  }}>
                  <Icons.BubbleSingle />
                  <CustomText string="답변" forDriveMe family={FONT_FAMILY.MEDIUM} />
                </HStack>
                <View style={styles.contentStyle}>
                  <CustomText
                    lineHeight={heightScale1(20)}
                    forDriveMe
                    string={lastestReply?.text || ''}
                  />
                </View>
              </PaddingHorizontalWrapper>
            </View>
          )}
        </ScrollView>

        <ImageViewer ref={imageViewerRef} />
      </FixedContainer>
    );
  },
);

export default ParkingRequestNoticeBoardDetail;

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: PADDING1,
  },
  timeTextStyle: {
    marginTop: heightScale1(4),
  },
  dividerStyle: {
    marginTop: PADDING1,
    marginBottom: heightScale1(30),
  },
  contentStyle: {
    padding: PADDING1,
    borderWidth: 1,
    borderRadius: scale1(8),
    borderColor: colors.disableButton,
    backgroundColor: colors.policy,
    minHeight: heightScale1(110),
  },
});
