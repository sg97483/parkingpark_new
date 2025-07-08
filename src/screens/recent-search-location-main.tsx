import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import React, {useMemo, useState, useCallback} from 'react';
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

const RecentSearchLocationMain = (props: RootStackScreenProps<'RecentSearchLocationMain'>) => {
  const dispatch = useAppDispatch();

  const isFocused = useIsFocused();

  const searchRecent = useAppSelector(state => state.searchRecentLocationReducer.searchRecent);

  const [listChoose, setListChoose] = useState<number[]>([]);

  // 화면 포커스가 되었을 때 포커싱 이벤트 처리
  useFocusEffect(
    useCallback(() => {
      DeviceEventEmitter.emit(EMIT_EVENT.FOCUS_INPUT_WAY_2);
      return () => {
        // 필요한 정리 작업
      };
    }, []),
  );

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

export default RecentSearchLocationMain;

const styles = StyleSheet.create({
  button: {
    marginHorizontal: PADDING1,
    marginTop: heightScale1(10),
    marginBottom: PADDING1 / 2,
  },
});
