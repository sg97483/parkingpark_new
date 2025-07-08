import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {DeviceEventEmitter, FlatList, StyleSheet} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import ItemAddressSearch from '~components/commons/item-address-search';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT} from '~constants/enum';
import {AddressKakaoProps} from '~constants/types';
import {RootStackScreenProps} from '~navigators/stack';
import {deleteRecent} from '~reducers/searchRecentLocationsReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

const RecentSearchLocation = (props: RootStackScreenProps<'RecentSearchLocation'>) => {
  const dispatch = useAppDispatch();

  const isFocused = useIsFocused();

  const searchRecent = useAppSelector(state => state.searchRecentLocationReducer.searchRecent);

  const [listChoose, setListChoose] = useState<number[]>([]);

  useEffect(() => {
    if (!isFocused) {
      setTimeout(() => {
        DeviceEventEmitter.emit(EMIT_EVENT.FOCUS_INPUT_WAY_2);
      }, 500);
    }
  }, [isFocused]);

  const deleteAddress = () => {
    dispatch(deleteRecent(listChoose));
    setListChoose([]);
  };

  const disabledButton = useMemo(() => !listChoose.length, [listChoose]);

  const isCheckAll = useMemo(() => {
    return (
      listChoose.length === searchRecent.length && listChoose.every(index => searchRecent[index])
    );
  }, [listChoose, searchRecent]);

  const renderItem = ({item, index}: {item: AddressKakaoProps; index: number}) => {
    return (
      <ItemAddressSearch
        colorName={colors.menuTextColor}
        item={item}
        isChecked={listChoose.includes(index)}
        isCheckBox
        hideArrive
        isPark={item.isParking}
        onPress={() => {
          if (listChoose.includes(index)) {
            const newList = listChoose.filter(item => item !== index);
            setListChoose(newList);
          } else {
            const newList = [...listChoose];
            newList.push(index);
            setListChoose(newList);
          }
        }}
      />
    );
  };

  return (
    <FixedContainer>
      <CustomHeader text="최근 검색 기록 편집" />
      <FlatList
        ListHeaderComponent={
          <ItemAddressSearch
            checkAll={true}
            colorName={colors.menuTextColor}
            item={{address_name: '전체선택'} as any}
            isChecked={isCheckAll}
            isCheckBox
            hideArrive
            onPress={() => {
              setListChoose(isCheckAll ? [] : Array.from(searchRecent.keys()));
            }}
          />
        }
        keyExtractor={item => item.address_name}
        renderItem={renderItem}
        data={searchRecent}
      />
      <CustomButton
        disabled={disabledButton}
        buttonHeight={58}
        buttonStyle={styles.button}
        text="삭제"
        onPress={deleteAddress}
      />
    </FixedContainer>
  );
};

export default RecentSearchLocation;

const styles = StyleSheet.create({
  button: {
    marginHorizontal: PADDING1,
    marginTop: heightScale1(10),
    marginBottom: PADDING1 / 2,
  },
});
