import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import CustomButton from './commons/custom-button';
import CustomText from './custom-text';
import HStack from './h-stack';

interface Props {}
interface State {
  visible: boolean;
  title: string;
  content: string;
  textYes?: string;
  yesFunc: () => void | null;
  isTwoButton?: boolean;
  textNo?: string;
  noFunc?: () => void | null;
}
export default class AppModal extends React.PureComponent<Props, State> {
  static instance: any;

  constructor(props: Props) {
    super(props);
    AppModal.instance = this;
    this.state = {
      visible: false,
      title: '삭제하시겠습니까?',
      content: '',
      textYes: '',
      yesFunc: () => {},
      isTwoButton: false,
      textNo: '',
      noFunc: () => {},
    };
  }

  static show({
    title = '',
    content = '',
    textYes = '',
    yesFunc = () => {},
    textNo = '',
    noFunc = () => {},
    isTwoButton = false,
  }: {
    title: string;
    content: string;
    textYes: string;
    yesFunc: () => void;
    textNo?: string;
    noFunc?: () => void;
    isTwoButton?: boolean;
  }) {
    if (AppModal.instance) {
      !AppModal.instance.state.visible &&
        AppModal.instance.setState({
          visible: true,
          title,
          content,
          textYes,
          yesFunc,
          textNo,
          noFunc,
          isTwoButton,
        });
    }
  }

  static hide() {
    if (AppModal.instance) {
      AppModal.instance.setState({visible: false});
    }
  }

  hide() {
    if (AppModal.instance) {
      AppModal.instance.setState({visible: false});
    }
  }

  render() {
    if (AppModal?.instance?.state?.visible) {
      return (
        <Modal
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          style={styles.container}
          isVisible={this.state.visible}
          onBackButtonPress={this.hide}
          onBackdropPress={this.hide}
          useNativeDriver
          backdropColor={colors.black}
          backdropOpacity={0.6}>
          <View style={styles.content}>
            <CustomText
              string={this.state.title}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              lineHeight={heightScale1(25.2)}
              textStyle={{textAlign: 'center'}}
              forDriveMe
            />

            {this.state.content && (
              <CustomText
                string={this.state.content}
                lineHeight={heightScale1(20)}
                color={colors.grayText2}
                textStyle={{textAlign: 'center', marginTop: heightScale1(10)}}
                forDriveMe
              />
            )}

            {this.state.isTwoButton ? (
              <HStack style={styles.row}>
                <CustomButton
                  buttonHeight={58}
                  type="TERTIARY"
                  onPress={() => {
                    this.hide();
                    this.state.noFunc ? this.state.noFunc() : null;
                  }}
                  text={this.state.textNo || ''}
                  buttonStyle={styles.leftButton}
                />

                <CustomButton
                  buttonHeight={58}
                  onPress={() => {
                    this.hide();
                    this.state.yesFunc ? this.state.yesFunc() : null;
                  }}
                  text={this.state.textYes || ''}
                  buttonStyle={styles.leftButton}
                />
              </HStack>
            ) : (
              <View style={styles.confirmButton}>
                <CustomButton
                  onPress={() => {
                    this.hide();
                    this.state.yesFunc ? this.state.yesFunc() : null;
                  }}
                  text={this.state.textYes || ''}
                  buttonHeight={58}
                />
              </View>
            )}
          </View>
        </Modal>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    width: widthScale1(310),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  content: {
    backgroundColor: colors.white,
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(20),
    borderRadius: widthScale1(8),
  },
  row: {
    marginTop: heightScale1(30),
    gap: widthScale1(10),
  },
  leftButton: {
    flex: 1,
  },
  confirmButton: {
    marginTop: heightScale1(30),
  },
});
