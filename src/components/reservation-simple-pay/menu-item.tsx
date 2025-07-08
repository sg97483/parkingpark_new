import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface MenuItemProps {
  title: string;
  content: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = memo(props => {
  const {content, title} = props;

  return (
    <HStack style={styles.container}>
      <View style={styles.titleWrapper}>
        <CustomText string={title} />
      </View>
      <View style={{flex: 1}}>{content}</View>
    </HStack>
  );
});

export default MenuItem;

const styles = StyleSheet.create({
  container: {
    minHeight: heightScale(30),
    marginBottom: heightScale(5),
  },
  titleWrapper: {
    width: widthScale(100),
  },
});
