import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import CustomButton from '~components/commons/custom-button';
import CustomCheckbox from '~components/commons/custom-checkbox';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {PADDING1} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {heightScale1} from '~styles/scaling-utils';

const CarpoolPrivacyDetail = (props: RootStackScreenProps<'CarpoolPrivacyDetail'>) => {
  const {navigation, route} = props;

  const isFocused = useIsFocused();

  const {acceptCarpool, disagreeCarpool, isChecked} = route.params;

  const [disableButon, setDisableButton] = useState(!isChecked);

  useEffect(() => {
    if (!isFocused) {
      disableButon && disagreeCarpool?.();
    }
  }, [isFocused]);

  const onPressButton = () => {
    acceptCarpool?.();
    navigation.goBack();
  };

  return (
    <FixedContainer>
      <CustomHeader text="개인정보 처리방침" headerTextStyle={styles.textHeader} />

      <WebView
        style={styles.contentView}
        source={{
          uri: 'https://wisemobile.notion.site/c0d7df4d63e64e1db545f01b83f05e30?pvs=4',
        }}
        startInLoadingState={true}
        originWhitelist={['*']}
      />

      <View style={{marginHorizontal: PADDING1}}>
        <CustomCheckbox
          onPress={() => setDisableButton(!disableButon)}
          isChecked={!disableButon}
          style={styles.checkBox}
          text="위 내용에 동의합니다."
        />

        <CustomButton
          onPress={onPressButton}
          text={'확인'}
          type="PRIMARY"
          disabled={disableButon}
          buttonHeight={58}
        />
      </View>
    </FixedContainer>
  );
};

export default CarpoolPrivacyDetail;

const styles = StyleSheet.create({
  text: {
    lineHeight: heightScale1(18),
    marginTop: heightScale1(25),
  },
  textHeader: {
    textAlign: 'center',
  },
  contentView: {
    paddingHorizontal: PADDING1,
  },
  checkBox: {
    marginVertical: heightScale1(10),
    alignSelf: 'baseline',
  },
});
