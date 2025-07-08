import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {unionBy} from 'lodash';
import {PARKING_FILTER_TYPE} from '~constants/enum';
import {PhotoOfParkingProps, ValetQnaBbsProps} from '~constants/types';
import {parkingServices} from '~services/parkingServices';

interface ParkingState {
  parkingList: any[];
  parkingFilter: PARKING_FILTER_TYPE[];
  parkingPhotos: PhotoOfParkingProps[];
  listQNA: ValetQnaBbsProps[];
}

const initialState: ParkingState = {
  parkingList: [],
  parkingFilter: [],
  parkingPhotos: [],
  listQNA: [],
};

const parkingSlice = createSlice({
  name: 'parkingReducer',
  initialState,
  reducers: {
    clearParkingData: () => initialState,
    cacheParkingList: (state: ParkingState, action: PayloadAction<any[]>) => {
      state.parkingList = action.payload;
    },
    cacheParkingFilter: (state, action: PayloadAction<PARKING_FILTER_TYPE[]>) => {
      state.parkingFilter = action.payload;
    },
    cacheParkingPhotos: (state: ParkingState, action: PayloadAction<PhotoOfParkingProps[]>) => {
      state.parkingPhotos = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      parkingServices.endpoints.getListValetQnaBbs.matchFulfilled,
      (state, action) => {
        const {meta, payload} = action;
        const lastID = meta?.arg?.originalArgs?.lastID;
        if (lastID === 0) {
          state.listQNA = payload;
        } else {
          state.listQNA = unionBy([...state.listQNA, ...payload], 'id');
        }
      },
    );
  },
});

export const {cacheParkingList, clearParkingData, cacheParkingFilter, cacheParkingPhotos} =
  parkingSlice.actions;
const parkingReducer = parkingSlice.reducer;
export default parkingReducer;
