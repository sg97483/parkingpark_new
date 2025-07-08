import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import EmptyList from '~components/commons/empty-list';
import PageButton from '~components/commons/page-button';
import {PADDING1} from '~constants/constant';
import {heightScale1} from '~styles/scaling-utils';

interface Props {
  onPress: () => void;
  buttonText?: string;
}

const MyRouteEmpty: React.FC<Props> = memo(props => {
  const {onPress, buttonText} = props;

  return (
    <View style={styles.containerStyle}>
      <PageButton
        text={buttonText ? buttonText : '경로 등록하고 드라이버 모드 시작하기'}
        onPress={onPress}
      />

      <EmptyList text="등록된 경로가 없습니다." top={heightScale1(186)} />
    </View>
  );
});

export default MyRouteEmpty;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: PADDING1,
  },
});
