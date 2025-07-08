import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import Modal from 'react-native-modal';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {}

interface State {
  visible: boolean;
}

export default class Spinner extends React.PureComponent<Props, State> {
  static instance: any;

  constructor(props: Props) {
    super(props);
    Spinner.instance = this;
    this.state = {
      visible: false,
    };
  }

  static show() {
    if (Spinner.instance) {
      !Spinner.instance.state.visible && Spinner.instance.setState({visible: true});
    }
  }

  static hide() {
    if (Spinner.instance) {
      Spinner.instance.setState({visible: false});
    }
  }

  render() {
    if (!this.state.visible) {
      return null;
    }
    return (
      <Modal
        animationInTiming={0}
        animationOutTiming={0}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        backdropOpacity={0.4}
        useNativeDriver
        isVisible={this.state.visible || false}
        style={{
          margin: 0,
          padding: 0,
          flex: 1,
          zIndex: 1000,
        }}>
        <View
          style={{
            flex: 1,
            // backgroundColor: '#cdcdcd',
            justifyContent: 'center',
            alignItems: 'center',
            // opacity: 0.6,
          }}>
          <View
            style={[
              {
                width: widthScale(100),
                height: heightScale(100),
                backgroundColor: '#3c3939',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15,
              },
            ]}>
            <ActivityIndicator animating={true} color={colors.white} />
          </View>
        </View>
      </Modal>
    );
  }
}
