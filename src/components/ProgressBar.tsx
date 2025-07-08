import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // progress 값 변경 시 실행되는 부분
    // 여기서는 0.5초마다 progress를 증가시키는 예시
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 0.1;
        return newProgress > 1 ? 0 : newProgress; // 1 이상이 되면 0으로 초기화
      });
    }, 500);

    return () => clearInterval(timer); // 컴포넌트가 언마운트되면 타이머 정리
  }, []);

  const progressWidth = new Animated.Value(progress);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progressBar,
          {width: progressWidth.interpolate({inputRange: [0, 1], outputRange: ['0%', '100%']})},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196f3',
  },
});

export default ProgressBar;
