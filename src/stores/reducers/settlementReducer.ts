import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SettlementState {
  settlementMethod: 'RECHARGE' | 'ACCOUNT';
  paymentAccount: {
    bankName: string;
    accountNumber: string;
    ownerName: string;
  };
}

const initialState: SettlementState = {
  settlementMethod: 'RECHARGE',
  paymentAccount: {
    bankName: '',
    accountNumber: '',
    ownerName: '',
  },
};

const settlementSlice = createSlice({
  name: 'parkingReducer',
  initialState,
  reducers: {
    clearParkingData: () => initialState,
    changeSettlementMethod: (
      state: SettlementState,
      action: PayloadAction<'RECHARGE' | 'ACCOUNT'>,
    ) => {
      state.settlementMethod = action.payload;
    },
    onSavePaymentAccount: (
      state: SettlementState,
      action: PayloadAction<{
        bankName: string;
        accountNumber: string;
        ownerName: string;
      }>,
    ) => {
      state.paymentAccount = action.payload;
    },
  },
});

export const {clearParkingData, changeSettlementMethod, onSavePaymentAccount} =
  settlementSlice.actions;
const settlementReducer = settlementSlice.reducer;
export default settlementReducer;
