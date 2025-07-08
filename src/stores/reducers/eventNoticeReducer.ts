import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface EventNoticeState {
  getNoticeToday: {
    show: boolean;
    date: null | number;
  };
}

const initialState: EventNoticeState = {
  getNoticeToday: {
    show: true,
    date: null,
  },
};

const eventNoticeSlice = createSlice({
  name: 'eventNoticeReducer',
  initialState,
  reducers: {
    clearEventNoticeData: () => initialState,
    cacheEventNoticeToday: (
      state: EventNoticeState,
      action: PayloadAction<{show: boolean; date: null | number}>,
    ) => {
      state.getNoticeToday = action.payload;
    },
  },
});

export const {cacheEventNoticeToday, clearEventNoticeData} = eventNoticeSlice.actions;
const eventNoticeReducer = eventNoticeSlice.reducer;
export default eventNoticeReducer;
