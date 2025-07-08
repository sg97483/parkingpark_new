import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import React, {forwardRef, Ref, useCallback, useImperativeHandle, useState} from 'react';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import CustomText from './custom-text';
import {FONT_FAMILY} from '~constants/enum';
import WebView from 'react-native-webview';
import Button from './button';
import {sleep} from '~utils/index';

export interface RefObject {
  show: () => void;
  hide: () => void;
  setDataProps: (url: string, code: number) => void;
}
interface Props {}

const ConnectedCarPopup = forwardRef(({}: Props, ref: Ref<RefObject>) => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({url: '', code: 0});

  useImperativeHandle(ref, () => ({
    show,
    hide,
    setDataProps,
  }));

  const setDataProps = async (url: string, code: number) => {
    console.log(url);

    setData({code: code, url: url});
    await sleep(200);
    show();
  };

  const show = useCallback(() => setShowModal(true), []);
  const hide = useCallback(() => setShowModal(false), []);

  const onShouldStartLoadWithRequest = (event: any) => {
    const url = event.url;

    if (url.includes('profile_conected_end.php')) {
      console.log('profile_conected_end.php 누름');

      return false;
    } else if (
      url.includes('profile_hyun_confirm.php') ||
      url.includes('profile_kia_confirm.php') ||
      url.includes('profile_gen_confirm.php')
    ) {
      console.log('return nè ');
      return false;
    }

    return true;
  };

  return (
    <Modal
      animationType={'fade'}
      visible={showModal}
      onRequestClose={hide}
      hardwareAccelerated
      onDismiss={hide}
      transparent
      style={styles.view}>
      <View style={styles.viewContent}>
        <View style={styles.viewContent1}>
          <View style={styles.textHeader}>
            <CustomText string="커넥티드카 연동" color={colors.white} family={FONT_FAMILY.BOLD} />
          </View>
          <WebView
            setBuiltInZoomControls={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={{flex: 1}}>
                <ActivityIndicator />
              </View>
            )}
            source={{
              uri: data?.url,
            }}
            javaScriptEnabled={true}
            builtInZoomControls={true}
            networkAvailable={true}
            allowContentAccess={true}
            domStorageEnabled={true}
            useWebKit={true}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            mixedContentMode="always"
            thirdPartyCookiesEnabled={true}
            originWhitelist={['*']}
          />
          <Button
            text="나가기"
            onPress={hide}
            style={styles.button}
            color={colors.white}
            textColor={colors.blue}
            borderColor={colors.blue}
          />
        </View>
      </View>
    </Modal>
  );
});

export default ConnectedCarPopup;

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(100),
  },
  viewContent1: {
    backgroundColor: colors.white,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  textHeader: {
    width: '100%',
    backgroundColor: colors.redButton,
    paddingVertical: heightScale(8),
    paddingLeft: widthScale(10),
  },
  button: {
    borderRadius: widthScale(20),
    width: widthScale(100),
    alignSelf: 'center',
    marginVertical: heightScale(10),
  },
});
