import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';

interface Props {}

interface State {
  visible: boolean;
}

export default class NoInternetModal extends React.PureComponent<Props, State> {
  static instance: any;

  constructor(props: Props) {
    super(props);
    NoInternetModal.instance = this;
    this.state = {
      visible: false,
    };
  }

  static show() {
    if (NoInternetModal.instance) {
      !NoInternetModal.instance.state.visible &&
        NoInternetModal.instance.setState({
          visible: true,
        });
    }
  }

  static hide() {
    if (NoInternetModal.instance) {
      NoInternetModal.instance?.state?.onPress && NoInternetModal.instance?.state?.onPress();
      NoInternetModal.instance.setState({visible: false});
    }
  }

  render() {
    if (NoInternetModal?.instance?.state?.visible) {
      return (
        <ReactNativeModal
          isVisible={this.state.visible || false}
          style={styles.modal}
          animationInTiming={600}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          onBackButtonPress={() => {}}
          onBackdropPress={() => {}}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>네트워크 연결 문제</Text>
            <Text style={styles.modalText}>
              인터넷 연결 상태가 좋지 않습니다. 네트워크 상태를 다시 확인해주세요.
            </Text>
          </View>
        </ReactNativeModal>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 18,
    color: '#555',
    marginTop: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});
