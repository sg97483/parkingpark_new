import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AddressKakaoProps} from '~constants/types';

interface SearchRecentLocation {
  searchRecent: AddressKakaoProps[];
}

const initialState: SearchRecentLocation = {
  searchRecent: [],
};

const searchRecentLocationSlice = createSlice({
  name: 'searchRecentLocation',
  initialState,
  reducers: {
    clearRecentData: () => initialState,
    cacheSearchRecent: (state, action: PayloadAction<AddressKakaoProps[]>) => {
      const newData = [...action.payload, ...(state?.searchRecent || [])].filter(
        (obj, index, self) =>
          obj.x !== undefined &&
          obj.y !== undefined &&
          index === self.findIndex(o => o.address_name === obj.address_name),
      );

      state.searchRecent = newData;
    },
    deleteRecent: (state, action: PayloadAction<number[]>) => {
      const newData = state.searchRecent.filter((_, index) => !action.payload.includes(index));
      state.searchRecent = newData;
    },
  },
});

export const {cacheSearchRecent, deleteRecent, clearRecentData} = searchRecentLocationSlice.actions;
const searchRecentLocationReducer = searchRecentLocationSlice.reducer;
export default searchRecentLocationReducer;
