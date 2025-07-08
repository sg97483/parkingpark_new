import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {widthScale} from '~styles/scaling-utils';

interface Props {
  text: string;
  onPress: () => void;
}
const ButtonBorder = ({text, onPress}: Props) => (
  <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: widthScale(1),
    borderColor: '#EBEBEB',
    borderRadius: 20,
    alignSelf: 'flex-end',
    padding: widthScale(7),
    paddingHorizontal: widthScale(12),
  },
  buttonText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ButtonBorder;
