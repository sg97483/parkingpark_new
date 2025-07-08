import {TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import {CouponProps} from '~constants/types';
import {Menu} from 'react-native-paper';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONT} from '~constants/enum';
import {widthScale} from '~styles/scaling-utils';

interface Props {
  onSelect: (amount: number) => void;
  data: CouponProps[];
}

const CouponSelector: React.FC<Props> = memo(props => {
  const {data, onSelect} = props;

  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = useState<string>('사용안함');

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={openMenu}>
              <HStack>
                <CustomText string={title} size={FONT.CAPTION} />

                <Icon name="menu-down" size={widthScale(20)} style={{marginLeft: widthScale(10)}} />
              </HStack>
            </TouchableOpacity>
          </View>
        }>
        {data?.map((item, index) => {
          return (
            <Menu.Item
              key={index}
              onPress={() => {
                setTitle(`${item?.c_name}/할인금액: ${item?.c_price}`);
                onSelect && onSelect(Number(item?.c_price));
                closeMenu();
              }}
              title={`${item?.c_name}/할인금액: ${item?.c_price}`}
            />
          );
        })}
      </Menu>
    </View>
  );
});

export default CouponSelector;
