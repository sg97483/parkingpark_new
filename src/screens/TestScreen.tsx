// src/screens/TestScreen.tsx

import React from 'react';
import {View, Text} from 'react-native';

const TestScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'lightgreen',
    }}>
    <Text style={{fontSize: 24, color: 'black', fontWeight: 'bold'}}>테스트 화면이 보입니다!</Text>
    <Text style={{marginTop: 10, color: 'black'}}>내비게이션 기능이 정상 동작합니다.</Text>
  </View>
);

export default TestScreen;
