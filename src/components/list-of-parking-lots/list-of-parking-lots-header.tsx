import React from 'react';
import {StyleSheet} from 'react-native';
import Button from '~components/button';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {LIST_OF_PARKING_FILTER_TYPE} from '~constants/enum';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface IProps {
  onSelect: (value: LIST_OF_PARKING_FILTER_TYPE) => void;
  selectedFilter: LIST_OF_PARKING_FILTER_TYPE;
}

const ListOfParkingLotsHeader = ({onSelect, selectedFilter}: IProps) => {
  return (
    <HStack style={styles.headerWrapper}>
      {/* filter by charge */}
      <Button
        text={strings.list_of_parking_lots.filter_by_price}
        onPress={() => onSelect(LIST_OF_PARKING_FILTER_TYPE.CHARGE_INCREASE)}
        borderColor={
          selectedFilter === LIST_OF_PARKING_FILTER_TYPE.CHARGE_INCREASE
            ? colors.black
            : colors.darkGray
        }
        color={
          selectedFilter === LIST_OF_PARKING_FILTER_TYPE.CHARGE_INCREASE
            ? colors.black
            : colors.white
        }
        style={[styles.button]}
        textColor={
          selectedFilter === LIST_OF_PARKING_FILTER_TYPE.CHARGE_INCREASE
            ? colors.white
            : colors.darkGray
        }
      />

      <Button
        text={strings.list_of_parking_lots.filter_by_distance}
        onPress={() => onSelect(LIST_OF_PARKING_FILTER_TYPE.DISTANCE_INCREASE)}
        borderColor={
          selectedFilter === LIST_OF_PARKING_FILTER_TYPE.DISTANCE_INCREASE
            ? colors.black
            : colors.darkGray
        }
        color={
          selectedFilter === LIST_OF_PARKING_FILTER_TYPE.DISTANCE_INCREASE
            ? colors.black
            : colors.white
        }
        style={[
          styles.button,
          {
            marginLeft: widthScale(10),
          },
        ]}
        textColor={
          selectedFilter === LIST_OF_PARKING_FILTER_TYPE.DISTANCE_INCREASE
            ? colors.white
            : colors.darkGray
        }
      />
    </HStack>
  );
};

export default ListOfParkingLotsHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: PADDING / 2,
    marginBottom: PADDING / 2,
    justifyContent: 'flex-end',
  },
  button: {
    width: widthScale(100),
    borderRadius: widthScale(20),
    minHeight: heightScale(40),
  },
  menuContainer: {
    width: '50%',
    padding: PADDING / 2,
    borderRadius: widthScale(4),
    shadowRadius: widthScale(12),
    marginTop: heightScale(45),
  },
});
