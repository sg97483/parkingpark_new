import {ActivityIndicator, View} from 'react-native';
import React from 'react';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import WebView from 'react-native-webview';
import {RootStackScreenProps} from '~navigators/stack';
import {useSelector} from 'react-redux';
import {RootState} from '~store/store';

const VehicleNumberAdd = ({navigation}: RootStackScreenProps<'VehicleNumberAdd'>) => {
  const userToken = useSelector((state: RootState) => state.userReducer.userToken);
  const myUrl = 'http://cafe.wisemobile.kr/imobile/partner_list/car_number/a_car_number.php';

  const url = myUrl + `?memberId=${userToken?.id}`;

  return (
    <FixedContainer>
      <CustomHeader text={'차량정보 추가등록'} />
      <WebView
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{flex: 1}}>
            <ActivityIndicator />
          </View>
        )}
        source={{
          uri: url,
        }}
        originWhitelist={['*']}
      />
    </FixedContainer>
  );
};

export default VehicleNumberAdd;
