import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useCallback, useState} from 'react';
import {Pressable} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomTopTabItem from '~components/commons/custom-top-tab-item';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import GeneralInquiry from './general-inquiry';
import Report from './report';

const {Navigator, Screen} = createMaterialTopTabNavigator();

const ContactUs = (props: RootStackScreenProps<'ContactUs'>) => {
  const {navigation} = props;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [QNAFor, setQNAFor] = useState<string>('PARKING');

  const handleCreateQNA = useCallback(() => {
    if (QNAFor === 'PARKING') {
      navigation.navigate(ROUTE_KEY.ParkingRequestNoticeAdd);
      return;
    }
    if (QNAFor === 'DRIVER') {
      navigation.navigate(ROUTE_KEY.CarpoolRequestQNA, {mode: 'DRIVER'});
      return;
    }
    if (QNAFor === 'PASSENGER') {
      navigation.navigate(ROUTE_KEY.CarpoolRequestQNA, {mode: 'PASSENGER'});
      return;
    }
  }, [QNAFor]);

  return (
    <FixedContainer>
      <CustomHeader
        text="문의하기"
        rightContent={
          currentIndex === 0 && (
            <Pressable onPress={handleCreateQNA}>
              <Icons.PenLine />
            </Pressable>
          )
        }
      />
      <Navigator
        tabBar={props => <CustomTopTabItem {...props} onItemPress={setCurrentIndex} />}
        screenOptions={{
          lazy: true,
          swipeEnabled: false,
        }}>
        <Screen
          name="일반문의"
          children={() => {
            return <GeneralInquiry onModeChange={setQNAFor} />;
          }}
        />
        <Screen name="신고내역" component={Report} />
      </Navigator>
    </FixedContainer>
  );
};

export default ContactUs;
