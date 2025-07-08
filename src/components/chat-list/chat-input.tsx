import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {Keyboard, LayoutAnimation, Pressable, StyleSheet, TextInput, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Icons} from '~/assets/svgs';
import HStack from '~components/h-stack';
import ImagePickerModal, {ImagePickerModalRefs} from '~components/image-picker-modal';
import Spinner from '~components/spinner';
import {IS_IOS, PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {ImageProps} from '~constants/types';
import {ChatRoomModel} from '~model/chat-model';
import {useSendFCMNotiMutation} from '~services/notiServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {generateFileName} from '~utils/common';
import {handleOpenCamera, handleOpenPhotoLibrary} from '~utils/photoUtils';
import ChatToolButton from './chat-tool-button';
import FrequentlyUsedPhrases, {FrequentlyUsedPhrasesRefs} from './frequently-used-phrases';

interface Props {
  userFCMToken: string;
  onSuccess?: () => void;
  chatRoomInfo: ChatRoomModel;
  messageCount: {
    passenger: number;
    driver: number;
    isDriverReply: boolean;
  };
  driverName: string;
}

const ChatInput: React.FC<Props> = memo(props => {
  const {onSuccess, userFCMToken, chatRoomInfo} = props;
  const my_uid = auth().currentUser?.uid;
  const imagePickerRef = useRef<ImagePickerModalRefs>(null);
  const myNickname = useAppSelector(state => state?.userReducer?.user?.nic);
  const frequentlyUsedPhrasesRef = useRef<FrequentlyUsedPhrasesRefs>(null);
  const roomID = useMemo(() => chatRoomInfo?.roomID ?? '', [chatRoomInfo?.roomID]);

  const [sendFCM] = useSendFCMNotiMutation();

  const [message, setMessage] = useState<string>('');
  const [showTool, setShowTool] = useState<boolean>(false);

  const handleSendNoti = async (type: string) => {
    await sendFCM({
      userToken: userFCMToken,
      title: myNickname || '',
      body: type === '0' ? message.trim() : `${myNickname} 님이 사진을 보냈습니다.`,
      data: {
        chatRoomData: JSON.stringify(chatRoomInfo),
      },
    });
  };

  const updateUnreadMessages = async (roomId: string, myId: string) => {
    try {
      const documentSnapshot = await firestore().collection('rooms').doc(roomId).get();

      const users = {...documentSnapshot.data()?.users} as Record<string, number>;

      for (const key in users) {
        if (myId !== key) {
          const unread = users[key];
          users[key] = unread + 1;
        }
      }

      await firestore().collection('rooms').doc(roomId).update({
        users: users,
      });
    } catch (error) {
      console.error('Error updating unread messages:', error);
    }
  };

  const handleSendImage = async (image: ImageProps) => {
    setTimeout(() => {
      try {
        Keyboard.dismiss();
        Spinner.show();
        const name = generateFileName();
        const imageURI = IS_IOS ? image?.uri.replace('file://', '') : image?.uri;
        storage()
          .ref(`filesmall/${name}`)
          .putFile(imageURI)
          .then(() => {
            firestore()
              .collection('rooms')
              .doc(roomID)
              .collection('messages')
              .add({
                uid: my_uid,
                msg: name,
                msgtype: '1',
                timestamp: firestore.FieldValue.serverTimestamp(),
                readUsers: [my_uid],
                filename: name,
              })
              .then(async () => {
                await firestore()
                  .collection('rooms')
                  .doc(roomID)
                  .update({
                    uid: my_uid,
                    msg: name,
                    msgtype: '1',
                    timestamp: firestore.FieldValue.serverTimestamp(),
                    readUsers: [my_uid],
                    filename: name,
                    lastDatetime: moment().format('YYYY.MM.DD HH:mm'),
                  })
                  .then(async () => {
                    return await updateUnreadMessages(roomID, my_uid as string);
                  })
                  .then(() => {
                    setTimeout(async () => {
                      return await handleSendNoti('1');
                    }, 500);
                  });

                onSuccess && onSuccess();
              })
              .catch(error => {
                console.log('🚀 ~ file: chat-input.tsx:39 ~ handleSendTextMessage ~ error:', error);
              })
              .finally(() => Spinner.hide());
          });
      } catch (error) {}
    }, 501);
  };

  const handleSendTextMessage = () => {
    Keyboard.dismiss();

    const formatMessage = message.trim();

    if (formatMessage?.length === 0) {
      showMessage({
        message: '메시지를 입력하여 보내주시기 바랍니다.',
      });
      return;
    }
    setMessage('');

    firestore()
      .collection('rooms')
      .doc(roomID)
      .collection('messages')
      .add({
        uid: my_uid,
        msg: formatMessage,
        msgtype: '0',
        timestamp: firestore.FieldValue.serverTimestamp(),
        readUsers: [my_uid],
      })
      .then(async () => {
        const documentSnapshot = await firestore().collection('rooms').doc(roomID).get();

        const users = {...documentSnapshot.data()?.users} as Record<string, number>;
        for (const key in users) {
          if (my_uid !== key) {
            const unread = users[key];
            users[key] = unread + 1;
          }
        }

        await firestore()
          .collection('rooms')
          .doc(roomID)
          .update({
            uid: my_uid,
            msg: formatMessage,
            msgtype: '0',
            timestamp: firestore.FieldValue.serverTimestamp(),
            readUsers: [my_uid],
            users: users,
            lastDatetime: moment().format('YYYY.MM.DD HH:mm'),
          });

        await handleSendNoti('0');

        onSuccess && onSuccess();
      })
      .catch(error => {
        console.log('🚀 ~ file: chat-input.tsx:39 ~ handleSendTextMessage ~ error:', error);
      });
  };

  const showToolToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowTool(!showTool);
  }, [showTool]);

  const handleOpenCameraAndSendMessage = () => {
    setShowTool(false);
    handleOpenCamera().then(res => {
      if (res) {
        handleSendImage(res);
      }
    });
  };

  const handleOpenPhotoLibraryAndSendMessage = () => {
    setShowTool(false);
    handleOpenPhotoLibrary().then(res => {
      if (res) {
        handleSendImage(res);
      }
    });
  };

  return (
    <View
      style={[
        styles.containerStyle,
        {
          marginBottom: showTool ? heightScale1(26) : heightScale1(8),
        },
      ]}>
      <HStack style={styles.inputWrapperStyle}>
        <Pressable onPress={showToolToggle}>
          {showTool ? (
            <Icons.IconX width={scale1(24)} height={scale1(24)} />
          ) : (
            <Icons.Plus width={scale1(24)} height={scale1(24)} />
          )}
        </Pressable>

        <HStack style={styles.inputContentStyle}>
          <TextInput
            style={styles.inputStyle}
            placeholderTextColor={colors.grayText}
            placeholder="메세지 보내기"
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <Pressable hitSlop={40} onPress={handleSendTextMessage}>
            <Icons.Send />
          </Pressable>
        </HStack>
      </HStack>

      {showTool && (
        <HStack style={styles.toolContainerStyle}>
          <ChatToolButton
            title="앨범"
            icon={<Icons.Gallery />}
            onPress={handleOpenPhotoLibraryAndSendMessage}
          />
          <ChatToolButton
            title="카메라"
            icon={<Icons.Camera />}
            onPress={handleOpenCameraAndSendMessage}
          />
          <ChatToolButton
            title="자주쓰는문구"
            icon={<Icons.Answer />}
            onPress={() => {
              showToolToggle();
              frequentlyUsedPhrasesRef?.current?.show();
            }}
          />
        </HStack>
      )}

      <ImagePickerModal ref={imagePickerRef} onImage={handleSendImage} />

      <FrequentlyUsedPhrases onSelectMessage={setMessage} ref={frequentlyUsedPhrasesRef} />
    </View>
  );
});

export default ChatInput;

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: PADDING1,
    marginTop: heightScale1(10),
  },
  inputWrapperStyle: {
    gap: widthScale1(8),
  },
  inputContentStyle: {
    backgroundColor: colors.policy,
    flex: 1,
    borderRadius: scale1(16 * 1.5),
    minHeight: heightScale1(44),
    maxHeight: heightScale1(44 * 3),
    paddingHorizontal: widthScale1(16),
    gap: widthScale1(10),
  },
  inputStyle: {
    flex: 1,
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
    padding: 0,
    paddingTop: 0,
  },
  toolContainerStyle: {
    marginTop: heightScale1(30),
    gap: widthScale1(16),
  },
});
