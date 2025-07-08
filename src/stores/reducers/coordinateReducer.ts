import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CordinateProps} from '~constants/types';

interface coordinateState {
  userCordinate: CordinateProps | undefined;
}

const initialState: coordinateState = {
  userCordinate: undefined,
};

const coordinateSlice = createSlice({
  name: 'coordinateReducer',
  initialState,
  reducers: {
    cacheUserCordinate: (state, action: PayloadAction<CordinateProps>) => {
      state.userCordinate = action.payload;
    },
  },
});

export const {cacheUserCordinate} = coordinateSlice.actions;
const coordinateReducer = coordinateSlice.reducer;
export default coordinateReducer;
