import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomButton from '~components/commons/custom-button';
import HStack from '~components/h-stack';
import CustomTitleSub from '~components/vehicle-payment-usage-favorite-management/custom-title-sub';
import {PADDING1} from '~constants/constant';
import {FONT} from '~constants/enum';
import {CarModel} from '~model/car-model';
import {colors} from '~styles/colors';
import {scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  item: CarModel;
  onDefaultPress?: () => void;
  onDeletePress?: () => void;
}

const VehicleItem: React.FC<Props> = memo(props => {
  const {item, onDefaultPress, onDeletePress} = props;

  return (
    <HStack
      style={[
        styles.containerStyle,
        {
          borderColor: item?.mainCarYN === 'Y' ? colors.primary : colors.disableButton,
        },
      ]}>
      <View
        style={{
          flex: 1,
        }}>
        <CustomTitleSub
          title={item?.carNumber}
          subTitle={item?.carYear ? `${item?.carModel} • ${item?.carYear}` : `${item?.carModel}`}
        />
      </View>

      <HStack style={{gap: widthScale1(10)}}>
        <CustomButton
          onPress={() => {
            if (item?.mainCarYN === 'Y') {
              showMessage({
                message: '이미 대표 차량으로 설정된 차량입니다.',
              });
              return;
            }
            onDefaultPress && onDefaultPress();
          }}
          buttonStyle={styles.buttonStyle}
          text="대표"
          buttonHeight={38}
          textSize={FONT.CAPTION_6}
          type={item?.mainCarYN === 'Y' ? 'PRIMARY' : 'TERTIARY'}
          outLine={item?.mainCarYN === 'N' ? true : false}
        />

        {item?.mainCarYN === 'N' && (
          <CustomButton
            type="TERTIARY"
            onPress={onDeletePress}
            buttonStyle={styles.buttonStyle}
            text="삭제"
            buttonHeight={38}
            textSize={FONT.CAPTION_6}
          />
        )}
      </HStack>
    </HStack>
  );
});

export default VehicleItem;

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: PADDING1,
    borderWidth: 1,
    padding: PADDING1,
    borderRadius: scale1(8),
    gap: widthScale1(6),
  },
  buttonStyle: {
    paddingHorizontal: widthScale1(10),
    minWidth: widthScale1(45),
  },
});
